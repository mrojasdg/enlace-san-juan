import { supabase } from '@/lib/supabase';
import { notFound } from 'next/navigation';
import { BookViewer } from '@/components/magazine/BookViewer';
import { Magazine, MagazinePage } from '@/types/magazine';

// Revalidar en 0 para que siempre esté viva y soporte modo "Borrador"
export const revalidate = 0;

export async function generateMetadata({
  params,
}: {
  params: { year: string; month: string };
}) {
  const { year, month } = params;

  // Solo capitaliza la primera letra
  const monthCapitalized = month.charAt(0).toUpperCase() + month.slice(1);

  return {
    title: `Revista Enlace San Juan - ${monthCapitalized} ${year}`,
    description: `Edición de ${monthCapitalized} ${year} de la revista interactiva de Enlace San Juan.`,
  };
}

export default async function PublicMagazinePage({
  params,
}: {
  params: { year: string; month: string };
}) {
  const { year, month } = params;

  // Buscar revista sin importar si es borrador para permitir previsualización
  const { data: magInfo, error: errMag } = await supabase
    .from('magazines')
    .select('*')
    .eq('year', parseInt(year))
    .eq('month', month.toLowerCase())
    .single();

  if (errMag || !magInfo) {
    return notFound();
  }

  // Traer las páginas reales de esta revista
  const { data: pagesData } = await supabase
    .from('magazine_pages')
    .select('*')
    .eq('magazine_id', magInfo.id)
    .order('page_number', { ascending: true });

  const validPages = (pagesData as MagazinePage[]) || [];

  // Calcula la cantidad real limitando hasta donde haya imagenes (para que no salgan los 42 si solo subió 5)
  // Buscamos la página más alta que tenga image_url o enlace.
  const maxFilledPage = validPages.reduce((max, page) => {
    if (page.image_url || page.business_link) {
      return Math.max(max, page.page_number);
    }
    return max;
  }, 0);

  // total is either maxFilledPage or 1 (so we always show at least the cover)
  const totalPages = Math.max(1, maxFilledPage);

  // Opcional: Filtramos el array para no mandar los de relleno, aunque BookViewer los ignora si image_url es null
  const finalPagesToRender = validPages.filter(
    (p) => p.page_number <= totalPages
  );

  return (
    <main className="w-full h-screen bg-black overflow-hidden font-jakarta">
      <BookViewer pages={finalPagesToRender} total={totalPages} />
    </main>
  );
}
