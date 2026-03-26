export interface Magazine {
  id: string;
  year: number;
  month: string;
  status: 'draft' | 'published';
  created_at: string;
}

export interface MagazinePage {
  id: string;
  magazine_id: string;
  page_number: number;
  image_url: string;
  business_name: string | null;
  business_link: string | null;
  created_at: string;
}
