'use client';

import { useEffect } from 'react';
import { supabase } from '@/lib/supabase';

interface PageTrackerProps {
  path: string;
}

export const PageTracker = ({ path }: PageTrackerProps) => {
  useEffect(() => {
    const recordPageView = async () => {
      try {
        // Obtener fecha local en formato YYYY-MM-DD (independiente de la zona horaria UTC)
        const date = new Date();
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        const today = `${year}-${month}-${day}`;
        const storageKey = `track_${path}_${today}`;
        
        if (sessionStorage.getItem(storageKey)) return;

        // Llamada a la función RPC de Supabase para incremento atómico
        const { error } = await supabase.rpc('increment_page_view', {
          p_path: path,
          p_date: today
        });

        if (!error) {
          sessionStorage.setItem(storageKey, 'true');
        }
      } catch (err) {
        console.error('Error tracking page view:', err);
      }
    };

    recordPageView();
  }, [path]);

  return null;
};
