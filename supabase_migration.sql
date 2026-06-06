-- Run after base schema. Adds fields the Next.js app expects.

ALTER TABLE products
  ADD COLUMN IF NOT EXISTS price INT DEFAULT 0 NOT NULL,
  ADD COLUMN IF NOT EXISTS category TEXT DEFAULT 'Model',
  ADD COLUMN IF NOT EXISTS styles JSONB DEFAULT '{}'::jsonb;

-- product_likes (if not created yet)
CREATE TABLE IF NOT EXISTS product_likes (
  id BIGSERIAL PRIMARY KEY,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  product_id BIGINT REFERENCES products(id) ON DELETE CASCADE NOT NULL,
  UNIQUE(user_id, product_id)
);

ALTER TABLE product_customization
  ADD COLUMN IF NOT EXISTS title_color TEXT DEFAULT '#ffffff',
  ADD COLUMN IF NOT EXISTS description_color TEXT DEFAULT '#94A3B8',
  ADD COLUMN IF NOT EXISTS title_font TEXT DEFAULT 'default',
  ADD COLUMN IF NOT EXISTS description_font TEXT DEFAULT 'default',
  ADD COLUMN IF NOT EXISTS bg_image_storage_url TEXT;

ALTER TABLE product_customization DROP COLUMN IF EXISTS text_color;

-- Optional download link for inbox (purchase / delivery); deleting the row does not remove storage
ALTER TABLE notifications
  ADD COLUMN IF NOT EXISTS attachment_url TEXT;
