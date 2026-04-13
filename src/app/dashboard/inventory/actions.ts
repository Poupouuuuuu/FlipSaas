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
  const variantsRaw = formData.get('variants')
  let parsedVariants = null
  if (variantsRaw && typeof variantsRaw === 'string') {
    try { parsedVariants = JSON.parse(variantsRaw) } catch { parsedVariants = null }
  }

  const parsed = addItemSchema.safeParse({
    title: formData.get('title'),
    purchase_price: Number(formData.get('purchase_price')),
    listed_price: Number(formData.get('listed_price')),
    quantity: Number(formData.get('quantity')) || 1,
    is_permanent: formData.get('is_permanent') === 'true',
    variants: parsedVariants,
  })

  if (!parsed.success) {
    throw new Error(parsed.error.issues[0].message)
  }

  const { title, purchase_price, listed_price, quantity, is_permanent, variants } = parsed.data
  const image = formData.get('image') as File | null

  // Vérifier la limite free tier (3 articles max)
  const { data: profile } = await supabase
    .from('users')
    .select('subscription_status, role')
    .eq('id', user.id)
    .single()

  const { hasFullAccess: hasAccess } = await import('@/lib/subscription')
  if (!hasAccess(profile?.subscription_status ?? null, profile?.role ?? null)) {
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
    status: 'en_stock',
    quantity,
    is_permanent,
    variants,
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
  const sizeLabel = formData.get('size_label') as string | null

  // Validation Zod
  const parsed = markItemStatusSchema.safeParse({
    status: formData.get('status'),
    sold_price: formData.get('sold_price') ? Number(formData.get('sold_price')) : null,
  })

  if (!parsed.success) {
    throw new Error(parsed.error.issues[0].message)
  }

  const { status, sold_price } = parsed.data

  // Fetch the original item
  const { data: originalItem } = await supabase
    .from('items')
    .select('*')
    .eq('id', itemId)
    .eq('user_id', user.id)
    .single()

  if (!originalItem) {
    throw new Error("Article introuvable ou non autorisé")
  }

  // Multi-quantity item: create a sold copy and decrement
  if (originalItem.quantity > 1) {
    // Create sold copy
    const { error: insertError } = await supabase.from('items').insert({
      user_id: user.id,
      title: originalItem.title,
      purchase_price: originalItem.purchase_price,
      listed_price: originalItem.listed_price,
      image_url: originalItem.image_url,
      status,
      sold_price: sold_price || null,
      sold_at: status === 'vendu' ? new Date().toISOString() : null,
      quantity: 1,
      is_permanent: false,
      sold_from_id: originalItem.id,
      size_label: sizeLabel || null,
    })

    if (insertError) throw new Error("Erreur lors de la création de la vente")

    // Decrement quantity on original
    const newQty = originalItem.quantity - 1

    // Update variants if applicable
    let updatedVariants = originalItem.variants
    if (updatedVariants && sizeLabel) {
      updatedVariants = (updatedVariants as { size: string; qty: number }[])
        .map(v => v.size === sizeLabel ? { ...v, qty: v.qty - 1 } : v)
        .filter(v => v.qty > 0)
      if (updatedVariants.length === 0) updatedVariants = null
    }

    const { error: updateError } = await supabase
      .from('items')
      .update({ quantity: newQty, variants: updatedVariants })
      .eq('id', itemId)
      .eq('user_id', user.id)

    if (updateError) throw new Error("Erreur lors de la mise à jour du stock")

  } else {
    // Single quantity: update in place (original behavior)
    const payload: Partial<Item> = { status }

    if (sold_price) payload.sold_price = sold_price
    if (status === 'vendu') payload.sold_at = new Date().toISOString()

    // For permanent items going to 0, keep the original for restock dialog
    if (originalItem.is_permanent) {
      // Create sold copy instead of converting
      const { error: insertError } = await supabase.from('items').insert({
        user_id: user.id,
        title: originalItem.title,
        purchase_price: originalItem.purchase_price,
        listed_price: originalItem.listed_price,
        image_url: originalItem.image_url,
        status,
        sold_price: sold_price || null,
        sold_at: status === 'vendu' ? new Date().toISOString() : null,
        quantity: 1,
        is_permanent: false,
        sold_from_id: originalItem.id,
        size_label: sizeLabel || null,
      })

      if (insertError) throw new Error("Erreur lors de la création de la vente")

      // Set quantity to 0 but keep the item
      const { error: updateError } = await supabase
        .from('items')
        .update({ quantity: 0 })
        .eq('id', itemId)
        .eq('user_id', user.id)

      if (updateError) throw new Error("Erreur lors de la mise à jour du stock")
    } else {
      // Non-permanent single item: convert directly
      const { error, count } = await supabase
        .from('items')
        .update(payload, { count: 'exact' })
        .eq('id', itemId)
        .eq('user_id', user.id)

      if (error) throw new Error("Erreur de mise à jour du statut")
      if (count === 0) throw new Error("Article introuvable ou non autorisé")
    }
  }

  revalidatePath('/dashboard')
  revalidatePath('/dashboard/inventory')
}

export async function restockItem(formData: FormData) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) throw new Error('Utilisateur non connecté')

  const itemId = formData.get('item_id') as string
  const newQuantity = Number(formData.get('quantity'))

  if (!newQuantity || newQuantity < 1) throw new Error('Quantité invalide')

  const { error, count } = await supabase
    .from('items')
    .update({ quantity: newQuantity }, { count: 'exact' })
    .eq('id', itemId)
    .eq('user_id', user.id)
    .eq('is_permanent', true)

  if (error) throw new Error("Erreur lors du restockage")
  if (count === 0) throw new Error("Article introuvable")

  revalidatePath('/dashboard')
  revalidatePath('/dashboard/inventory')
}

export async function removeItem(formData: FormData) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) throw new Error('Utilisateur non connecté')

  const itemId = formData.get('item_id') as string

  const { error } = await supabase
    .from('items')
    .delete()
    .eq('id', itemId)
    .eq('user_id', user.id)

  if (error) throw new Error("Erreur lors de la suppression")

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
