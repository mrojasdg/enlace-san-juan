import { supabase } from "@/lib/supabase";
import Link from "next/link";
import { Magazine, MagazinePage } from "@/types/magazine";
import { ArrowRight, BookOpen, CheckCircle2, TrendingUp, Users, Calendar } from "lucide-react";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Button } from "@/components/ui/Button";
import { PageTracker } from "@/components/shared/PageTracker";

export default async function RevistaPublicPage() {
    // Fetch latest published magazines
    const { data: magazines } = await supabase
        .from("magazines")
        .select("*")
        .eq("status", "published")
        .order("year", { ascending: false })
        .order("created_at", { ascending: false });

    const publishedMagazines = magazines || [];
    let covers: any[] = [];
    if (publishedMagazines.length > 0) {
        const { data: coversData } = await supabase
            .from("magazine_pages")
            .select("*")
            .eq("page_number", 1)
            .in("magazine_id", publishedMagazines.map((m) => m.id))
            .not("image_url", "is", null);
        covers = coversData || [];
    }

    const magazinesWithCovers = publishedMagazines.map((mag) => ({
        ...mag,
        cover: covers.find((c: any) => c.magazine_id === mag.id)?.image_url || null,
    }));

    const whatsappLink = "https://wa.me/524423432924?text=Hola,%20me%20gustaría%20más%20información%20sobre%20los%20planes%20de%20Enlace%20San%20Juan";

    return (
        <div className="min-h-screen bg-white">
            <PageTracker path="revista" />
            <Navbar />
            
            <main>
                {/* Hero */}
                <div className="pt-32 pb-20 px-6 bg-gradient-to-b from-green-xpale/50 to-white overflow-hidden relative">
                    <div className="absolute top-0 right-0 w-96 h-96 bg-green/5 rounded-full blur-3xl -mr-48 -mt-48" />
                    <div className="container max-w-7xl mx-auto text-center space-y-8 relative z-10">
                        <div className="inline-flex items-center gap-2 bg-white px-4 py-2 rounded-full border border-green-pale shadow-sm">
                            <span className="w-2 h-2 bg-green rounded-full animate-pulse" />
                            <span className="text-[10px] font-black text-green uppercase tracking-widest">Ediciones Mensuales</span>
                        </div>
                        <h1 className="font-outfit font-black text-5xl md:text-7xl text-green-deeper leading-none tracking-tight">
                            Revista Digital <br /> Enlace San Juan
                        </h1>
                        <p className="text-muted font-jakarta text-lg md:text-xl max-w-2xl mx-auto leading-relaxed">
                            Explora nuestras ediciones mensuales y descubre por qué somos el directorio más completo e interactivo de San Juan del Río.
                        </p>
                    </div>
                </div>

                {/* Grid de Revistas */}
                <div className="py-20 container max-w-7xl mx-auto px-6">
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8 md:gap-10">
                        {magazinesWithCovers.map((mag) => (
                            <Link 
                                key={mag.id}
                                href={`/revista/${mag.year}/${mag.month}`} 
                                className="group block space-y-4 text-center"
                            >
                                {/* Card Container */}
                                <div className="relative aspect-[3/4] rounded-[2rem] overflow-hidden shadow-md group-hover:shadow-xl transition-all duration-500 group-hover:-translate-y-1.5 flex items-center justify-center bg-gray-50">
                                    {mag.cover ? (
                                        <img 
                                            src={mag.cover} 
                                            alt={`Portada ${mag.month} ${mag.year}`} 
                                            className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-[1.03]"
                                        />
                                    ) : (
                                        <div className="absolute inset-0 flex items-center justify-center bg-green-xpale/10">
                                            <BookOpen size={40} className="text-muted/30" />
                                        </div>
                                    )}
                                </div>

                                {/* Text Label */}
                                <div className="px-2">
                                    <h3 className="font-outfit font-black text-xl text-ink capitalize tracking-tight group-hover:text-green transition-colors leading-none">
                                        {mag.month}
                                    </h3>
                                    <p className="text-[9px] font-black text-muted/50 uppercase tracking-[0.25em] mt-2">
                                        {mag.year}
                                    </p>
                                </div>
                            </Link>
                        ))}
                    </div>
                </div>

                {/* PROMO MAYO SECTION (REPLICATED) */}
                <div className="container mx-auto px-6 max-w-7xl mb-32">
                  <div className="max-w-5xl mx-auto">
                    <div className="bg-gradient-to-r from-green-deeper to-green rounded-[3rem] p-1 shadow-2xl overflow-hidden group">
                      <div className="bg-white rounded-[2.8rem] p-8 md:p-12 relative overflow-hidden h-full">
                        {/* Elementos Decorativos */}
                        <div className="absolute top-0 right-0 w-64 h-64 bg-green-xpale rounded-full blur-3xl opacity-60 -mr-32 -mt-32 group-hover:scale-110 transition-transform duration-700"></div>
                        <div className="absolute bottom-0 left-0 w-64 h-64 bg-green-xpale rounded-full blur-3xl opacity-40 -ml-32 -mb-32"></div>

                        <div className="relative z-10 flex flex-col lg:flex-row items-center justify-between gap-10">
                          <div className="flex-1 space-y-6 text-center lg:text-left">
                            <div className="space-y-4">
                              <span className="inline-block bg-ink text-white px-6 py-2 rounded-full font-black text-[12px] uppercase tracking-[0.3em] shadow-xl">
                                🔥 PROMO JUNIO
                              </span>
                              <h2 className="font-outfit font-black text-4xl md:text-5xl text-ink leading-[1.1] tracking-tight">
                                Asegura tu presencia <br className="hidden md:block" />
                                <span className="text-green">Junio + Julio</span>
                              </h2>
                            </div>

                            <div className="space-y-6">
                              <p className="text-muted font-jakarta text-lg max-w-xl leading-relaxed">
                                Obtén el <span className="font-black text-ink">Plan Enlace</span> (lo que queda de Junio y todo Julio) +{' '}
                                <span className="font-black text-ink">Revista Enlace edición Julio</span> por un precio especial.
                              </p>
                              <div className="flex flex-wrap justify-center lg:justify-start gap-3">
                                <div className="flex items-center gap-2 bg-[#F9FCFA] px-4 py-2.5 rounded-2xl border border-border group-hover:border-green/20 transition-colors">
                                  <CheckCircle2 size={18} className="text-green" />
                                  <span className="text-[11px] font-black text-ink uppercase tracking-wider">
                                    Plan Enlace Vigente
                                  </span>
                                </div>
                                <div className="flex items-center gap-2 bg-[#F9FCFA] px-4 py-2.5 rounded-2xl border border-border group-hover:border-green/20 transition-colors">
                                  <CheckCircle2 size={18} className="text-green" />
                                  <span className="text-[11px] font-black text-ink uppercase tracking-wider">
                                    Revista Julio Incluida
                                  </span>
                                </div>
                              </div>
                            </div>
                          </div>

                          <div className="w-full lg:w-auto flex flex-col items-center gap-6 bg-green-xpale/30 p-10 md:px-14 rounded-[2.8rem] border border-green-pale/20 shadow-inner relative group/card">
                            <div className="absolute inset-0 bg-white/20 opacity-0 group-hover/card:opacity-100 transition-opacity rounded-[2.8rem]"></div>
                            <div className="text-center relative z-10">
                              <p className="text-[11px] font-black text-muted uppercase tracking-[0.3em] mb-2">
                                Pago Único Especial
                              </p>
                              <div className="flex items-baseline justify-center gap-2">
                                <span className="font-outfit font-black text-7xl text-green-deeper tracking-tighter">
                                  $350
                                </span>
                                <span className="font-bold text-muted text-sm uppercase tracking-widest">
                                  MXN
                                </span>
                              </div>
                              <p className="text-[10px] font-black text-green uppercase tracking-[0.2em] mt-6 bg-white px-6 py-3 rounded-full shadow-sm border border-green/5">
                                Siguiente pago en Agosto
                              </p>
                            </div>

                            <Link href="/registrate" className="w-full relative z-10">
                              <Button className="w-full h-16 bg-green hover:bg-green-mid text-white border-none rounded-2xl font-black uppercase tracking-widest text-[11px] shadow-xl shadow-green/20 group-hover:scale-105 active:scale-95 transition-all">
                                Aprovechar Promo
                                <ArrowRight className="ml-3 w-5 h-5 animate-pulse" />
                              </Button>
                            </Link>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
            </main>

            <Footer />
        </div>
    );
}
