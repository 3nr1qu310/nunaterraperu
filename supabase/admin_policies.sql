-- Políticas RLS para que la web pueda leer contenido público
-- y el panel admin pueda crear/editar con usuarios autenticados.
-- Ejecutar después de schema.sql.

alter table public.regions enable row level security;
alter table public.destinations enable row level security;
alter table public.travel_categories enable row level security;
alter table public.products enable row level security;
alter table public.product_destinations enable row level security;
alter table public.product_categories enable row level security;
alter table public.product_itinerary_days enable row level security;
alter table public.product_inclusions enable row level security;
alter table public.product_images enable row level security;
alter table public.product_faqs enable row level security;
alter table public.leads enable row level security;
alter table public.site_settings enable row level security;
alter table public.admins enable row level security;

-- Limpiar políticas previas para poder re-ejecutar este archivo sin errores.
drop policy if exists "Public read active regions" on public.regions;
drop policy if exists "Public read active destinations" on public.destinations;
drop policy if exists "Public read active categories" on public.travel_categories;
drop policy if exists "Public read published products" on public.products;
drop policy if exists "Public read product destinations" on public.product_destinations;
drop policy if exists "Public read product categories" on public.product_categories;
drop policy if exists "Public read itinerary" on public.product_itinerary_days;
drop policy if exists "Public read inclusions" on public.product_inclusions;
drop policy if exists "Public read product images" on public.product_images;
drop policy if exists "Public read product faqs" on public.product_faqs;
drop policy if exists "Public insert leads" on public.leads;
drop policy if exists "Public read site settings" on public.site_settings;

-- Lectura pública para la web.
create policy "Public read active regions" on public.regions for select using (is_active = true);
create policy "Public read active destinations" on public.destinations for select using (is_active = true);
create policy "Public read active categories" on public.travel_categories for select using (is_active = true);
create policy "Public read published products" on public.products for select using (status = 'published' and is_active = true);
create policy "Public read product destinations" on public.product_destinations for select using (true);
create policy "Public read product categories" on public.product_categories for select using (true);
create policy "Public read itinerary" on public.product_itinerary_days for select using (true);
create policy "Public read inclusions" on public.product_inclusions for select using (true);
create policy "Public read product images" on public.product_images for select using (is_active = true);
create policy "Public read product faqs" on public.product_faqs for select using (is_active = true);
create policy "Public insert leads" on public.leads for insert with check (true);
create policy "Public read site settings" on public.site_settings for select using (true);

-- Políticas de administración.
-- Recomendación: crear usuarios solo desde Supabase Authentication y desactivar signup público.
-- Todo usuario autenticado podrá administrar el contenido. Para más seguridad, después se puede restringir con tabla admins.
do $$
declare
  t text;
begin
  foreach t in array array[
    'regions','destinations','travel_categories','products','product_destinations','product_categories',
    'product_itinerary_days','product_inclusions','product_images','product_faqs','leads','site_settings','admins'
  ] loop
    execute format('drop policy if exists "Authenticated manage %s" on public.%I', t, t);
    execute format('create policy "Authenticated manage %s" on public.%I for all to authenticated using (true) with check (true)', t, t);
  end loop;
end $$;
