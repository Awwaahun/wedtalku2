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