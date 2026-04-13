import { z } from 'zod'

const sizeVariantSchema = z.object({
  size: z.string().min(1),
  qty: z.number().int().min(1),
})

export const addItemSchema = z.object({
  title: z.string().min(1, 'Le titre est requis').max(100, 'Le titre ne doit pas dépasser 100 caractères'),
  purchase_price: z.number().min(0, 'Le prix d\'achat doit être positif'),
  listed_price: z.number().min(0, 'Le prix affiché doit être positif'),
  quantity: z.number().int().min(1, 'La quantité doit être au moins 1').default(1),
  is_permanent: z.boolean().default(false),
  variants: z.array(sizeVariantSchema).nullable().default(null),
})

export const editItemSchema = z.object({
  title: z.string().min(1, 'Le titre est requis').max(100, 'Le titre ne doit pas dépasser 100 caractères'),
  listed_price: z.number().min(0, 'Le prix affiché doit être positif'),
})

export const markItemStatusSchema = z.object({
  status: z.enum(['en_transit', 'vendu'], { message: 'Statut invalide' }),
  sold_price: z.number().min(0, 'Le prix de vente doit être positif').nullable(),
})

export const addExpenseSchema = z.object({
  title: z.string().min(1, 'Le titre est requis').max(200, 'Le titre ne doit pas dépasser 200 caractères'),
  amount: z.number().min(0, 'Le montant doit être positif'),
})
