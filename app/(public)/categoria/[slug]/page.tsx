import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { BusinessCard } from "@/components/business/BusinessCard";
import { supabase } from "@/lib/supabase";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";

export default async function CategoryPage({ params }: { params: { slug: string } }) {
    const { slug } = params;

    // Fetch category
    const { data: category } = await supabase
        .from("categories")
        .select("*")
        .eq("slug", slug)
        .single();

    if (!category) {
        notFound();
    }

    // Fetch businesses in this category
    const { data: businesses } = await supabase
        .from("businesses")
        .select("*, category:categories(*)")
        .eq("category_id", category.id)
        .eq("is_active", true)
        .order("is_featured", { ascending: false })
        .order("name", { ascending: true });

    return (
        <div className="min-h-screen bg-[#F9FCFA]">
            <Navbar />
            
            <div className="pt-32 pb-20 px-6 max-w-7xl mx-auto">
                <Link href="/" className="inline-flex items-center gap-2 text-muted hover:text-green transition-colors mb-12">
                    <ArrowLeft size={18} />
                    <span className="text-xs font-black uppercase tracking-widest">Volver al inicio</span>
                </Link>

                <div className="space-y-4 mb-16">
                    <h1 className="font-outfit font-black text-4xl md:text-6xl text-green-deeper">{category.name}</h1>
                    <p className="text-muted font-jakarta text-lg">{businesses?.length || 0} negocios encontrados</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {businesses?.map((biz) => (
                        <BusinessCard key={biz.id} business={biz as any} />
                    ))}
                </div>
            </div>

            <Footer />
        </div>
    );
}