-- ==========================================================================
-- HUSEN ONLINE MARKETING — Permanent Supabase Database Schema
-- Run this in your Supabase SQL Editor (https://supabase.com/dashboard/project/hhkaotnpohmkklbobplh/sql)
-- ==========================================================================

-- 1. PRODUCTS TABLE
CREATE TABLE IF NOT EXISTS public.products (
  id TEXT PRIMARY KEY,
  name JSONB NOT NULL DEFAULT '{"en":"","am":"","om":""}'::jsonb,
  description JSONB NOT NULL DEFAULT '{"en":"","am":"","om":""}'::jsonb,
  price INTEGER NOT NULL DEFAULT 0,
  category TEXT NOT NULL DEFAULT 'general',
  secondary_category TEXT DEFAULT '',
  images TEXT[] NOT NULL DEFAULT '{}',
  image_public_ids TEXT[] DEFAULT '{}',
  in_stock BOOLEAN NOT NULL DEFAULT true,
  sort_order INTEGER DEFAULT 0,
  badge JSONB DEFAULT '{"en":"","am":"","om":""}'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- 2. CATEGORIES TABLE
CREATE TABLE IF NOT EXISTS public.categories (
  id TEXT PRIMARY KEY,
  name JSONB NOT NULL DEFAULT '{"en":"","am":"","om":""}'::jsonb,
  icon TEXT DEFAULT '🏷️',
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- 3. ORDERS TABLE
CREATE TABLE IF NOT EXISTS public.orders (
  id TEXT PRIMARY KEY,
  customer TEXT NOT NULL DEFAULT '',
  phone TEXT NOT NULL DEFAULT '',
  items JSONB NOT NULL DEFAULT '[]'::jsonb,
  items_summary TEXT DEFAULT '',
  location TEXT DEFAULT '',
  address TEXT DEFAULT '',
  payment_method TEXT DEFAULT '',
  total INTEGER NOT NULL DEFAULT 0,
  status TEXT NOT NULL DEFAULT 'Pending',
  sms_sent BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- 4. ADMINS TABLE
CREATE TABLE IF NOT EXISTS public.admins (
  username TEXT PRIMARY KEY,
  password_hash TEXT NOT NULL,
  role TEXT NOT NULL DEFAULT 'staff',
  name TEXT DEFAULT '',
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- 5. ACTIVITY LOGS TABLE (For Owner Audit Trail)
CREATE TABLE IF NOT EXISTS public.activity_logs (
  id BIGSERIAL PRIMARY KEY,
  actor TEXT NOT NULL,
  action TEXT NOT NULL,
  target TEXT DEFAULT '',
  details JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- 6. STORE SETTINGS TABLE
CREATE TABLE IF NOT EXISTS public.settings (
  id TEXT PRIMARY KEY DEFAULT 'store_settings',
  cbe_account TEXT DEFAULT '1000123456789',
  cbe_account_name TEXT DEFAULT 'Husen Online Store',
  telebirr_phone TEXT DEFAULT '0923245529',
  telebirr_account_name TEXT DEFAULT 'Husen Market',
  chapa_secret_key TEXT DEFAULT '',
  updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- Enable Row Level Security (RLS)
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.admins ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.activity_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.settings ENABLE ROW LEVEL SECURITY;

-- Public read policies for storefront
DROP POLICY IF EXISTS "Public read products" ON public.products;
CREATE POLICY "Public read products" ON public.products FOR SELECT USING (true);

DROP POLICY IF EXISTS "Public read categories" ON public.categories;
CREATE POLICY "Public read categories" ON public.categories FOR SELECT USING (true);

DROP POLICY IF EXISTS "Public read settings" ON public.settings;
CREATE POLICY "Public read settings" ON public.settings FOR SELECT USING (true);

-- Insert initial admin user (PBKDF2 hash of husenonlinemarketing1234)
INSERT INTO public.admins (username, password_hash, role, name)
VALUES (
  'owner',
  'bc8f99d331258b26ffc96764ae6eaff2:eb8ec37498caa203dfc2b778a58820b3364489c3cddf07724becdcc9caa93e8d75737d4f55d22b8a0b563abcfeb8b1744f7aa44cafe7eb9e0a8fd047f2a35092',
  'owner',
  'Store Owner (ሁሴን)'
)
ON CONFLICT (username) DO NOTHING;

-- Insert initial staff user (PBKDF2 hash of staff1234)
INSERT INTO public.admins (username, password_hash, role, name)
VALUES (
  'staff',
  '91dba731490c636675b69acf9653e050:a09e609a0690c46b2c2312288f6be9f4671f463516f0575e4c61f592f508ce4d4e047512337fe83756e99ceb97add67e157f3bd41ae4b0b38ec82ba9b63bf8ab',
  'staff',
  'Staff Member'
)
ON CONFLICT (username) DO NOTHING;
