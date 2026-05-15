import { Business } from "@/types/business";
import { supabase } from "@/lib/supabase";
import { notFound, redirect } from "next/navigation";
import Image from "next/image";
import { Badge } from "@/components/ui/Badge";
import {
    CheckCircle,
    Clock,
    MapPin,
    Phone,
    Mail,
    Globe,
    Facebook,
    Instagram,
    Twitter,
    Youtube,
    Pin as Pinterest,
    Linkedin,
    Music2 as Tiktok,
    Share2,
    FileText,
    ChevronRight,
    MessageCircle,
    Layers,
    CreditCard,
    Banknote,
    Receipt,
    Bike,
    ShoppingBag,
    CalendarCheck,
    Car,
    Wifi,
    Snowflake,
    Dog,
    Gamepad2,
    Building2
} from "lucide-react";
import { isOpenNow } from "@/utils/schedule";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Button } from "@/components/ui/Button";
import Link from "next/link";
import { CTASection } from "@/components/home/CTASection";
import { ViewTracker } from "@/components/business/ViewTracker";
import dynamic from "next/dynamic";

const BusinessGallery = dynamic(() => import("@/components/business/BusinessGallery").then(mod => mod.default), { ssr: false });
const BusinessMap = dynamic(() => import("@/components/business/BusinessMap").then(mod => mod.default), {
    ssr: false,
    loading: () => <div className="h-[400px] w-full bg-green-xpale animate-pulse rounded-[1.5rem]" />
});

const ALL_FEATURES = [
    { id: "Pago con tarjeta", label: "Pago con tarjeta", icon: CreditCard },
    { id: "Pago con transferencia", label: "Pago con transferencia", icon: Banknote },
    { id: "Facturación disponible", label: "Facturación disponible", icon: Receipt },
    { id: "Servicio a domicilio", label: "Servicio a domicilio", icon: Bike },
    { id: "Para llevar", label: "Para llevar", icon: ShoppingBag },
    { id: "Pueden reservar", label: "Pueden reservar", icon: CalendarCheck },
    { id: "Estacionamiento", label: "Estacionamiento", icon: Car },
    { id: "Con WiFi", label: "Con WiFi", icon: Wifi },
    { id: "Aire acondicionado", label: "Aire acondicionado", icon: Snowflake },
    { id: "Pet friendly", label: "Pet friendly", icon: Dog },
    { id: "Con juegos infantiles", label: "Con juegos infantiles", icon: Gamepad2 },
];

