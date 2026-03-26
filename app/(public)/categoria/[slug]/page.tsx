import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { BusinessCard } from '@/components/business/BusinessCard';
import { supabase } from '@/lib/supabase';
import { notFound } from 'next/navigation';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';

export const revalidate = 3600; // Revalidate every hour

interface CategoryPageProps {
  params: {
    slug: string;
  };
}

export default async function CategoryPage({ params }: CategoryPageProps) {
  const { slug } = params;

  // 1. Fetch category first to get its ID, then fetch businesses.
  // To optimize, we can try to fetch them in parallel if we use the slug for both,
  // but the businesses table uses category_id. We'll stick to a slightly more efficient sequential but pre-warmed approach
  // or better: use a single query with a join if possible, but let's just use Promise.all for the initial metadata if we had any.
  // Actually, the best way for speed here is to fetch the category first, but we'll optimize the businesses query.

  const { data: category, error: catError } = await supabase
    .from('categories')
    .select('*')
    .eq('slug', slug)
    .single();

  if (catError || !category) {
    console.log('CATEGORY PAGE NOT FOUND: ', slug, catError);
    return notFound();
  }

  // Now fetch businesses - we'll add a count to the same query to avoid extra trips
  const { data: businesses, error: bizError } = await supabase
    .from('businesses')
    .select(
      `
            *,
            category:categories(name, slug, icon)
        `
    )
    .eq('category_id', category.id)
    .eq('is_active', true)
    .order('is_featured', { ascending: false })
    .order('name', { ascending: true });

  const businessCount = businesses?.length || 0;

  return (
    <main className="min-h-screen pt-20 bg-green-xpale/30">
      <Navbar />

      {/* Header Section */}
      <section className="relative py-20 overflow-hidden">
        <div className="absolute inset-0 bg-green-deeper opacity-[0.03] pattern-dots" />
        <div className="container mx-auto px-6 relative">
          <Link
            href="/#categorias"
            className="inline-flex items-center gap-2 text-green-mid font-black text-[10px] uppercase tracking-widest mb-8 hover:gap-4 transition-all"
          >
            <ArrowLeft size={14} />
            Volver a categorías
          </Link>

          <div className="flex flex-col md:flex-row md:items-end justify-between gap-8">
            <div>
              <span className="text-green font-black text-xs uppercase tracking-[0.3em] mb-4 block">
                Directorio de San Juan del Río
              </span>
              <h1 className="text-5xl md:text-7xl font-outfit font-black text-ink leading-none">
                {category.name}
              </h1>
              <p className="mt-6 text-muted font-jakarta text-lg max-w-xl">
                Explora los mejores establecimientos de{' '}
                {category.name.toLowerCase()} en San Juan del Río. Calidad y
                servicio local a tu alcance.
              </p>
            </div>
            <div className="bg-white p-8 rounded-[2.5rem] border border-border shadow-xl min-w-[200px] text-center">
              <span className="block text-4xl font-outfit font-black text-green mb-1">
                {businesses?.length || 0}
              </span>
              <span className="text-[10px] font-black text-muted uppercase tracking-widest">
                Negocios activos
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* Results Grid */}
      <section className="py-20">
        <div className="container mx-auto px-6">
          {businesses && businesses.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {businesses.map((business) => (
                <BusinessCard key={business.id} business={business as any} />
              ))}
            </div>
          ) : (
            <div className="bg-white rounded-[3rem] p-20 text-center border-2 border-dashed border-border">
              <div className="w-20 h-20 bg-green-xpale rounded-full flex items-center justify-center mx-auto mb-8 text-green">
                <ArrowLeft size={32} />
              </div>
              <h3 className="text-2xl font-outfit font-black text-ink mb-4">
                Aún no hay negocios aquí
              </h3>
              <p className="text-muted font-jakarta max-w-md mx-auto mb-10">
                Estamos trabajando para traer los mejores lugares de esta
                categoría. ¿Tienes un negocio? ¡Sé el primero en aparecer!
              </p>
              <Link href="/#registrar">
                <button className="bg-green text-white px-10 py-5 rounded-2xl font-black text-sm uppercase tracking-widest hover:bg-green-deeper transition-all shadow-xl shadow-green/20">
                  Registrar mi negocio
                </button>
              </Link>
            </div>
          )}
        </div>
      </section>

      <Footer />
    </main>
  );
}
