-- =========================================================
-- Nuna Terra Perú - Media Library para Supabase Storage
-- Bucket recomendado: nuna-terra
-- Carpeta única recomendada dentro del bucket: media/
-- =========================================================

-- 1) Tabla para biblioteca de medios
create table if not exists public.media (
  id uuid primary key default gen_random_uuid(),
  file_name text not null,
  file_path text not null,
  public_url text not null,
  alt_text text,
  title text,
  caption text,
  mime_type text,
  size_bytes bigint,
  is_active boolean default true,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- 2) Trigger para updated_at
create or replace function public.set_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

drop trigger if exists set_media_updated_at on public.media;
create trigger set_media_updated_at
before update on public.media
for each row
execute function public.set_updated_at();

-- 3) RLS para tabla media
alter table public.media enable row level security;

drop policy if exists "Public can read active media" on public.media;
create policy "Public can read active media"
on public.media
for select
using (is_active = true);

drop policy if exists "Authenticated users can insert media" on public.media;
create policy "Authenticated users can insert media"
on public.media
for insert
to authenticated
with check (true);

drop policy if exists "Authenticated users can update media" on public.media;
create policy "Authenticated users can update media"
on public.media
for update
to authenticated
using (true)
with check (true);

drop policy if exists "Authenticated users can delete media" on public.media;
create policy "Authenticated users can delete media"
on public.media
for delete
to authenticated
using (true);

-- 4) Políticas para Supabase Storage
-- Antes crea manualmente un bucket público llamado: nuna-terra
-- Supabase > Storage > New bucket > Name: nuna-terra > Public bucket: ON

drop policy if exists "Public can view nuna terra images" on storage.objects;
create policy "Public can view nuna terra images"
on storage.objects
for select
using (bucket_id = 'nuna-terra');

drop policy if exists "Authenticated users can upload nuna terra images" on storage.objects;
create policy "Authenticated users can upload nuna terra images"
on storage.objects
for insert
to authenticated
with check (bucket_id = 'nuna-terra');

drop policy if exists "Authenticated users can update nuna terra images" on storage.objects;
create policy "Authenticated users can update nuna terra images"
on storage.objects
for update
to authenticated
using (bucket_id = 'nuna-terra')
with check (bucket_id = 'nuna-terra');

drop policy if exists "Authenticated users can delete nuna terra images" on storage.objects;
create policy "Authenticated users can delete nuna terra images"
on storage.objects
for delete
to authenticated
using (bucket_id = 'nuna-terra');

-- 5) Campos de imagen en tablas principales, por si aún no existen
alter table public.products
add column if not exists hero_image_url text,
add column if not exists card_image_url text;

alter table public.destinations
add column if not exists hero_image_url text,
add column if not exists card_image_url text;

alter table public.regions
add column if not exists hero_image_url text,
add column if not exists card_image_url text;
