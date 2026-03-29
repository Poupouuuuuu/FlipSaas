'use server'

import { createClient } from '@/utils/supabase/server'
import { revalidatePath } from 'next/cache'
import type { Item } from '@/types'
import { addItemSchema, editItemSchema, markItemStatusSchema } from '@/lib/validations'

export async function addItem(formData: FormData) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    throw new Error('Utilisateur non connecté')
  }

  // Validation Zod
  const parsed = addItemSchema.safeParse({
    title: formData.get('title'),
    purchase_price: Number(formData.get('purchase_price')),
    listed_price: Number(formData.get('listed_price')),
  })

  if (!parsed.success) {
    throw new Error(parsed.error.issues[0].message)
  }

  const { title, purchase_price, listed_price } = parsed.data
  const image = formData.get('image') as File | null

  // Vérifier la limite free tier (3 articles max)
  const { data: profile } = await supabase
    .from('users')
    .select('subscription_status, role')
    .eq('id', user.id)
    .single()

  if (profile?.subscription_status !== 'active' && profile?.role !== 'admin') {
    const { count } = await supabase
      .from('items')
      .select('*', { count: 'exact', head: true })
      .eq('user_id', user.id)

    if ((count || 0) >= 3) {
      throw new Error('Limite atteinte. Abonnez-vous pour ajouter des articles illimités.')
    }
  }

  let image_url = null

  if (image && image.size > 0) {
    const fileExt = image.name.split('.').pop()
    const fileName = `${Math.random().toString(36).substring(2, 15)}_${Date.now()}.${fileExt}`
    const filePath = `${user.id}/${fileName}`

    const { error: uploadError } = await supabase.storage
      .from('items-images')
      .upload(filePath, image)

    if (uploadError) {
      console.error('Upload error:', uploadError)
      throw new Error("Erreur lors de l'upload de l'image: " + uploadError.message)
    }

    const { data: publicUrlData } = supabase.storage
      .from('items-images')
      .getPublicUrl(filePath)

    image_url = publicUrlData.publicUrl
  }

  const { error } = await supabase.from('items').insert({
    user_id: user.id,
    title,
    purchase_price,
    listed_price,
    image_url,
    status: 'en_stock'
  })

  if (error) {
    throw new Error("Erreur lors de l'ajout de l'article")
  }

  revalidatePath('/dashboard')
  revalidatePath('/dashboard/inventory')
}

export async function markItemAsSoldOrTransit(formData: FormData) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    throw new Error('Utilisateur non connecté')
  }

  const itemId = formData.get('item_id') as string

  // Validation Zod
  const parsed = markItemStatusSchema.safeParse({
    status: formData.get('status'),
    sold_price: formData.get('sold_price') ? Number(formData.get('sold_price')) : null,
  })

  if (!parsed.success) {
    throw new Error(parsed.error.issues[0].message)
  }

  const { status, sold_price } = parsed.data

  const payload: Partial<Pick<Item, 'status' | 'sold_price' | 'sold_at'>> = { status }

  if (sold_price) {
    payload.sold_price = sold_price
  }

  if (status === 'vendu') {
    payload.sold_at = new Date().toISOString()
  }

  // Ownership check : .eq('user_id', user.id)
  const { error, count } = await supabase
    .from('items')
    .update(payload, { count: 'exact' })
    .eq('id', itemId)
    .eq('user_id', user.id)

  if (error) {
    throw new Error("Erreur de mise à jour du statut")
  }

  if (count === 0) {
    throw new Error("Article introuvable ou non autorisé")
  }

  revalidatePath('/dashboard')
  revalidatePath('/dashboard/inventory')
}

export async function deleteItem(formData: FormData) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    throw new Error('Utilisateur non connecté')
  }

  const itemId = formData.get('item_id') as string

  // Récupérer l'image avant suppression (avec ownership check)
  const { data: item } = await supabase
    .from('items')
    .select('image_url')
    .eq('id', itemId)
    .eq('user_id', user.id)
    .single()

  if (!item) {
    throw new Error("Article introuvable ou non autorisé")
  }

  if (item.image_url) {
    const storagePath = item.image_url.split('/items-images/')[1]
    if (storagePath) {
      const { error: storageError } = await supabase.storage.from('items-images').remove([storagePath])
      if (storageError) console.error('Erreur suppression image:', storageError.message)
    }
  }

  const { error } = await supabase
    .from('items')
    .delete()
    .eq('id', itemId)
    .eq('user_id', user.id)

  if (error) throw new Error("Erreur lors de la suppression de l'article")

  revalidatePath('/dashboard')
  revalidatePath('/dashboard/inventory')
}

export async function editItem(formData: FormData) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    throw new Error('Utilisateur non connecté')
  }

  const itemId = formData.get('item_id') as string

  // Validation Zod
  const parsed = editItemSchema.safeParse({
    title: formData.get('title'),
    listed_price: Number(formData.get('listed_price')),
  })

  if (!parsed.success) {
    throw new Error(parsed.error.issues[0].message)
  }

  const { title, listed_price } = parsed.data
  const image = formData.get('image') as File | null

  const payload: Partial<Pick<Item, 'title' | 'listed_price' | 'image_url'>> = { title, listed_price }

  // Handle image update if a new file was provided
  if (image && image.size > 0) {
    // Supprimer l'ancienne image si elle existe (avec ownership check)
    const { data: existingItem } = await supabase
      .from('items')
      .select('image_url')
      .eq('id', itemId)
      .eq('user_id', user.id)
      .single()

    if (!existingItem) {
      throw new Error("Article introuvable ou non autorisé")
    }

    if (existingItem.image_url) {
      const oldPath = existingItem.image_url.split('/items-images/')[1]
      if (oldPath) {
        const { error: removeError } = await supabase.storage.from('items-images').remove([oldPath])
        if (removeError) console.error('Erreur suppression ancienne image:', removeError.message)
      }
    }

    const fileExt = image.name.split('.').pop()
    const fileName = `${Math.random().toString(36).substring(2, 15)}_${Date.now()}.${fileExt}`
    const filePath = `${user.id}/${fileName}`

    const { error: uploadError } = await supabase.storage
      .from('items-images')
      .upload(filePath, image)

    if (uploadError) {
      console.error('Upload error:', uploadError)
      throw new Error("Erreur lors de l'upload de l'image: " + uploadError.message)
    }

    const { data: publicUrlData } = supabase.storage
      .from('items-images')
      .getPublicUrl(filePath)

    payload.image_url = publicUrlData.publicUrl
  }

  // Ownership check : .eq('user_id', user.id)
  const { error, count } = await supabase
    .from('items')
    .update(payload, { count: 'exact' })
    .eq('id', itemId)
    .eq('user_id', user.id)

  if (error) throw new Error("Erreur lors de la modification de l'article")

  if (count === 0) {
    throw new Error("Article introuvable ou non autorisé")
  }

  revalidatePath('/dashboard')
  revalidatePath('/dashboard/inventory')
}
