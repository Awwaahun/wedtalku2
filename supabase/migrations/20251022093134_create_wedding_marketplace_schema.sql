/*
  # Wedding Website Marketplace Schema

  ## Overview
  Platform untuk menjual template website pernikahan digital dengan sistem authentication dan manajemen produk.

  ## New Tables
  
  ### 1. `profiles`
  - `id` (uuid, primary key) - User ID dari auth.users
  - `email` (text) - Email pengguna
  - `full_name` (text) - Nama lengkap
  - `role` (text) - Role: 'admin' atau 'customer'
  - `created_at` (timestamptz) - Waktu pembuatan
  - `updated_at` (timestamptz) - Waktu update terakhir

  ### 2. `wedding_templates`
  - `id` (uuid, primary key) - ID template
  - `title` (text) - Judul template
  - `description` (text) - Deskripsi template
  - `price` (numeric) - Harga template
  - `preview_url` (text) - URL preview template
  - `thumbnail_url` (text) - URL gambar thumbnail
  - `demo_url` (text) - URL demo template
  - `features` (jsonb) - Array fitur template
  - `category` (text) - Kategori: 'modern', 'classic', 'minimalist', 'elegant'
  - `is_featured` (boolean) - Apakah featured
  - `status` (text) - Status: 'active', 'draft', 'sold'
  - `views_count` (integer) - Jumlah views
  - `created_at` (timestamptz) - Waktu pembuatan
  - `updated_at` (timestamptz) - Waktu update

  ### 3. `purchases`
  - `id` (uuid, primary key) - ID pembelian
  - `user_id` (uuid, foreign key) - ID pembeli
  - `template_id` (uuid, foreign key) - ID template
  - `price_paid` (numeric) - Harga yang dibayar
  - `purchase_date` (timestamptz) - Tanggal pembelian
  - `access_url` (text) - URL akses template
  - `status` (text) - Status: 'completed', 'pending'

  ## Security
  - Enable RLS on all tables
  - Profiles: Users can read all profiles, update own profile
  - Templates: Everyone can read active templates, only admins can modify
  - Purchases: Users can read own purchases, admins can read all
*/

-- Create profiles table
CREATE TABLE IF NOT EXISTS profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email text NOT NULL,
  full_name text DEFAULT '',
  role text DEFAULT 'customer' CHECK (role IN ('admin', 'customer')),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read profiles"
  ON profiles FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Users can update own profile"
  ON profiles FOR UPDATE
  TO authenticated
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can insert own profile"
  ON profiles FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = id);

-- Create wedding_templates table
CREATE TABLE IF NOT EXISTS wedding_templates (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  description text NOT NULL,
  price numeric NOT NULL DEFAULT 0,
  preview_url text DEFAULT '',
  thumbnail_url text DEFAULT '',
  demo_url text DEFAULT '',
  features jsonb DEFAULT '[]'::jsonb,
  category text DEFAULT 'modern' CHECK (category IN ('modern', 'classic', 'minimalist', 'elegant')),
  is_featured boolean DEFAULT false,
  status text DEFAULT 'active' CHECK (status IN ('active', 'draft', 'sold')),
  views_count integer DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE wedding_templates ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read active templates"
  ON wedding_templates FOR SELECT
  USING (status = 'active' OR auth.uid() IN (
    SELECT id FROM profiles WHERE role = 'admin'
  ));

CREATE POLICY "Only admins can insert templates"
  ON wedding_templates FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE profiles.id = auth.uid() 
      AND profiles.role = 'admin'
    )
  );

CREATE POLICY "Only admins can update templates"
  ON wedding_templates FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE profiles.id = auth.uid() 
      AND profiles.role = 'admin'
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE profiles.id = auth.uid() 
      AND profiles.role = 'admin'
    )
  );

CREATE POLICY "Only admins can delete templates"
  ON wedding_templates FOR DELETE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE profiles.id = auth.uid() 
      AND profiles.role = 'admin'
    )
  );

-- Create purchases table
CREATE TABLE IF NOT EXISTS purchases (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  template_id uuid REFERENCES wedding_templates(id) ON DELETE CASCADE NOT NULL,
  price_paid numeric NOT NULL,
  purchase_date timestamptz DEFAULT now(),
  access_url text DEFAULT '',
  status text DEFAULT 'completed' CHECK (status IN ('completed', 'pending'))
);

