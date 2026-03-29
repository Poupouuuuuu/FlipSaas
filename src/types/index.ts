export interface Item {
  id: string
  user_id: string
  title: string
  purchase_price: number
  listed_price: number
  image_url: string | null
  status: 'en_stock' | 'en_transit' | 'vendu'
  sold_price: number | null
  sold_at: string | null
  created_at: string
}

export interface Expense {
  id: string
  user_id: string
  title: string
  amount: number
  date: string
}

export interface UserProfile {
  id: string
  email: string
  role: string | null
  subscription_status: string | null
  stripe_customer_id: string | null
  has_onboarded: boolean
  created_at: string
}
