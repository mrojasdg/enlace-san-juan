export interface Magazine {
<<<<<<< HEAD
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
=======
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
>>>>>>> 56f280e928b510cd316e3d7a637182573aeb8b42
}
