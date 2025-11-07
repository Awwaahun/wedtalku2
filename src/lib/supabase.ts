// src/lib/supabase.ts - Updated version with UserInvitationConfig
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

export interface PortfolioWithUser extends UserPortfolio {
  user_name: string;
  user_email: string;
  template_title: string;
  template_thumbnail: string;
  template_category: 'modern' | 'classic' | 'minimalist' | 'elegant';
  total_likes: number;
  invitation_url?: string;
}

export interface PortfolioLike {
  id: string;
  portfolio_id: string;
  user_id: string;
  created_at: string;
}

// NEW: Interface untuk konfigurasi undangan user
export interface UserInvitationConfig {
  id: string;
  user_id: string;
  purchase_id: string;
  
  // Couple Information
  groom_name: string;
  groom_full_name?: string;
  groom_parents?: string;
  groom_instagram?: string;
  groom_email?: string;
  groom_bio?: string;
  groom_image_url?: string;
  
  bride_name: string;
  bride_full_name?: string;
  bride_parents?: string;
  bride_instagram?: string;
  bride_email?: string;
  bride_bio?: string;
  bride_image_url?: string;
  
  // Wedding Information
  wedding_date?: string;
  wedding_date_display?: string;
  wedding_time?: string;
  
  // Hero Section
  hero_background_image_url?: string;
  hero_tagline?: string;
  
  // Invitation Modal
  invitation_title?: string;
  invitation_subtitle?: string;
  invitation_button_text?: string;
  invitation_background_video_url?: string;
  
  // Cinematic
  cinematic_video_url?: string;
  cinematic_door_image_url?: string;
  
  // Music
  music_audio_url?: string;
  music_lyrics?: Array<{ time: number; text: string }>;
  
  // Events (stored as JSONB)
  events?: any[];
  
  // Story Timeline (stored as JSONB)
  story?: any[];
  
  // Gallery (stored as JSONB)
  gallery?: any[];
  
  // Donations (stored as JSONB)
  donations?: any[];
  
  // Prayer Letter
  prayer_greeting?: string;
  prayer_body1?: string;
  prayer_body2?: string;
  prayer_body3?: string;
  prayer_closing?: string;
  
  // Theme Colors
  theme_primary?: string;
  theme_secondary?: string;
  theme_accent?: string;
  
  created_at: string;
  updated_at: string;
}

export type TemplateComponent = React.LazyExoticComponent<React.ComponentType<any>>;
export type TemplateRegistry = Record<string, TemplateComponent>;