ALTER TABLE purchases ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can read own purchases"
  ON purchases FOR SELECT
  TO authenticated
  USING (
    user_id = auth.uid() OR 
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE profiles.id = auth.uid() 
      AND profiles.role = 'admin'
    )
  );

CREATE POLICY "Authenticated users can create purchases"
  ON purchases FOR INSERT
  TO authenticated
  WITH CHECK (user_id = auth.uid());

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_templates_status ON wedding_templates(status);
CREATE INDEX IF NOT EXISTS idx_templates_category ON wedding_templates(category);
CREATE INDEX IF NOT EXISTS idx_templates_featured ON wedding_templates(is_featured);
CREATE INDEX IF NOT EXISTS idx_purchases_user ON purchases(user_id);
CREATE INDEX IF NOT EXISTS idx_purchases_template ON purchases(template_id);

-- Insert sample wedding templates
INSERT INTO wedding_templates (title, description, price, thumbnail_url, demo_url, features, category, is_featured, status)
VALUES
  (
    'Elegant Rose',
    'Template pernikahan elegan dengan nuansa bunga mawar dan desain modern. Cocok untuk pasangan yang menginginkan tampilan romantis dan mewah.',
    2500000,
    'https://images.pexels.com/photos/1444442/pexels-photo-1444442.jpeg?auto=compress&cs=tinysrgb&w=800',
    '#',
    '["RSVP Online", "Countdown Timer", "Photo Gallery", "Love Story Timeline", "Gift Registry", "Live Streaming", "Guest Book Digital", "Google Maps Integration"]'::jsonb,
    'elegant',
    true,
    'active'
  ),
  (
    'Modern Minimalist',
    'Desain minimalis dengan tata letak bersih dan modern. Perfect untuk pasangan yang menyukai kesederhanaan namun tetap elegan.',
    1800000,
    'https://images.pexels.com/photos/265722/pexels-photo-265722.jpeg?auto=compress&cs=tinysrgb&w=800',
    '#',
    '["RSVP Online", "Countdown Timer", "Photo Gallery", "Love Story", "Gift Registry", "Music Player", "Guest Book"]'::jsonb,
    'minimalist',
    true,
    'active'
  ),
  (
    'Classic Romance',
    'Template klasik dengan sentuhan vintage yang timeless. Menampilkan ornamen klasik yang indah dan warna-warna hangat.',
    2200000,
    'https://images.pexels.com/photos/1616113/pexels-photo-1616113.jpeg?auto=compress&cs=tinysrgb&w=800',
    '#',
    '["RSVP Online", "Countdown Timer", "Photo Gallery Vintage Filter", "Love Story", "Gift Registry", "Guest Book", "Music Background"]'::jsonb,
    'classic',
    true,
    'active'
  ),
  (
    'Garden Dream',
    'Website pernikahan dengan tema taman yang segar dan natural. Menampilkan ilustrasi bunga dan dedaunan yang cantik.',
    1950000,
    'https://images.pexels.com/photos/1024967/pexels-photo-1024967.jpeg?auto=compress&cs=tinysrgb&w=800',
    '#',
    '["RSVP Online", "Countdown", "Photo Gallery", "Story", "Gift Registry", "Maps"]'::jsonb,
    'modern',
    false,
    'active'
  ),
  (
    'Luxury Gold',
    'Template premium dengan aksen gold dan desain mewah. Ideal untuk resepsi pernikahan yang grand dan berkelas.',
    3200000,
    'https://images.pexels.com/photos/3014856/pexels-photo-3014856.jpeg?auto=compress&cs=tinysrgb&w=800',
    '#',
    '["RSVP Premium", "Countdown", "Video Background", "Photo Gallery", "Love Story", "Gift Registry", "Live Streaming HD", "Guest Book", "QR Code Invitation"]'::jsonb,
    'elegant',
    true,
    'active'
  ),
  (
    'Beach Sunset',
    'Template dengan tema pantai dan sunset yang romantis. Cocok untuk pernikahan outdoor atau tema pantai.',
    2100000,
    'https://images.pexels.com/photos/1024967/pexels-photo-1024967.jpeg?auto=compress&cs=tinysrgb&w=800',
    '#',
    '["RSVP Online", "Countdown", "Photo Gallery", "Love Story", "Maps", "Weather Info", "Guest Book"]'::jsonb,
    'modern',
    false,
    'active'
  )
