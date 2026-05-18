-- ==========================================
-- CONFIGURACIÓN DE ESTADÍSTICAS DE VISITAS
-- Ejecuta este script en el SQL Editor de tu panel de Supabase
-- ==========================================

-- 1. Crear la tabla de estadísticas
create table if not exists public.site_stats (
    id uuid default gen_random_uuid() primary key,
    page_path text not null,
    view_date date not null default current_date,
    count bigint not null default 0,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null,
    unique(page_path, view_date)
);

-- 2. Habilitar RLS (Row Level Security)
alter table public.site_stats enable row level security;

-- 3. Crear políticas de acceso libre para lectura y escritura
create policy "Allow public read access to site_stats"
on public.site_stats for select
using (true);

create policy "Allow public insert access to site_stats"
on public.site_stats for insert
with check (true);

create policy "Allow public update access to site_stats"
on public.site_stats for update
using (true);

-- 4. Crear la función RPC para incremento atómico de visitas
create or replace function public.increment_page_view(p_path text, p_date date)
returns void
language plpgsql
security definer
as $$
begin
    insert into public.site_stats (page_path, view_date, count)
    values (p_path, p_date, 1)
    on conflict (page_path, view_date)
    do update set count = public.site_stats.count + 1;
end;
$$;
