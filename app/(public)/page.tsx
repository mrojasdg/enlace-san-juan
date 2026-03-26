import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { HeroSection } from '@/components/home/HeroSection';
import { CategoryGrid } from '@/components/home/CategoryGrid';
import { FeaturedBiz } from '@/components/home/FeaturedBiz';
import { StatsStrip } from '@/components/home/StatsStrip';
import { RevistaSection } from '@/components/home/RevistaSection';
import { CTASection } from '@/components/home/CTASection';
import { supabase } from '@/lib/supabase';

// Next.js ISR: Revalidate every 60 seconds
export const revalidate = 60;

export default async function HomePage() {
  // Fetch featured businesses from Supabase
  const { data: featuredBusinesses } = await supabase
    .from('businesses')
    .select('*, category:categories(name, slug, icon)')
    .eq('is_featured', true)
    .eq('is_active', true)
    .limit(3);

  // Normalize category if it's returned as an array by Supabase join
  const businesses = (featuredBusinesses || []).map((biz: any) => ({
    ...biz,
    category: Array.isArray(biz.category) ? biz.category[0] : biz.category
  }));

  return (
    <main className="min-h-screen pt-20 selection:bg-green-pale selection:text-green-deeper">
      <Navbar />
      <HeroSection />

      <CategoryGrid />
      <StatsStrip />
      <FeaturedBiz businesses={businesses} />

      {/* "Cómo funciona" Section - Inline for simplicity or separate component */}
      <section className="py-24 px-6 md:px-12 bg-white">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <h2 className="font-outfit font-black text-4xl md:text-5xl text-green-deeper mb-6">
              ¿Cómo funciona?
            </h2>
            <p className="text-muted max-w-2xl mx-auto">
              Sigue estos 4 pasos para digitalizar tu negocio hoy mismo en San
              Juan del Río.
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-12 relative">
            {/* Step indicators */}
            {[
              {
                n: '1',
                title: 'Regístrate',
                desc: 'Contáctanos y envíanos tu información básica: logo, dirección y contacto.',
              },
              {
                n: '2',
                title: 'Recibe tu micrositio',
                desc: 'Creamos un perfil profesional con menú digital, galería y enlace a WhatsApp.',
              },
              {
                n: '3',
                title: 'Apareces en el directorio',
                desc: 'Tu negocio es visible para miles de personas que buscan servicios locales.',
              },
              {
                n: '4',
                title: 'Suma la revista',
                desc: 'Aparece en nuestra edición impresa digital para captar aún más clientes cada mes.',
              },
            ].map((step, idx) => (
              <div
                key={step.n}
                className="flex flex-col items-center text-center group"
              >
                <div className="w-16 h-16 rounded-full bg-green text-white font-outfit font-black text-2xl flex items-center justify-center mb-6 group-hover:scale-110 group-hover:bg-green-mid transition-all shadow-xl">
                  {step.n}
                </div>
                <h3 className="font-outfit font-bold text-xl text-ink leading-tight mb-3">
                  {step.title}
                </h3>
                <p className="text-sm text-muted leading-relaxed font-jakarta">
                  {step.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <RevistaSection />
      <CTASection />
      <Footer />
    </main>
  );
}