export default async function BusinessProfilePage({
    params,
}: {
    params: { categoria: string; slug: string };
}) {
    const { slug } = params;

    const { data: business } = await supabase
        .from("businesses")
        .select("*, category:categories(*)")
        .eq("slug", slug)
        .single();

    if (!business) {
        notFound();
    }

    const features = business.features || [];

    return (
        <div className="min-h-screen bg-white">
            <ViewTracker businessId={business.id} />
            <Navbar />
            
            <div className="h-[40vh] md:h-[50vh] relative bg-ink overflow-hidden">
                {business.cover_url ? (
                    <Image src={business.cover_url} alt={business.name} fill className="object-cover opacity-60" />
                ) : (
                    <div className="absolute inset-0 bg-gradient-to-br from-green-deeper to-green opacity-40" />
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-white via-transparent to-transparent" />
            </div>

            <div className="max-w-7xl mx-auto px-6 -mt-24 relative z-10">
                <div className="flex flex-col md:flex-row items-end gap-8 bg-white/80 backdrop-blur-md p-8 rounded-[3rem] border border-white shadow-2xl">
                    <div className="w-40 h-40 rounded-[2.5rem] bg-white border-4 border-white shadow-xl overflow-hidden relative flex-shrink-0">
                        {business.logo_url ? (
                            <Image src={business.logo_url} alt={business.name} fill className="object-cover" />
                        ) : (
                            <div className="w-full h-full flex items-center justify-center text-green bg-green-xpale"><Building2 size={40} /></div>
                        )}
                    </div>
                    <div className="flex-1 space-y-4">
                        <div className="flex items-center gap-3">
                            <Badge className="bg-green-xpale text-green hover:bg-green-xpale border-none">{business.category?.name}</Badge>
                            {business.is_featured && <Badge className="bg-gold/10 text-gold hover:bg-gold/10 border-none">Destacado</Badge>}
                        </div>
                        <h1 className="font-outfit font-black text-4xl md:text-6xl text-ink leading-none">{business.name}</h1>
                        <div className="flex flex-wrap items-center gap-6 text-muted font-jakarta">
                            <div className="flex items-center gap-2"><MapPin size={18} className="text-green" /> {business.address}</div>
                            <div className="flex items-center gap-2">
                                {isOpenNow(business.schedule) ? (
                                    <span className="flex items-center gap-1.5 text-green font-bold"><Clock size={16} /> Abierto ahora</span>
                                ) : (
                                    <span className="flex items-center gap-1.5 text-red-500 font-bold"><Clock size={16} /> Cerrado</span>
                                )}
                            </div>
                        </div>
                    </div>
                    <div className="flex flex-wrap gap-3">
                         {business.whatsapp && (
                            <Link href={`https://wa.me/52${business.whatsapp}`} target="_blank">
                                <Button className="bg-green hover:bg-green-mid text-white rounded-2xl h-14 px-8 font-black uppercase tracking-widest text-xs shadow-xl shadow-green/20">WhatsApp</Button>
                            </Link>
                         )}
                         {business.phone && (
                            <Link href={`tel:${business.phone}`}>
                                <Button variant="outline" className="border-border rounded-2xl h-14 px-8 font-black uppercase tracking-widest text-xs">Llamar</Button>
                            </Link>
                         )}
                    </div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-6 py-20 grid grid-cols-1 lg:grid-cols-3 gap-12">
                <div className="lg:col-span-2 space-y-16">
                    <div className="space-y-6">
                        <h2 className="font-outfit font-black text-3xl text-ink">Sobre nosotros</h2>
                        <p className="text-muted font-jakarta text-lg leading-relaxed whitespace-pre-wrap">{business.description}</p>
                    </div>

                    {business.gallery && business.gallery.length > 0 && (
                        <div className="space-y-6">
                            <h2 className="font-outfit font-black text-3xl text-ink">Galería</h2>
                            <BusinessGallery images={business.gallery} />
                        </div>
                    )}

                    {features.length > 0 && (
                        <div className="space-y-6">
                            <h2 className="font-outfit font-black text-3xl text-ink">Servicios y Amenidades</h2>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                {features.map((fId: string) => {
                                    const feat = ALL_FEATURES.find(af => af.id === fId);
                                    if(!feat) return null;
                                    const Icon = feat.icon;
                                    return (
                                        <div key={fId} className="flex items-center gap-3 bg-[#F9FCFA] p-4 rounded-2xl border border-border">
                                            <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center text-green"><Icon size={20} /></div>
                                            <span className="font-bold text-sm text-ink">{feat.label}</span>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    )}
                </div>

                <div className="space-y-12">
                     <div className="bg-[#F9FCFA] border border-border p-8 rounded-[2.5rem] space-y-8">
                        <h3 className="font-outfit font-black text-2xl text-ink">Información</h3>
                        <div className="space-y-6">
                            {business.email && (
                                <div className="flex items-start gap-4">
                                    <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center text-green border border-border flex-shrink-0"><Mail size={20} /></div>
                                    <div className="space-y-1">
                                        <p className="text-[10px] font-black uppercase text-muted tracking-widest">Email</p>
                                        <p className="font-bold text-ink break-all">{business.email}</p>
                                    </div>
                                </div>
                            )}
                            {business.website && (
                                <div className="flex items-start gap-4">
                                    <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center text-green border border-border flex-shrink-0"><Globe size={20} /></div>
                                    <div className="space-y-1">
                                        <p className="text-[10px] font-black uppercase text-muted tracking-widest">Sitio Web</p>
                                        <Link href={business.website.startsWith('http') ? business.website : `https://${business.website}`} target="_blank" className="font-bold text-ink hover:text-green underline">Visitar sitio</Link>
                                    </div>
                                </div>
                            )}
                        </div>

                        <div className="pt-8 border-t border-border flex gap-4">
                            {business.facebook && <Link href={business.facebook} target="_blank" className="w-12 h-12 rounded-xl bg-white border border-border flex items-center justify-center text-muted hover:text-green hover:border-green transition-all"><Facebook size={20} /></Link>}
                            {business.instagram && <Link href={business.instagram} target="_blank" className="w-12 h-12 rounded-xl bg-white border border-border flex items-center justify-center text-muted hover:text-green hover:border-green transition-all"><Instagram size={20} /></Link>}
                        </div>
                     </div>

                     <div className="space-y-6">
                        <h3 className="font-outfit font-black text-2xl text-ink">Ubicación</h3>
                        <BusinessMap lat={business.latitude} lng={business.longitude} />
                     </div>
                </div>
            </div>

            <CTASection />
            <Footer />
        </div>
    );
}