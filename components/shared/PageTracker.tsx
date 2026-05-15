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
        // Evitar múltiples conteos en la misma sesión/día
        const today = new Date().toISOString().split('T')[0];
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
