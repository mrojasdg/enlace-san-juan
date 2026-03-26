import { AdminLayout } from '@/components/layout/AdminLayout';
import { BusinessForm } from '@/components/admin/BusinessForm';
import { supabase } from '@/lib/supabase';
import { notFound } from 'next/navigation';

export const revalidate = 0;

export default async function EditBusinessPage({
  params,
}: {
  params: { id: string };
}) {
  const { data: business } = await supabase
    .from('businesses')
    .select('*')
    .eq('id', params.id)
    .single();

  if (!business) notFound();

  const { data: categories } = await supabase
    .from('categories')
    .select('*')
    .eq('is_active', true)
    .order('order_num', { ascending: true });

  return (
    <AdminLayout title={`Editando: ${business.name}`}>
      <div className="max-w-5xl mx-auto">
        <BusinessForm initialData={business} categories={categories || []} />
      </div>
    </AdminLayout>
  );
}
