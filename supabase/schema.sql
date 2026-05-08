-- Supabase schema base para Nuna Terra Perú
-- Ejecutar en SQL Editor de Supabase.

create extension if not exists "uuid-ossp";

create table if not exists regions (
  id uuid primary key default uuid_generate_v4(),
  name text not null,
  slug text unique not null,
  headline text,
  description text,
  hero_image_url text,
  card_image_url text,
  seo_title text,
  seo_description text,
  is_active boolean default true,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create table if not exists destinations (
  id uuid primary key default uuid_generate_v4(),
  region_id uuid references regions(id) on delete set null,
  name text not null,
  slug text unique not null,
  subtitle text,
  short_description text,
  description text,
  hero_image_url text,
  card_image_url text,
  altitude text,
  best_time_to_visit text,
  recommended_days text,
  ideal_for text[],
  seo_title text,
  seo_description text,
  is_active boolean default true,
  sort_order int default 0,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create table if not exists travel_categories (
  id uuid primary key default uuid_generate_v4(),
  name text not null,
  slug text unique not null,
  description text,
  icon text,
  is_active boolean default true,
  created_at timestamptz default now()
);

create table if not exists products (
  id uuid primary key default uuid_generate_v4(),
  product_type text not null check (product_type in ('package','tour')),
  title text not null,
  slug text unique not null,
  subtitle text,
  short_description text,
  description text,
  duration_days int,
  duration_nights int,
  duration_text text,
  main_destination_id uuid references destinations(id) on delete set null,
  region_id uuid references regions(id) on delete set null,
  price_from numeric,
  currency text default 'USD',
  service_type text,
  difficulty_level text,
  language_options text[],
  min_people int,
  max_people int,
  card_image_url text,
  hero_image_url text,
  video_url text,
  is_featured boolean default false,
  is_active boolean default true,
  status text default 'draft' check (status in ('draft','published','archived')),
  sort_order int default 0,
  seo_title text,
  seo_description text,
  seo_keywords text,
  og_image_url text,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create table if not exists product_destinations (
  id uuid primary key default uuid_generate_v4(),
  product_id uuid references products(id) on delete cascade,
  destination_id uuid references destinations(id) on delete cascade,
  sort_order int default 0,
  is_primary boolean default false,
  created_at timestamptz default now(),
  unique(product_id, destination_id)
);

create table if not exists product_categories (
  id uuid primary key default uuid_generate_v4(),
  product_id uuid references products(id) on delete cascade,
  category_id uuid references travel_categories(id) on delete cascade,
  created_at timestamptz default now(),
  unique(product_id, category_id)
);

create table if not exists product_itinerary_days (
  id uuid primary key default uuid_generate_v4(),
  product_id uuid references products(id) on delete cascade,
  day_number int not null,
  title text not null,
  description text,
  destination_id uuid references destinations(id) on delete set null,
  meals text,
  accommodation text,
  activities text,
  image_url text,
  sort_order int default 0,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create table if not exists product_inclusions (
  id uuid primary key default uuid_generate_v4(),
  product_id uuid references products(id) on delete cascade,
  item_type text not null check (item_type in ('included','not_included','recommendation','important_note','requirement')),
  content text not null,
  sort_order int default 0,
  created_at timestamptz default now()
);

create table if not exists product_images (
  id uuid primary key default uuid_generate_v4(),
  product_id uuid references products(id) on delete cascade,
  image_url text not null,
  alt_text text,
  caption text,
  image_type text default 'gallery' check (image_type in ('gallery','card','hero','itinerary','background')),
  sort_order int default 0,
  is_active boolean default true,
  created_at timestamptz default now()
);

create table if not exists product_faqs (
  id uuid primary key default uuid_generate_v4(),
  product_id uuid references products(id) on delete cascade,
  question text not null,
  answer text not null,
  sort_order int default 0,
  is_active boolean default true,
  created_at timestamptz default now()
);

create table if not exists leads (
  id uuid primary key default uuid_generate_v4(),
  full_name text not null,
  email text,
  phone text,
  country text,
  interest_type text,
  destinations_interest text[],
  travel_date date,
  number_of_people int,
  duration_range text,
  travel_style text,
  message text,
  product_id uuid references products(id) on delete set null,
  source text default 'contact_page',
  status text default 'new' check (status in ('new','contacted','quoted','closed','lost')),
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create table if not exists site_settings (
  id uuid primary key default uuid_generate_v4(),
  setting_key text unique not null,
  setting_value text,
  setting_type text default 'text',
  updated_at timestamptz default now()
);

create table if not exists admins (
  id uuid primary key default uuid_generate_v4(),
  auth_user_id uuid,
  full_name text,
  role text default 'viewer' check (role in ('admin','editor','viewer')),
  avatar_url text,
  is_active boolean default true,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);
