export interface Category {
  id: string;
  name: string;
  slug: string;
  icon: string;
  description?: string;
  color?: string;
  order_num?: number;
  is_active?: boolean;
}

export interface Business {
  id: string;
  created_at?: string;
  updated_at?: string;
  name: string;
  slug: string;
  tagline?: string;
  description?: string;
  category_id?: string;
  category?: Category;
  is_featured?: boolean;
  is_active?: boolean;
  verified?: boolean;
  logo_url?: string;
  cover_url?: string;
  gallery_urls?: string[];
  phone?: string;
  whatsapp?: string;
  email?: string;
  contact_name?: string;
  contact_email?: string;
  contact_phone?: string;
  website?: string;
  facebook?: string;
  instagram?: string;
  twitter_x?: string;
  youtube?: string;
  tiktok?: string;
  pinterest?: string;
  linkedin?: string;
  address?: string;
  neighborhood?: string;
  city?: string;
  state?: string;
  maps_embed_url?: string;
  latitude?: number;
  longitude?: number;
  schedule?: Record<string, { open: string; close: string; closed: boolean }>;
  features?: string[];
  catalog_pdf_url?: string;
  catalog_label?: string;
  products?: Array<{ name: string; price: string; description: string }>;
  in_magazine?: boolean;
  magazine_month?: string;
  meta_title?: string;
  meta_description?: string;
  search_keywords?: string;
}
