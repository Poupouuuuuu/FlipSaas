-- Migration: Add quantity, permanent, variants, and sold linking support
-- Run this in Supabase SQL Editor (https://supabase.com/dashboard → SQL Editor)

-- 1. Add new columns to items table
ALTER TABLE items
  ADD COLUMN IF NOT EXISTS quantity INT NOT NULL DEFAULT 1,
  ADD COLUMN IF NOT EXISTS is_permanent BOOL NOT NULL DEFAULT false,
  ADD COLUMN IF NOT EXISTS variants JSONB,
  ADD COLUMN IF NOT EXISTS sold_from_id UUID REFERENCES items(id) ON DELETE SET NULL,
  ADD COLUMN IF NOT EXISTS size_label TEXT;

-- 2. Add index for grouping sold items by parent
CREATE INDEX IF NOT EXISTS idx_items_sold_from_id ON items(sold_from_id) WHERE sold_from_id IS NOT NULL;

-- 3. Add check constraint: quantity must be >= 0
ALTER TABLE items ADD CONSTRAINT items_quantity_check CHECK (quantity >= 0);
