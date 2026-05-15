import { supabase } from "@/lib/supabase";
import { notFound, redirect } from "next/navigation";

export default async function ShortlinkPage({ params }: { params: { categoria: string } }) {
    // Check if the slug belongs to a business
    const { data: business } = await supabase
        .from("businesses")
        .select("slug, category:categories(slug)")
        .eq("slug", params.categoria)
        .single();

    // Check if the slug belongs to a category (categories could also use shortlinks if we want, but let's just stick to businesses for now, since explicit routes take precedence)

    if (!business || !business.category) {
        notFound();
    }

    // Redirect to the canonical URL
    const categorySlug = Array.isArray(business.category) ? business.category[0].slug : (business.category as any).slug;
    redirect(`/${categorySlug}/${business.slug}`);
}