ON CONFLICT DO NOTHING;

-- 1. Create the 'favorites' table
-- This table will store a record each time a user favorites a template.
CREATE TABLE public.favorites (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  user_id uuid NOT NULL,
  template_id uuid NOT NULL,
  CONSTRAINT favorites_pkey PRIMARY KEY (id),
  CONSTRAINT favorites_user_id_template_id_key UNIQUE (user_id, template_id),
  CONSTRAINT favorites_template_id_fkey FOREIGN KEY (template_id) REFERENCES public.wedding_templates(id) ON DELETE CASCADE,
  CONSTRAINT favorites_user_id_fkey FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE
);

-- Optional: Add a comment to describe the table
COMMENT ON TABLE public.favorites IS 'Stores user favorite templates.';


-- 2. Enable Row Level Security (RLS) on the table
-- This is a critical security step. It ensures that data is protected by default.
ALTER TABLE public.favorites ENABLE ROW LEVEL SECURITY;


-- 3. Create policies to grant access
-- Policies define the rules for who can access or modify data.

-- Policy 1: Allow users to view their own favorites.
CREATE POLICY "Enable read access for user's own favorites"
ON public.favorites
FOR SELECT
TO authenticated
USING (auth.uid() = user_id);

-- Policy 2: Allow users to add new favorites for themselves.
CREATE POLICY "Enable insert for user's own favorites"
ON public.favorites
FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = user_id);

-- Policy 3: Allow users to remove their own favorites.
CREATE POLICY "Enable delete for user's own favorites"
ON public.favorites
FOR DELETE
TO authenticated
USING (auth.uid() = user_id);

-- WARNING: This schema is for context only and is not meant to be run.
-- Table order and constraints may not be valid for execution.

CREATE TABLE public.guest_book (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  name text NOT NULL,
  message text NOT NULL,
  created_at timestamp with time zone DEFAULT now(),
  CONSTRAINT guest_book_pkey PRIMARY KEY (id)
);
CREATE TABLE public.guests (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  name text NOT NULL,
  phone text,
  CONSTRAINT guests_pkey PRIMARY KEY (id)
);
CREATE TABLE public.profiles (
  id uuid NOT NULL,
  email text NOT NULL,
  full_name text DEFAULT ''::text,
  role text DEFAULT 'customer'::text CHECK (role = ANY (ARRAY['admin'::text, 'customer'::text])),
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now(),
  storage_limit bigint DEFAULT 104857600,
  CONSTRAINT profiles_pkey PRIMARY KEY (id),
  CONSTRAINT profiles_id_fkey FOREIGN KEY (id) REFERENCES auth.users(id)
);
CREATE TABLE public.purchases (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  template_id uuid NOT NULL,
  price_paid numeric NOT NULL,
  purchase_date timestamp with time zone DEFAULT now(),
  access_url text DEFAULT ''::text,
  status text DEFAULT 'completed'::text CHECK (status = ANY (ARRAY['completed'::text, 'pending'::text])),
  CONSTRAINT purchases_pkey PRIMARY KEY (id),
  CONSTRAINT purchases_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.profiles(id),
  CONSTRAINT purchases_template_id_fkey FOREIGN KEY (template_id) REFERENCES public.wedding_templates(id)
);
CREATE TABLE public.rsvp (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  name text NOT NULL,
  email text NOT NULL,
  guests integer NOT NULL DEFAULT 1,
  attending boolean NOT NULL DEFAULT true,
  dietary_requirements text DEFAULT ''::text,
  message text DEFAULT ''::text,
  created_at timestamp with time zone DEFAULT now(),
  CONSTRAINT rsvp_pkey PRIMARY KEY (id)
);
CREATE TABLE public.user_media (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  file_name text NOT NULL,
  file_url text NOT NULL,
  file_type text NOT NULL CHECK (file_type = ANY (ARRAY['image'::text, 'video'::text, 'music'::text])),
  file_size bigint NOT NULL,
  mime_type text NOT NULL,
  created_at timestamp with time zone DEFAULT now(),
  CONSTRAINT user_media_pkey PRIMARY KEY (id),
  CONSTRAINT user_media_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.profiles(id)
);
CREATE TABLE public.wedding_templates (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  title text NOT NULL,
  description text NOT NULL,
  price numeric NOT NULL DEFAULT 0,
  preview_url text DEFAULT ''::text,
  thumbnail_url text DEFAULT ''::text,
  demo_url text DEFAULT ''::text,
  features jsonb DEFAULT '[]'::jsonb,
  category text DEFAULT 'modern'::text CHECK (category = ANY (ARRAY['modern'::text, 'classic'::text, 'minimalist'::text, 'elegant'::text])),
  is_featured boolean DEFAULT false,
  status text DEFAULT 'active'::text CHECK (status = ANY (ARRAY['active'::text, 'draft'::text, 'sold'::text])),
  views_count integer DEFAULT 0,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now(),
  CONSTRAINT wedding_templates_pkey PRIMARY KEY (id)
);

