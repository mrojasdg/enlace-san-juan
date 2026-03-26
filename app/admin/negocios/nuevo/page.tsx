import { AdminLayout } from "@/components/layout/AdminLayout";
import { BusinessForm } from "@/components/admin/BusinessForm";
import { supabase } from "@/lib/supabase";

export const revalidate = 0;

export default async function NewBusinessPage() {
    const { data: categories } = await supabase
        .from("categories")
        .select("*")
        .eq("is_active", true)
        .order("order_num", { ascending: true });

    return (
        <AdminLayout>
            <div className="max-w-5xl mx-auto">
                <BusinessForm categories={categories || []} />
            </div>
        </AdminLayout>
    );
}
