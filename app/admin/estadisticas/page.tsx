import { AdminLayout } from '@/components/layout/AdminLayout';
import { supabase } from '@/lib/supabase';
import { 
  BarChart3, 
  TrendingUp, 
  Calendar, 
  MousePointer2, 
  BookOpen, 
  CreditCard, 
  UserPlus, 
  Layout 
} from 'lucide-react';

export const revalidate = 0;

export default async function EstadisticasPage() {
  // Obtener estadísticas de los últimos 30 días
  const { data: stats, error } = await supabase
    .from('site_stats')
    .select('*')
    .order('view_date', { ascending: false });

  if (error && error.code !== 'PGRST116') {
     // Si la tabla no existe aún, mostraremos un mensaje informativo
     console.error('Error fetching stats:', error);
  }

  const pagesTracked = [
    { id: 'index', name: 'Inicio (Página Principal)', icon: Layout },
    { id: 'precios', name: 'Planes y Precios', icon: CreditCard },
    { id: 'registrate', name: 'Formulario Registro', icon: UserPlus },
    { id: 'revista', name: 'Revista Digital', icon: BookOpen },
  ];

  // Agrupar datos por página
  const getMetrics = (path: string) => {
    const pageData = (stats || []).filter(s => s.page_path === path);
    const total = pageData.reduce((acc, curr) => acc + Number(curr.count), 0);
    
    // Calcular últimos 30 días (aproximado por los datos que tengamos)
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    const last30Days = pageData
      .filter(s => new Date(s.view_date) >= thirtyDaysAgo)
      .reduce((acc, curr) => acc + Number(curr.count), 0);

    return { total, last30Days };
  };

  return (
    <AdminLayout>
      <div className="space-y-12 animate-in fade-in duration-700">
        <header className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-green/10 text-green rounded-full font-black text-[10px] uppercase tracking-widest border border-green/20">
              <BarChart3 size={14} />
              Métricas de Rendimiento
            </div>
            <h1 className="font-outfit font-black text-5xl text-ink tracking-tight">
              Estadísticas del <span className="text-green">Sitio</span>
            </h1>
            <p className="text-muted font-jakarta text-lg">
              Seguimiento de visitas a las secciones clave de la plataforma.
            </p>
          </div>
        </header>

        {error && (
          <div className="p-8 bg-orange-50 border border-orange-200 rounded-3xl flex items-center gap-6">
            <div className="w-12 h-12 rounded-2xl bg-orange-100 text-orange-600 flex items-center justify-center flex-shrink-0">
              <Calendar size={24} />
            </div>
            <div>
              <h3 className="font-black text-ink uppercase tracking-widest text-sm mb-1">Configuración Pendiente</h3>
              <p className="text-muted text-xs font-jakarta italic">
                Para empezar a ver datos, es necesario crear la tabla 'site_stats' en tu base de datos de Supabase. 
                He preparado el componente de rastreo, pero la tabla de almacenamiento aún no está respondiendo.
              </p>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {pagesTracked.map((page) => {
            const metrics = getMetrics(page.id);
            return (
              <div key={page.id} className="bg-white rounded-[2.5rem] p-8 border border-border shadow-xl hover:shadow-2xl transition-all group overflow-hidden relative">
                <div className="absolute top-0 right-0 p-4 opacity-[0.03] group-hover:opacity-[0.08] transition-opacity">
                  <page.icon size={120} />
                </div>
                
                <div className="relative z-10 space-y-6">
                  <div className="w-12 h-12 rounded-2xl bg-green-xpale text-green flex items-center justify-center group-hover:scale-110 transition-transform shadow-sm">
                    <page.icon size={22} />
                  </div>
                  
                  <div>
                    <h3 className="font-outfit font-black text-ink text-sm uppercase tracking-widest leading-tight">
                      {page.name}
                    </h3>
                  </div>

                  <div className="pt-4 border-t border-border/50">
                    <div className="flex items-baseline gap-2">
                       <span className="text-4xl font-outfit font-black text-green-deeper">{metrics.last30Days}</span>
                       <span className="text-[10px] text-muted font-bold uppercase tracking-widest">Visitas (30d)</span>
                    </div>
                    <div className="mt-2 flex items-center gap-2 text-muted text-[10px] font-bold uppercase tracking-wider">
                       <TrendingUp size={12} className="text-green" />
                       Total histórico: {metrics.total}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Listado Detallado (Ultimas Fechas) */}
        {!error && stats && stats.length > 0 && (
          <div className="bg-white rounded-[3rem] border border-border shadow-2xl overflow-hidden">
             <div className="p-8 border-b border-border bg-green-xpale/20 flex items-center justify-between">
                <h2 className="font-outfit font-black text-xl text-ink uppercase tracking-widest">Actividad Reciente Día a Día</h2>
                <div className="text-[10px] font-bold text-muted uppercase tracking-[0.2em] bg-white px-4 py-2 rounded-full border border-border">
                   Mostrando historial completo
                </div>
             </div>
             <div className="overflow-x-auto">
               <table className="w-full">
                 <thead>
                   <tr className="bg-white text-[10px] font-black text-muted uppercase tracking-[0.2em] border-b border-border">
                     <th className="px-10 py-6 text-left">Fecha</th>
                     <th className="px-10 py-6 text-left">Página</th>
                     <th className="px-10 py-6 text-right">Visitas</th>
                   </tr>
                 </thead>
                 <tbody className="divide-y divide-border/50">
                   {stats.slice(0, 50).map((row: any) => (
                     <tr key={row.id} className="hover:bg-green-xpale/10 transition-colors">
                       <td className="px-10 py-5 font-mono text-xs font-bold text-muted">
                         {new Date(row.view_date).toLocaleDateString('es-MX', { year: 'numeric', month: 'long', day: 'numeric' })}
                       </td>
                       <td className="px-10 py-5">
                         <span className="px-3 py-1 bg-gray-100 rounded-full text-[10px] font-black uppercase text-ink tracking-widest">
                           {row.page_path}
                         </span>
                       </td>
                       <td className="px-10 py-5 text-right font-outfit font-black text-green text-lg">
                         {row.count}
                       </td>
                     </tr>
                   ))}
                 </tbody>
               </table>
             </div>
          </div>
        )}
      </div>
    </AdminLayout>
  );
}
