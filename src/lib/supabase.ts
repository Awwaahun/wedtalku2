import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export interface WeddingTemplate {
  id: string;
  title: string;
  description: string;
  price: number;
  preview_url: string;
  thumbnail_url: string;
  demo_url: string;
  features: string[];
  gallery_urls: string[];
  category: 'modern' | 'classic' | 'minimalist' | 'elegant';
  is_featured: boolean;
  status: 'active' | 'draft' | 'sold';
  views_count: number;
  created_at: string;
  updated_at: string;
  avg_rating: number;
  rating_count: number;
  template_code: string;
  portfolio_count?: number;
}

export interface Profile {
  id: string;
  email: string;
  full_name: string;
  role: 'admin' | 'customer';
  created_at: string;
  updated_at: string;
  storage_limit: number;
}

export interface Purchase {
  id: string;
  user_id: string;
  template_id: string;
  price_paid: number;
  purchase_date: string;
  access_url: string;
  status: 'completed' | 'pending';
}

export interface UserMedia {
  id: string;
  user_id: string;
  file_name: string;
  file_url: string;
  file_type: 'image' | 'video' | 'music';
  file_size: number;
  mime_type: string;
  created_at: string;
}

export interface UserPortfolio {
  id: string;
  user_id: string;
  template_id: string;
  groom_name: string;
  bride_name: string;
  wedding_date?: string;
  couple_photo_url: string;
  groom_photo_url?: string;
  bride_photo_url?: string;
  story?: string;
  location?: string;
  is_published: boolean;
  is_featured: boolean;
  views_count: number;
  likes_count: number;
  created_at: string;
  updated_at: string;
}

export interface UserPortfolio {
  id: string;
  user_id: string;
  template_id: string;
  groom_name: string;
  bride_name: string;
  wedding_date?: string;
  couple_photo_url: string;
  groom_photo_url?: string;
  bride_photo_url?: string;
  story?: string;
  location?: string;
  is_published: boolean;
  is_featured: boolean;
  views_count: number;
  likes_count: number;
  created_at: string;
  updated_at: string;
}

export interface PortfolioWithUser extends UserPortfolio {
  user_name: string;
  user_email: string;
  template_title: string;
  template_thumbnail: string;
  template_category: 'modern' | 'classic' | 'minimalist' | 'elegant';
  total_likes: number;
}

export interface PortfolioLike {
    id: string;
    portfolio_id: string;
    user_id: string;
    created_at: string;
}

export type TemplateComponent = React.LazyExoticComponent<React.ComponentType<any>>;
export type TemplateRegistry = Record<string, TemplateComponent>;