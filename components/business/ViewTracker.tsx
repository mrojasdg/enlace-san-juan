'use client';

import { useEffect } from 'react';
import { supabase } from '@/lib/supabase';

export const ViewTracker = ({ businessId }: { businessId: string }) => {
  useEffect(() => {
    // Al cargar la página, mandamos a llamar a la función de la BD para sumar +1 visita
    const recordView = async () => {
      const hasVisited = sessionStorage.getItem(`visited_${businessId}`);
      if (!hasVisited) {
        await supabase.rpc('increment_business_view', { biz_id: businessId });
        // Evita contarle múltiples visitas si el mismo usuario recarga la página en esta misma sesión:
        sessionStorage.setItem(`visited_${businessId}`, 'true');
      }
    };

    recordView();
  }, [businessId]);

  return null; // Este componente es invisible en pantalla
};
