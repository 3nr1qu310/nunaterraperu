import { supabase } from './supabase';
import type { Destination, Product, Region, RegionSlug } from '@/types/content';
import { regions as mockRegions } from '@/data/regions';
import { destinations as mockDestinations } from '@/data/destinations';
import { products as mockProducts, packages as mockPackages, tours as mockTours } from '@/data/products';

const fallbackImage = '/images/placeholder.jpg';

function mapRegion(row: any): Region {
  return {
    name: row.name,
    slug: row.slug,
    headline: row.headline || row.short_description || row.description || '',
    description: row.description || row.headline || '',
    heroImage: row.hero_image_url || row.heroImage || fallbackImage,
    cardImage: row.card_image_url || row.cardImage || row.hero_image_url || fallbackImage,
  } as Region;
}

function mapDestination(row: any): Destination {
  const regionSlug = row.region?.slug || row.regions?.slug || row.region_slug || row.region || 'sierra';
  return {
    name: row.name,
    slug: row.slug,
    region: regionSlug as RegionSlug,
    subtitle: row.subtitle || row.short_description || '',
    description: row.description || row.short_description || '',
    heroImage: row.hero_image_url || fallbackImage,
    cardImage: row.card_image_url || row.hero_image_url || fallbackImage,
    altitude: row.altitude || undefined,
    bestTime: row.best_time_to_visit || undefined,
    recommendedDays: row.recommended_days || undefined,
    idealFor: row.ideal_for || [],
  };
}

function mapProduct(row: any): Product {
  const regionSlug = row.region?.slug || row.regions?.slug || row.region_slug || row.region || 'sierra';

  const destinations = Array.isArray(row.product_destinations)
    ? row.product_destinations
        .map((item: any) => item.destinations?.name || item.destination?.name)
        .filter(Boolean)
    : row.destinations || [];

  const categories = Array.isArray(row.product_categories)
    ? row.product_categories
        .map((item: any) => item.travel_categories?.name || item.category?.name)
        .filter(Boolean)
    : row.categories || [];

  const inclusions = Array.isArray(row.product_inclusions) ? row.product_inclusions : [];
  const included = inclusions.filter((item: any) => item.item_type === 'included').map((item: any) => item.content);
  const notIncluded = inclusions.filter((item: any) => item.item_type === 'not_included').map((item: any) => item.content);
  const recommendations = inclusions.filter((item: any) => item.item_type === 'recommendation').map((item: any) => item.content);

  const itinerary = Array.isArray(row.product_itinerary_days)
    ? row.product_itinerary_days
        .sort((a: any, b: any) => (a.sort_order ?? a.day_number ?? 0) - (b.sort_order ?? b.day_number ?? 0))
        .map((day: any) => ({
          day: `Día ${day.day_number}`,
          title: day.title,
          description: day.description || '',
        }))
    : row.itinerary || [];

  return {
    type: row.product_type,
    title: row.title,
    slug: row.slug,
    subtitle: row.subtitle || row.short_description || '',
    description: row.description || row.short_description || '',
    durationText: row.duration_text || `${row.duration_days || ''} días`.trim(),
    destinations,
    region: regionSlug as RegionSlug,
    categories,
    priceFrom: row.price_from ? Number(row.price_from) : undefined,
    currency: row.currency || 'USD',
    serviceType: row.service_type || undefined,
    difficulty: row.difficulty_level || undefined,
    cardImage: row.card_image_url || fallbackImage,
    heroImage: row.hero_image_url || row.card_image_url || fallbackImage,
    featured: Boolean(row.is_featured),
    itinerary,
    includes: included,
    notIncludes: notIncluded,
    recommendations,
  } as Product;
}

async function safeQuery<T>(query: PromiseLike<{ data: any; error: any }>, fallback: T): Promise<T> {
  try {
    const { data, error } = await query;
    if (error || !data) return fallback;
    return data;
  } catch {
    return fallback;
  }
}

export async function getRegions(): Promise<Region[]> {
  if (!supabase) return mockRegions;
  const data = await safeQuery(
    supabase.from('regions').select('*').eq('is_active', true).order('name'),
    null,
  );
  return Array.isArray(data) && data.length ? data.map(mapRegion) : mockRegions;
}

export async function getRegionBySlug(slug: string): Promise<Region | null> {
  const regions = await getRegions();
  return regions.find((region) => region.slug === slug) || null;
}

export async function getDestinations(): Promise<Destination[]> {
  if (!supabase) return mockDestinations;
  const data = await safeQuery(
    supabase
      .from('destinations')
      .select('*, regions(slug,name)')
      .eq('is_active', true)
      .order('sort_order', { ascending: true })
      .order('name', { ascending: true }),
    null,
  );
  return Array.isArray(data) && data.length ? data.map(mapDestination) : mockDestinations;
}

export async function getDestinationBySlug(slug: string): Promise<Destination | null> {
  const destinations = await getDestinations();
  return destinations.find((destination) => destination.slug === slug) || null;
}

export async function getProducts(type?: 'package' | 'tour'): Promise<Product[]> {
  if (!supabase) return type === 'package' ? mockPackages : type === 'tour' ? mockTours : mockProducts;

  let query = supabase
    .from('products')
    .select(`
      *,
      regions(slug,name),
      product_destinations(sort_order,is_primary,destinations(name,slug)),
      product_categories(travel_categories(name,slug)),
      product_itinerary_days(day_number,title,description,sort_order),
      product_inclusions(item_type,content,sort_order)
    `)
    .eq('is_active', true)
    .eq('status', 'published')
    .order('sort_order', { ascending: true })
    .order('created_at', { ascending: false });

  if (type) query = query.eq('product_type', type);

  const data = await safeQuery(query, null);
  const fallback = type === 'package' ? mockPackages : type === 'tour' ? mockTours : mockProducts;
  return Array.isArray(data) && data.length ? data.map(mapProduct) : fallback;
}

export async function getPackages(): Promise<Product[]> {
  return getProducts('package');
}

export async function getTours(): Promise<Product[]> {
  return getProducts('tour');
}

export async function getProductBySlug(slug: string, type?: 'package' | 'tour'): Promise<Product | null> {
  const products = await getProducts(type);
  return products.find((product) => product.slug === slug) || null;
}

export async function getProductsByRegion(regionSlug: string): Promise<Product[]> {
  const products = await getProducts();
  return products.filter((product) => product.region === regionSlug);
}

export async function getProductsByDestinationName(destinationName: string): Promise<Product[]> {
  const products = await getProducts();
  return products.filter((product) => product.destinations.includes(destinationName));
}
