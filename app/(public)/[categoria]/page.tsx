import { supabase } from '@/lib/supabase';
import { notFound, redirect } from 'next/navigation';

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

  // Redirect to the canonical URL
  redirect(`/${business.category.slug}/${business.slug}`);
}
