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
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Tabla por Edición de Revista */}
            <div className="lg:col-span-1 bg-white rounded-[2.5rem] border border-border shadow-xl overflow-hidden flex flex-col">
              <div className="p-6 border-b border-border bg-green-xpale/10 flex items-center gap-3">
                <BookOpen size={18} className="text-green" />
                <h2 className="font-outfit font-black text-sm text-ink uppercase tracking-widest">Impacto por Edición</h2>
              </div>
              <div className="flex-1 overflow-y-auto max-h-[500px]">
                <table className="w-full">
                  <thead className="sticky top-0 bg-white shadow-sm z-10">
                    <tr className="text-[9px] font-black text-muted uppercase tracking-widest border-b border-border">
                      <th className="px-6 py-4 text-left">Revista</th>
                      <th className="px-6 py-4 text-right">Hoy/30d</th>
                      <th className="px-6 py-4 text-right">Total</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border/50">
                    {(() => {
                      const magStats = (stats || [])
                        .filter(s => s.page_path.startsWith('revista/'))
                        .reduce((acc: any, curr) => {
                          const path = curr.page_path.replace('revista/', '');
                          if (!acc[path]) acc[path] = { path, total: 0, last30: 0 };
                          acc[path].total += Number(curr.count);
                          const thirtyDaysAgo = new Date();
                          thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
                          if (new Date(curr.view_date) >= thirtyDaysAgo) {
                            acc[path].last30 += Number(curr.count);
                          }
                          return acc;
                        }, {});
                      
                      const sorted = Object.values(magStats).sort((a: any, b: any) => b.total - a.total);
                      
                      if (sorted.length === 0) {
                        return <tr><td colSpan={3} className="px-6 py-10 text-center text-[10px] font-bold text-muted uppercase tracking-widest">Sin datos aún</td></tr>
                      }

                      return sorted.map((mag: any) => (
                        <tr key={mag.path} className="hover:bg-green-xpale/5 transition-colors">
                          <td className="px-6 py-4 font-outfit font-black text-ink text-xs uppercase">
                            {mag.path}
                          </td>
                          <td className="px-6 py-4 text-right font-jakarta font-bold text-green text-xs">
                            {mag.last30}
                          </td>
                          <td className="px-6 py-4 text-right font-outfit font-black text-ink text-sm">
                            {mag.total}
                          </td>
                        </tr>
                      ));
                    })()}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Tabla Detallada Día a Día */}
            <div className="lg:col-span-2 bg-white rounded-[2.5rem] border border-border shadow-xl overflow-hidden flex flex-col">
              <div className="p-6 border-b border-border bg-green-xpale/10 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Calendar size={18} className="text-green" />
                  <h2 className="font-outfit font-black text-sm text-ink uppercase tracking-widest">Actividad Día a Día</h2>
                </div>
              </div>
              <div className="flex-1 overflow-x-auto overflow-y-auto max-h-[500px]">
                <table className="w-full">
                  <thead className="sticky top-0 bg-white shadow-sm z-10">
                    <tr className="text-[9px] font-black text-muted uppercase tracking-widest border-b border-border">
                      <th className="px-8 py-4 text-left">Fecha</th>
                      <th className="px-8 py-4 text-left">Canal/Página</th>
                      <th className="px-8 py-4 text-right">Hits</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border/50">
                    {stats.slice(0, 50).map((row: any) => (
                      <tr key={row.id} className="hover:bg-green-xpale/5 transition-colors">
                        <td className="px-8 py-4 font-mono text-[10px] font-bold text-muted">
                          {new Date(row.view_date).toLocaleDateString('es-MX', { year: '2-digit', month: 'short', day: 'numeric' })}
                        </td>
                        <td className="px-8 py-4">
                          <span className="px-2 py-0.5 bg-gray-100 rounded text-[9px] font-black uppercase text-ink tracking-widest">
                            {row.page_path}
                          </span>
                        </td>
                        <td className="px-8 py-4 text-right font-outfit font-black text-green">
                          {row.count}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  );
}
