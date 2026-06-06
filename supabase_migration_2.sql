ALTER TABLE product_customization 
  ADD COLUMN IF NOT EXISTS title_color TEXT DEFAULT '#ffffff',
  ADD COLUMN IF NOT EXISTS description_color TEXT DEFAULT '#94A3B8',
  ADD COLUMN IF NOT EXISTS title_font TEXT DEFAULT 'default',
  ADD COLUMN IF NOT EXISTS description_font TEXT DEFAULT 'default',
  ADD COLUMN IF NOT EXISTS bg_image_storage_url TEXT,
  ADD COLUMN IF NOT EXISTS border_color TEXT DEFAULT '#3b82f6',
  ADD COLUMN IF NOT EXISTS border_width NUMERIC DEFAULT 1.5;

ALTER TABLE product_customization DROP COLUMN IF EXISTS text_color;

ALTER TABLE products 
  ADD COLUMN IF NOT EXISTS category TEXT DEFAULT 'Model',
  ADD COLUMN IF NOT EXISTS styles JSONB DEFAULT '{}'::jsonb;
