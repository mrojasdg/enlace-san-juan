import { AdminLayout } from "@/components/layout/AdminLayout";
import { supabase } from "@/lib/supabase";
import { PlusCircle, Grid3X3, Edit, Trash2, ChevronRight, Hash, Layers } from "lucide-react";
import { Button } from "@/components/ui/Button";

export const revalidate = 0;

export default async function AdminCategoriesPage() {
    const { data: categories } = await supabase
        .from("categories")
        .select("*")
        .order("order_num", { ascending: true });

    return (
        <AdminLayout>
            <div className="flex flex-col md:flex-row justify-between items-end gap-6 mb-12">
                <div className="max-w-xl">
                    <h2 className="font-outfit font-black text-4xl text-green-deeper leading-tight mb-4">Gestión de <br /> Categorías</h2>
                    <p className="text-muted font-jakarta text-sm">Organiza los negocios por sectores para facilitar la búsqueda de los usuarios.</p>
                </div>
                <Button className="h-16 px-10 rounded-[2rem] shadow-2xl flex items-center gap-4 text-sm font-black uppercase tracking-widest ring-8 ring-green-xpale">
                    <PlusCircle size={24} />
                    Nueva categoría
                </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {categories?.map((cat) => (
                    <div key={cat.id} className="bg-white rounded-[2.5rem] border border-border p-8 shadow-sm group hover:shadow-2xl hover:shadow-green/5 hover:-translate-y-2 transition-all duration-300 relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-green opacity-[0.03] translate-x-1/2 -translate-y-1/2 rounded-full" />

                        <div className="flex justify-between items-start mb-8">
                            <div className="w-16 h-16 rounded-2xl bg-green-xpale text-green flex items-center justify-center shadow-inner group-hover:bg-green group-hover:text-white transition-all transform group-hover:rotate-6">
                                <Grid3X3 size={28} />
                            </div>
                            <div className="flex flex-col items-end gap-1">
                                <span className="text-[10px] font-black uppercase tracking-widest text-muted/30">Orden</span>
                                <span className="bg-green-pale text-green px-3 py-1 rounded-lg font-black text-xs">#{cat.order_num}</span>
                            </div>
                        </div>

                        <div>
                            <h3 className="font-outfit font-black text-2xl text-ink leading-tight mb-2">{cat.name}</h3>
                            <p className="text-[10px] font-black text-muted uppercase tracking-[0.2em] mb-4">URL Slug: /{cat.slug}</p>
                            <p className="text-xs text-muted font-jakarta leading-relaxed line-clamp-2 h-8">
                                {cat.description || "Sin descripción proporcionada para esta categoría."}
                            </p>
                        </div>

                        <div className="mt-8 pt-8 border-t border-border flex items-center justify-between">
                            <div className="flex items-center gap-2">
                                <div className={cn("w-2 h-2 rounded-full", cat.is_active ? "bg-green" : "bg-red-500")} />
                                <span className="text-[10px] font-black uppercase tracking-widest text-ink2">{cat.is_active ? "Activa" : "Inactiva"}</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <button className="w-10 h-10 rounded-xl bg-green-xpale text-green flex items-center justify-center hover:bg-green hover:text-white transition-all">
                                    <Edit size={16} />
                                </button>
                                <button className="w-10 h-10 rounded-xl bg-red-50 text-red-400 flex items-center justify-center hover:bg-red-500 hover:text-white transition-all outline-none">
                                    <Trash2 size={16} />
                                </button>
                            </div>
                        </div>

                        {/* Status Indicator Bar */}
                        <div className={cn(
                            "absolute bottom-0 left-0 w-full h-1.5 transition-all",
                            cat.is_active ? "bg-green/10 group-hover:bg-green" : "bg-red-500/10 group-hover:bg-red-500"
                        )} />
                    </div>
                ))}

                {/* Add New Mockup Card */}
                <div className="bg-green-xpale border-4 border-dashed border-border/50 rounded-[2.5rem] p-8 flex flex-col items-center justify-center text-center group cursor-pointer hover:border-green-mid/30 transition-all opacity-50 hover:opacity-100">
                    <div className="w-20 h-20 rounded-3xl bg-white flex items-center justify-center shadow-xl text-green-mid mb-6 group-hover:scale-110 transition-transform">
                        <PlusCircle size={40} />
                    </div>
                    <h4 className="font-outfit font-black text-xl text-green-deeper uppercase tracking-[0.1em] mb-2">Crear nueva</h4>
                    <p className="text-[10px] font-bold text-muted uppercase tracking-widest leading-relaxed max-w-[120px]">Añade un nuevo nicho de negocios</p>
                </div>
            </div>
        </AdminLayout>
    );
}

function cn(...inputs: any[]) {
    return inputs.filter(Boolean).join(" ");
}
