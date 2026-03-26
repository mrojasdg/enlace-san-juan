import { supabase } from '@/lib/supabase';
import { notFound, redirect } from 'next/navigation';

export const dynamic = 'force-dynamic';

export default async function ShortlinkPage({
  params,
}: {
  params: { categoria: string };
}) {
  // Check if the slug belongs to a business
  // Next.js pasa el parametro aquí como 'categoria' porque así se llama la carpeta
  const { data: business } = await supabase
    .from('businesses')
    .select('slug, category:categories(slug)')
    .eq('slug', params.categoria)
    .single();

  if (!business || !business.category) {
    notFound();
  }

  // Handle potential array from Supabase join
  const rawCategory: any = business.category;
  const categorySlug = Array.isArray(rawCategory)
    ? rawCategory[0]?.slug
    : (rawCategory as any)?.slug;

  if (!categorySlug) {
    notFound();
  }

  // Redirect to the canonical URL
  redirect(`/${categorySlug}/${business.slug}`);
}
