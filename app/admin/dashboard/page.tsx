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

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
                {/* Latest Table (2/3) */}
                <div className="lg:col-span-2 space-y-8">
                    <div className="flex items-center justify-between px-4">
                        <h2 className="font-outfit font-black text-2xl text-green-deeper uppercase tracking-[0.1em]">Últimos ingresos</h2>
                        <Link href="/admin/negocios" className="text-xs font-black text-green-mid uppercase tracking-[0.1em] hover:text-green-deeper transition-colors flex items-center gap-2">
                            Ver todos <ChevronRight size={14} />
                        </Link>
                    </div>

                    <div className="bg-white rounded-[2.5rem] border border-border shadow-sm overflow-hidden">
                        <table className="w-full text-left border-collapse">
                            <thead className="bg-[#F4FBF5] border-b border-border">
                                <tr>
                                    <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-muted/60">Negocio</th>
                                    <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-muted/60">Categoría</th>
                                    <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-muted/60">Estado</th>
                                    <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-muted/60">Acciones</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-border">
                                {latest?.map((biz) => (
                                    <tr key={biz.id} className="group hover:bg-green-xpale/30 transition-colors">
                                        <td className="px-8 py-6">
                                            <div className="flex items-center gap-5">
                                                <div className="w-12 h-12 rounded-2xl bg-white border border-border p-1 relative overflow-hidden group-hover:shadow-lg transition-all">
                                                    {biz.logo_url ? (
                                                        <Image src={biz.logo_url} alt={biz.name} fill className="object-contain" />
                                                    ) : (
                                                        <div className="w-full h-full flex items-center justify-center font-black text-green-pale text-[10px]">{biz.name[0]}</div>
                                                    )}
                                                </div>
                                                <div>
                                                    <p className="font-outfit font-bold text-ink leading-tight">{biz.name}</p>
                                                    <p className="text-[10px] text-muted tracking-wide mt-0.5">ID: {biz.id.substring(0, 8)}</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-8 py-6">
                                            <span className="text-[10px] font-black uppercase tracking-widest text-green-mid bg-green-xpale px-3 py-1 rounded-full border border-green-pale">
                                                {biz.category?.name || "Sin cat"}
                                            </span>
                                        </td>
                                        <td className="px-8 py-6">
                                            <div className="flex items-center gap-2">
                                                <div className={cn("w-1.5 h-1.5 rounded-full shadow-[0_0_8px]", biz.is_active ? "bg-green shadow-green/50" : "bg-red-500 shadow-red-500/50")} />
                                                <span className="text-xs font-bold text-ink2">{biz.is_active ? "Activo" : "Inactivo"}</span>
                                            </div>
                                        </td>
                                        <td className="px-8 py-6">
                                            <Link href={`/admin/negocios/${biz.id}`}>
                                                <button className="w-10 h-10 rounded-xl bg-green-xpale text-green-mid flex items-center justify-center hover:bg-green-mid hover:text-white transition-all duration-300">
                                                    <ChevronRight size={18} />
                                                </button>
                                            </Link>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Sidebar Mini Action (1/3) */}
                <div className="space-y-8">
                    <div className="bg-green-deeper p-10 rounded-[2.5rem] text-white relative overflow-hidden shadow-2xl group cursor-pointer">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-green opacity-20 -translate-y-1/2 translate-x-1/2 blur-2xl group-hover:scale-150 transition-transform duration-700" />
                        <div className="w-14 h-14 rounded-2xl bg-white/10 flex items-center justify-center mb-8">
                            <PlusCircle size={32} className="text-green-light" />
                        </div>
                        <h3 className="font-outfit font-black text-3xl leading-tight mb-4">¿Nuevo negocio <br /> por registrar?</h3>
                        <p className="text-white/40 font-jakarta text-sm leading-relaxed mb-10">Crea un nuevo perfil profesional en segundos con nuestro constructor inteligente.</p>
                        <Link href="/admin/negocios/nuevo">
                            <Button size="lg" className="w-full bg-white text-green-deeper hover:shadow-[0_10px_30px_rgba(255,255,255,0.2)] rounded-2xl py-5 text-sm uppercase tracking-widest font-black">
                                Empezar registro
                            </Button>
                        </Link>
                    </div>

                    <div className="bg-white p-10 rounded-[2.5rem] border border-border shadow-sm">
                        <div className="flex items-center gap-4 mb-10">
                            <div className="w-12 h-12 rounded-2xl bg-green-xpale text-green flex items-center justify-center">
                                <TrendingUp size={24} />
                            </div>
                            <h4 className="font-outfit font-black text-xl text-green-deeper uppercase tracking-[0.1em]">Anuncios Revista</h4>
                        </div>
                        <div className="space-y-6">
                            <div className="flex justify-between items-center text-xs">
                                <span className="font-bold text-muted">Próxima Edición:</span>
                                <span className="font-black text-ink uppercase tracking-wider">Mayo 2026</span>
                            </div>
                            <div className="w-full h-3 bg-green-xpale rounded-full overflow-hidden border border-border/50">
                                <div className="w-3/4 h-full bg-green shadow-[0_0_10px_rgba(34,197,94,0.4)]" />
                            </div>
                            <p className="text-[10px] font-bold text-muted text-center uppercase tracking-widest">34 de 50 lugares reservados (75%)</p>
                        </div>
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
}

function cn(...inputs: any[]) {
    return inputs.filter(Boolean).join(" ");
}