-- 1. Buat tabel baru untuk menyimpan rating
-- Tabel ini akan memiliki relasi ke tabel 'wedding_templates' dan 'users'
CREATE TABLE public.template_ratings (
  id BIGINT GENERATED BY DEFAULT AS IDENTITY PRIMARY KEY,
  template_id UUID NOT NULL REFERENCES public.wedding_templates(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  rating INT NOT NULL CHECK (rating >= 1 AND rating <= 5),
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  -- Setiap user hanya bisa memberikan satu rating per template
  UNIQUE (template_id, user_id)
);

-- Berikan komentar untuk menjelaskan tujuan tabel
COMMENT ON TABLE public.template_ratings IS 'Menyimpan rating yang diberikan oleh pengguna untuk setiap template.';

-- 2. Aktifkan Row Level Security (RLS) untuk keamanan
-- Ini penting agar pengguna tidak bisa memanipulasi rating pengguna lain
ALTER TABLE public.template_ratings ENABLE ROW LEVEL SECURITY;

-- 3. Buat Policies (Aturan Akses) untuk tabel template_ratings
-- Aturan #1: Izinkan semua pengguna untuk melihat (membaca) semua rating
CREATE POLICY "Allow all users to read ratings"
ON public.template_ratings
FOR SELECT
USING (true);

-- Aturan #2: Izinkan pengguna yang sudah login untuk menambahkan rating mereka sendiri
CREATE POLICY "Allow authenticated users to insert their own rating"
ON public.template_ratings
FOR INSERT
WITH CHECK (auth.uid() = user_id);

-- Aturan #3: Izinkan pengguna untuk mengubah rating yang mereka berikan sebelumnya
CREATE POLICY "Allow users to update their own rating"
ON public.template_ratings
FOR UPDATE
USING (auth.uid() = user_id);

-- 4. Buat FUNGSI untuk menghitung ulang dan memperbarui rating di tabel wedding_templates
CREATE OR REPLACE FUNCTION public.update_template_rating()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER -- Jalankan fungsi dengan hak akses admin
AS $$
DECLARE
  target_template_id UUID;
BEGIN
  -- Tentukan template_id berdasarkan jenis operasi (INSERT/UPDATE/DELETE)
  IF TG_OP = 'DELETE' THEN
    target_template_id := OLD.template_id;
  ELSE
    target_template_id := NEW.template_id;
  END IF;

  -- Hitung ulang rata-rata rating dan jumlah rating, lalu update tabel wedding_templates
  UPDATE public.wedding_templates
  SET
    avg_rating = (
      SELECT COALESCE(AVG(rating), 0)
      FROM public.template_ratings
      WHERE template_id = target_template_id
    ),
    rating_count = (
      SELECT COUNT(id)
      FROM public.template_ratings
      WHERE template_id = target_template_id
    )
  WHERE id = target_template_id;

  RETURN NEW;
END;
$$;

-- 5. Buat TRIGGER untuk menjalankan fungsi di atas secara otomatis
-- Trigger ini akan aktif setiap kali ada data baru, perubahan, atau penghapusan
CREATE TRIGGER on_rating_change
AFTER INSERT OR UPDATE OR DELETE ON public.template_ratings
FOR EACH ROW
EXECUTE FUNCTION public.update_template_rating();

-- Opsional: Tambahkan trigger untuk auto-update kolom 'updated_at'
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER set_timestamp_before_update
BEFORE UPDATE ON public.template_ratings
FOR EACH ROW
EXECUTE FUNCTION public.handle_updated_at();