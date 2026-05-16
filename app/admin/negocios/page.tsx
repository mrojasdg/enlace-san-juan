"use client";

import { AdminLayout } from "@/components/layout/AdminLayout";
import { supabase } from "@/lib/supabase";
import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/Button";
import { PlusCircle, Search, Edit, Eye, Trash2, Star, CheckCircle, BarChart3, QrCode, Download, Loader2, ChevronRight } from "lucide-react";
import { ActivationToggle } from "@/components/admin/ActivationToggle";
import { useEffect, useState, useRef } from "react";
import { QRCodeSVG } from "qrcode.react";
import toast from "react-hot-toast";

export default function BusinessesAdminPage() {
    const [businesses, setBusinesses] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");

    useEffect(() => {
        fetchBusinesses();
    }, []);

    const fetchBusinesses = async () => {
        try {
            const { data, error } = await supabase
                .from("businesses")
                .select("*, category:categories(name, slug)")
                .order("created_at", { ascending: false });

            if (error) throw error;
            setBusinesses(data || []);
        } catch (error) {
            console.error("Error fetching businesses:", error);
            toast.error("Error al cargar negocios");
        } finally {
            setLoading(false);
        }
    };

    const filtered = businesses.filter(b => 
        b.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        b.category?.name?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const downloadQR = (biz: any) => {
        const svg = document.getElementById(`qr-${biz.id}`);
        if (!svg) return;
        const svgData = new XMLSerializer().serializeToString(svg);
        const canvas = document.createElement("canvas");
        const ctx = canvas.getContext("2d");
        const img = new (window as any).Image();
        img.onload = () => {
            canvas.width = img.width;
            canvas.height = img.height;
            ctx?.drawImage(img, 0, 0);
            const pngFile = canvas.toDataURL("image/png");
            const downloadLink = document.createElement("a");
            downloadLink.download = `QR-${biz.slug}.png`;
            downloadLink.href = pngFile;
            downloadLink.click();
        };
        img.src = "data:image/svg+xml;base64," + btoa(unescape(encodeURIComponent(svgData)));
    };

    return (
        <AdminLayout>
            <div className="space-y-8">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="font-outfit font-black text-3xl text-ink">Gestión de Negocios</h1>
                        <p className="text-muted text-sm font-jakarta">Administra todos los comercios registrados en la plataforma.</p>
                    </div>
                    <Link href="/admin/negocios/nuevo">
                        <Button className="bg-green hover:bg-green-mid rounded-2xl shadow-xl shadow-green/20">
                            <PlusCircle className="w-4 h-4 mr-2" /> Nuevo Negocio
                        </Button>
                    </Link>
                </div>

                <div className="relative">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-muted w-5 h-5" />
                    <input 
                        type="text" 
                        placeholder="Buscar por nombre o categoría..." 
                        className="w-full h-14 pl-12 pr-6 rounded-2xl border border-border focus:border-green focus:ring-1 focus:ring-green outline-none transition-all"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>

                <div className="bg-white rounded-[2.5rem] border border-border shadow-sm overflow-hidden">
                    <table className="w-full border-collapse">
                        <thead>
                            <tr className="bg-gray-50/50 border-b border-border">
                                <th className="px-6 py-5 text-left text-[10px] font-black uppercase tracking-widest text-muted">Negocio</th>
                                <th className="px-6 py-5 text-left text-[10px] font-black uppercase tracking-widest text-muted">Categoría</th>
                                <th className="px-6 py-5 text-center text-[10px] font-black uppercase tracking-widest text-muted">Estado</th>
                                <th className="px-6 py-5 text-center text-[10px] font-black uppercase tracking-widest text-muted">QR</th>
                                <th className="px-6 py-5 text-right text-[10px] font-black uppercase tracking-widest text-muted">Acciones</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-border">
                            {loading ? (
                                <tr>
                                    <td colSpan={5} className="px-6 py-20 text-center"><Loader2 className="w-8 h-8 animate-spin text-green mx-auto" /></td>
                                </tr>
                            ) : filtered.length === 0 ? (
                                <tr>
                                    <td colSpan={5} className="px-6 py-20 text-center text-muted text-sm">No se encontraron negocios</td>
                                </tr>
                            ) : (
                                filtered.map((biz) => (
                                    <tr key={biz.id} className="hover:bg-green-xpale/20 transition-colors">
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-4">
                                                <div className="w-12 h-12 rounded-xl bg-gray-100 overflow-hidden relative">
                                                    {biz.logo_url && <Image src={biz.logo_url} alt={biz.name} fill className="object-cover" />}
                                                </div>
                                                <div>
                                                    <p className="font-bold text-ink">{biz.name}</p>
                                                    <p className="text-[10px] text-muted font-mono">{biz.slug}</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className="text-xs font-medium text-muted">{biz.category?.name}</span>
                                        </td>
                                        <td className="px-6 py-4 text-center">
                                            <ActivationToggle businessId={biz.id} initialStatus={biz.is_active} />
                                        </td>
                                        <td className="px-6 py-4 text-center">
                                            <div className="flex flex-col items-center gap-2">
                                                <div className="hidden">
                                                    <QRCodeSVG 
                                                        id={`qr-${biz.id}`}
                                                        value={`https://enlacesanjuan.com.mx/${biz.category?.slug}/${biz.slug}`}
                                                        size={1024}
                                                        level="H"
                                                    />
                                                </div>
                                                <Button 
                                                    variant="outline" 
                                                    size="sm" 
                                                    className="w-10 h-10 rounded-xl p-0 flex items-center justify-center"
                                                    onClick={() => downloadQR(biz)}
                                                >
                                                    <QrCode size={16} />
                                                </Button>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <div className="flex items-center justify-end gap-2">
                                                <Link href={`/${biz.category?.slug}/${biz.slug}`} target="_blank">
                                                    <Button variant="ghost" size="sm" className="w-10 h-10 rounded-xl p-0 flex items-center justify-center"><Eye size={18} /></Button>
                                                </Link>
                                                <Link href={`/admin/negocios/${biz.id}`}>
                                                    <Button variant="ghost" size="sm" className="w-10 h-10 rounded-xl p-0 flex items-center justify-center"><Edit size={18} /></Button>
                                                </Link>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </AdminLayout>
    );
}
