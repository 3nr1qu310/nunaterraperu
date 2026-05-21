-- ============================================================
-- Tablas: places (lugares turísticos) y promotions (promociones)
-- Ejecutar en SQL Editor de Supabase (una sola vez).
-- ============================================================

-- ────────────────────────────────────────────────────────────
-- TABLA: places
-- Puntos de interés y atractivos turísticos dentro de un destino.
-- ────────────────────────────────────────────────────────────
create table if not exists places (
  id              uuid primary key default uuid_generate_v4(),
  destination_id  uuid references destinations(id) on delete set null,
  name            text not null,
  slug            text unique not null,
  subtitle        text,
  description     text,
  tips            text,
  image_url       text,
  type            text default 'attraction'
                    check (type in ('attraction','viewpoint','market','museum','nature','adventure','restaurant','hotel')),
  address         text,
  latitude        numeric,
  longitude       numeric,
  entrance_fee    text,
  opening_hours   text,
  is_active       boolean default true,
  sort_order      int default 0,
  created_at      timestamptz default now(),
  updated_at      timestamptz default now()
);

-- RLS: lectura pública para lugares activos
alter table places enable row level security;

create policy "places_public_read" on places
  for select using (is_active = true);

create policy "places_admin_all" on places
  for all using (auth.role() = 'authenticated');

-- ────────────────────────────────────────────────────────────
-- TABLA: promotions
-- Ofertas, descuentos y códigos promocionales.
-- ────────────────────────────────────────────────────────────
create table if not exists promotions (
  id              uuid primary key default uuid_generate_v4(),
  title           text not null,
  description     text,
  discount_type   text default 'percentage'
                    check (discount_type in ('percentage','fixed','free_service')),
  discount_value  numeric,
  promo_code      text unique,
  applies_to      text default 'all'
                    check (applies_to in ('all','packages','tours')),
  valid_from      date,
  valid_until     date,
  max_uses        int,
  current_uses    int default 0,
  badge_text      text,
  badge_color     text default 'green'
                    check (badge_color in ('green','earth','red','sand')),
  image_url       text,
  is_active       boolean default true,
  sort_order      int default 0,
  created_at      timestamptz default now(),
  updated_at      timestamptz default now()
);

-- RLS: lectura pública para promociones activas y vigentes
alter table promotions enable row level security;

create policy "promotions_public_read" on promotions
  for select using (
    is_active = true
    and (valid_from is null or valid_from <= current_date)
    and (valid_until is null or valid_until >= current_date)
  );

create policy "promotions_admin_all" on promotions
  for all using (auth.role() = 'authenticated');
