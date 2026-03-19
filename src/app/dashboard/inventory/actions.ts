'use server'

import { createClient } from '@/utils/supabase/server'
import { revalidatePath } from 'next/cache'

export async function addItem(formData: FormData) {
  const title = formData.get('title') as string
  const purchase_price = Number(formData.get('purchase_price'))
  const listed_price = Number(formData.get('listed_price'))
  const image = formData.get('image') as File | null

  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    throw new Error('Utilisateur non connecté')
  }

  let image_url = null

  if (image && image.size > 0) {
    const fileExt = image.name.split('.').pop()
    // create a random filename
    const fileName = `${Math.random().toString(36).substring(2, 15)}_${Date.now()}.${fileExt}`
    const filePath = `${user.id}/${fileName}`

    const { error: uploadError, data: uploadData } = await supabase.storage
      .from('items-images')
      .upload(filePath, image)

    if (uploadError) {
      throw new Error("Erreur lors de l'upload de l'image")
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
  const itemId = formData.get('item_id') as string
  const status = formData.get('status') as 'en_transit' | 'vendu'
  const sold_price = formData.get('sold_price') ? Number(formData.get('sold_price')) : null

  const supabase = await createClient()

  // Si on passe directement en "Vendu", il nous faut le prix de vente
  // Si on passe "En transit", pas forcément besoin du prix de vente, mais on peut le renseigner
  const payload: any = { status }
  
  if (sold_price) {
    payload.sold_price = sold_price
  }

  if (status === 'vendu') {
    payload.sold_at = new Date().toISOString()
  }

  const { error } = await supabase
    .from('items')
    .update(payload)
    .eq('id', itemId)

  if (error) {
    throw new Error("Erreur de mise à jour du statut")
  }

  revalidatePath('/dashboard')
  revalidatePath('/dashboard/inventory')
}

export async function deleteItem(formData: FormData) {
  const itemId = formData.get('item_id') as string
  const supabase = await createClient()

  // Opt: On devrait aussi supprimer l'image du storage, mais par simplicité, on garde l'image orpheline pour le moment, ou on rajoute une logique ici.
  
  const { error } = await supabase.from('items').delete().eq('id', itemId)

  if (error) throw new Error("Erreur lors de la suppression de l'article")

  revalidatePath('/dashboard')
  revalidatePath('/dashboard/inventory')
}
