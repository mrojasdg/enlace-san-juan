import { AdminLayout } from "@/components/layout/AdminLayout";
import { supabase } from "@/lib/supabase";
import {
    Building2,
    Users,
    Layers,
    BookOpen,
    Eye,
    TrendingUp,
    PlusCircle,
    ChevronRight,
    Star
} from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/Button";
import { cn } from "@/utils/cn";

export const revalidate = 0;

export default async function AdminDashboardPage() {
    // Fetch Metrics
    const { count: totalActive } = await supabase.from("businesses").select("*", { count: "exact", head: true }).eq("is_active", true);
    const { count: featured } = await supabase.from("businesses").select("*", { count: "exact", head: true }).eq("is_featured", true);
    const { count: inMagazine } = await supabase.from("businesses").select("*", { count: "exact", head: true }).eq("in_magazine", true);
    const { count: categories } = await supabase.from("categories").select("*", { count: "exact", head: true }).eq("is_active", true);

    // Fetch Latest Businesses
    const { data: latest } = await supabase
        .from("businesses")
        .select("*, category:categories(name, slug, icon)")
        .order("created_at", { ascending: false })
        .limit(5);

    // Normalize category if it's returned as an array by Supabase join
    const normalizedBusinesses = (latest || []).map((biz: any) => ({
        ...biz,
        category: Array.isArray(biz.category) ? biz.category[0] : biz.category
    }));

    const kpis = [
        { label: "Negocios activos", value: totalActive || 0, icon: Building2, color: "text-green", bg: "bg-green-xpale" },
        { label: "Empresas destacadas", value: featured || 0, icon: Star, color: "text-gold", bg: "bg-gold/10" },
        { label: "Activos en revista", value: inMagazine || 0, icon: BookOpen, color: "text-blue-500", bg: "bg-blue-50" },
        { label: "Categorías registradas", value: categories || 0, icon: Layers, color: "text-purple-500", bg: "bg-purple-50" },
    ];

    return (
        <AdminLayout>
            {/* KPI Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                {kpis.map((kpi) => (
                    <div key={kpi.label} className="bg-white p-8 rounded-[2.5rem] border border-border shadow-sm flex items-center justify-between group hover:shadow-2xl hover:shadow-green/5 hover:-translate-y-1 transition-all duration-300">
                        <div className="space-y-2">
                            <p className="text-[10px] font-black uppercase tracking-[0.2em] text-muted/60">{kpi.label}</p>
                            <h3 className="font-outfit font-black text-5xl text-ink leading-none">{kpi.value}</h3>
                        </div>
                        <div className={cn("w-14 h-14 rounded-2xl flex items-center justify-center transition-transform group-hover:scale-110", kpi.bg, kpi.color)}>
                            <kpi.icon size={24} />
                        </div>
                    </div>
                ))}
            </div>

            {/* Latest Content */}
            <div className="mt-12 grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 space-y-6">
                    <div className="flex items-center justify-between">
                        <h2 className="font-outfit font-black text-2xl text-ink">Últimos negocios registrados</h2>
                        <Link href="/admin/negocios">
                            <Button variant="ghost" className="text-xs font-black uppercase tracking-widest text-green">Ver todos</Button>
                        </Link>
                    </div>

                    <div className="space-y-4">
                        {normalizedBusinesses.map((biz: any) => (
                            <div key={biz.id} className="bg-white p-4 rounded-3xl border border-border flex items-center gap-6 group hover:border-green/20 transition-all">
                                <div className="w-16 h-16 rounded-2xl bg-gray-100 overflow-hidden relative flex-shrink-0">
                                    {biz.logo_url ? (
                                        <Image src={biz.logo_url} alt={biz.name} fill className="object-cover" />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center text-muted">
                                            <Building2 size={24} />
                                        </div>
                                    )}
                                </div>
                                <div className="flex-1">
                                    <h4 className="font-bold text-ink group-hover:text-green transition-colors">{biz.name}</h4>
                                    <p className="text-xs text-muted">{(biz.category as any)?.name || 'Sin categoría'}</p>
                                </div>
                                <div className="flex items-center gap-4">
                                    <div className="text-right">
                                        <p className="text-[10px] font-black uppercase text-muted tracking-widest">Estado</p>
                                        <span className={cn("text-[10px] font-bold px-2 py-0.5 rounded-full", biz.is_active ? "bg-green-xpale text-green" : "bg-red-50 text-red-500")}>
                                            {biz.is_active ? "Activo" : "Inactivo"}
                                        </span>
                                    </div>
                                    <Link href={`/admin/negocios/${biz.id}`}>
                                        <Button size="icon" variant="ghost" className="rounded-xl"><ChevronRight size={18} /></Button>
                                    </Link>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="space-y-6">
                    <h2 className="font-outfit font-black text-2xl text-ink">Accesos rápidos</h2>
                    <div className="grid grid-cols-1 gap-4">
                        <Link href="/admin/negocios/nuevo">
                            <Button className="w-full h-20 bg-green hover:bg-green-mid text-white rounded-3xl font-black uppercase tracking-widest text-[10px] flex items-center justify-center gap-3">
                                <PlusCircle size={20} />
                                Nuevo Negocio
                            </Button>
                        </Link>
                        <Link href="/admin/revistas">
                            <Button className="w-full h-20 bg-ink hover:bg-ink/90 text-white rounded-3xl font-black uppercase tracking-widest text-[10px] flex items-center justify-center gap-3">
                                <BookOpen size={20} />
                                Gestionar Revistas
                            </Button>
                        </Link>
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
}
