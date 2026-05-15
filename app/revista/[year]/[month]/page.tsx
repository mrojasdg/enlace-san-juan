import { supabase } from "@/lib/supabase";
import { notFound } from "next/navigation";
import { BookViewer } from "@/components/magazine/BookViewer";
import { Magazine, MagazinePage } from "@/types/magazine";

export default async function MagazineViewPage({
    params,
}: {
    params: { year: string; month: string };
}) {
    const { year, month } = params;

    // Buscar la revista por año y mes
    const { data: magazine } = await supabase
        .from("magazines")
        .select("*")
        .eq("year", parseInt(year))
        .eq("month", month)
        .single();

    if (!magazine) {
        notFound();
    }

    // Cargar todas las páginas de esa revista
    const { data: pages } = await supabase
        .from("magazine_pages")
        .select("*")
        .eq("magazine_id", magazine.id)
        .order("page_number", { ascending: true });

    return (
        <BookViewer 
            pages={(pages as MagazinePage[]) || []} 
            total={pages?.length || 0} 
        />
    );
}