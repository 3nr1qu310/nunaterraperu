import { supabase } from './supabase';
import type {
  Destination,
  DestinationPlace,
  ProductExtended,
  ProductType,
  Region,
  RegionSlug,
  TravelCategory,
} from '@/types/content';
import type { Locale } from '@/lib/i18n';

import { regions as mockRegions } from '@/data/regions';
import { destinations as mockDestinations } from '@/data/destinations';
import {
  products as mockProducts,
  packages as mockPackages,
  tours as mockTours,
} from '@/data/products';

const fallbackImage = '/images/placeholder.jpg';
const defaultLocale: Locale = 'es';

type TranslationRow = {
  locale: string;
  [key: string]: any;
};

function pickTranslation<T extends TranslationRow>(
  translations: T[] | null | undefined,
  locale: Locale = defaultLocale
): T | null {
  if (!Array.isArray(translations)) return null;

  return (
    translations.find((item) => item.locale === locale) ||
    translations.find((item) => item.locale === defaultLocale) ||
    null
  );
}

function withFallback<T>(translatedValue: T | null | undefined, baseValue: T | null | undefined, fallbackValue: T): T {
  return translatedValue || baseValue || fallbackValue;
}

function mapRegion(row: any, locale: Locale = defaultLocale): Region {
  const translation = pickTranslation(row.region_translations, locale);

  return {
    name: withFallback(translation?.name, row.name, ''),
    slug: row.slug,
    headline: withFallback(
      translation?.headline,
      row.headline || row.short_description,
      row.description || ''
    ),
    description: withFallback(
      translation?.description,
      row.description,
      row.headline || ''
    ),
    heroImage: row.hero_image_url || row.heroImage || fallbackImage,
    cardImage: row.card_image_url || row.cardImage || row.hero_image_url || fallbackImage,
    seoTitle: translation?.seo_title || row.seo_title || undefined,
    seoDescription: translation?.seo_description || row.seo_description || undefined,
  } as Region;
}

function mapDestination(row: any, locale: Locale = defaultLocale): Destination {
  const translation = pickTranslation(row.destination_translations, locale);

  const regionSlug =
    row.region?.slug ||
    row.regions?.slug ||
    row.region_slug ||
    row.region ||
    'sierra';

  return {
    name: withFallback(translation?.name, row.name, ''),
    slug: row.slug,
    region: regionSlug as RegionSlug,
    subtitle: withFallback(
      translation?.subtitle,
      row.subtitle,
      row.short_description || ''
    ),
    shortDescription: withFallback(
      translation?.short_description,
      row.short_description,
      row.subtitle || ''
    ),
    description: withFallback(
      translation?.description,
      row.description,
      row.short_description || ''
    ),
    heroImage: row.hero_image_url || fallbackImage,
    cardImage: row.card_image_url || row.hero_image_url || fallbackImage,
    altitude: row.altitude || undefined,
    bestTime: translation?.best_time_to_visit || row.best_time_to_visit || undefined,
    recommendedDays: translation?.recommended_days || row.recommended_days || undefined,
    idealFor: row.ideal_for || [],
    seoTitle: translation?.seo_title || row.seo_title || undefined,
    seoDescription: translation?.seo_description || row.seo_description || undefined,
    mapX: row.map_x || undefined,
    mapY: row.map_y || undefined,
  } as Destination;
}

function getProductDestinationRows(row: any) {
  return Array.isArray(row.product_destinations)
    ? row.product_destinations
    : [];
}

function normalizeText(value: string): string {
  return value
    .toLowerCase()
    .normalize('NFD')
    .replace(/\p{Diacritic}/gu, '')
    .trim();
}

function uniqueValues<T>(values: T[]): T[] {
  return [...new Set(values.filter(Boolean))];
}

function getCategoryRows(row: any) {
  return Array.isArray(row.product_categories) ? row.product_categories : [];
}

function getPlaceRows(row: any) {
  return Array.isArray(row.product_places) ? row.product_places : [];
}

function getPromotionRows(row: any) {
  return Array.isArray(row.promotion_products) ? row.promotion_products : [];
}

function mapProduct(row: any, locale: Locale = defaultLocale): ProductExtended {
  const productTranslation = pickTranslation(row.product_translations, locale);
  const destinationRows = getProductDestinationRows(row);

  const destinationNames = destinationRows
    .map((item: any) => {
      const destination = item.destinations || item.destination;
      const destinationTranslation = pickTranslation(destination?.destination_translations, locale);

      return destinationTranslation?.name || destination?.name;
    })
    .filter(Boolean);

  const destinationSlugs = destinationRows
    .map((item: any) => item.destinations?.slug || item.destination?.slug)
    .filter(Boolean);

  const destinationRegions = destinationRows
    .map((item: any) => {
      return (
        item.destinations?.regions?.slug ||
        item.destinations?.region?.slug ||
        item.destination?.regions?.slug ||
        item.destination?.region?.slug
      );
    })
    .filter(Boolean);

  const placeRows = getPlaceRows(row);

const places = placeRows.length
  ? uniqueValues(
      placeRows
        .map((item: any) => {
          const place = item.destination_places || item.place;
          return place?.name;
        })
        .filter(Boolean)
    )
  : [];

const placeSlugs = placeRows.length
  ? uniqueValues(
      placeRows
        .map((item: any) => {
          const place = item.destination_places || item.place;
          return place?.slug;
        })
        .filter(Boolean)
    )
  : [];

  const regionSlug =
    row.region?.slug ||
    row.regions?.slug ||
    row.region_slug ||
    row.region ||
    destinationRegions[0] ||
    'sierra';

  const categoryRows = getCategoryRows(row);

  const categories = categoryRows.length
    ? uniqueValues(
        categoryRows
          .map((item: any) => {
            const category = item.travel_categories || item.category;
            return category?.name;
          })
          .filter(Boolean)
      )
    : row.categories || [];

  const categorySlugs = categoryRows.length
    ? uniqueValues(
        categoryRows
          .map((item: any) => {
            const category = item.travel_categories || item.category;
            return category?.slug;
          })
          .filter(Boolean)
      )
    : [];

  const inclusions = Array.isArray(row.product_inclusions)
    ? row.product_inclusions
    : [];

  const included = inclusions
    .filter((item: any) => item.item_type === 'included')
    .sort((a: any, b: any) => (a.sort_order || 0) - (b.sort_order || 0))
    .map((item: any) => {
      const translation = pickTranslation(item.product_inclusion_translations, locale);
      return translation?.content || item.content;
    })
    .filter(Boolean);

  const notIncluded = inclusions
    .filter((item: any) => item.item_type === 'not_included')
    .sort((a: any, b: any) => (a.sort_order || 0) - (b.sort_order || 0))
    .map((item: any) => {
      const translation = pickTranslation(item.product_inclusion_translations, locale);
      return translation?.content || item.content;
    })
    .filter(Boolean);

  const recommendations = inclusions
    .filter((item: any) => item.item_type === 'recommendation')
    .sort((a: any, b: any) => (a.sort_order || 0) - (b.sort_order || 0))
    .map((item: any) => {
      const translation = pickTranslation(item.product_inclusion_translations, locale);
      return translation?.content || item.content;
    })
    .filter(Boolean);

  const importantNotes = inclusions
    .filter((item: any) => item.item_type === 'important_note')
    .sort((a: any, b: any) => (a.sort_order || 0) - (b.sort_order || 0))
    .map((item: any) => {
      const translation = pickTranslation(item.product_inclusion_translations, locale);
      return translation?.content || item.content;
    })
    .filter(Boolean);

  const itinerary = Array.isArray(row.product_itinerary_days)
    ? row.product_itinerary_days
        .sort(
          (a: any, b: any) =>
            (a.sort_order ?? a.day_number ?? 0) -
            (b.sort_order ?? b.day_number ?? 0)
        )
        .map((day: any) => {
          const translation = pickTranslation(day.product_itinerary_day_translations, locale);

          return {
            day: `Día ${day.day_number}`,
            dayNumber: day.day_number,
            title: translation?.title || day.title,
            description: translation?.description || day.description || '',
            meals: translation?.meals || day.meals || '',
            accommodation: translation?.accommodation || day.accommodation || '',
            activities: translation?.activities || day.activities || '',
            imageUrl: day.image_url || undefined,
          };
        })
    : row.itinerary || [];

  const faqs = Array.isArray(row.product_faqs)
    ? row.product_faqs
        .filter((faq: any) => faq.is_active !== false)
        .sort((a: any, b: any) => (a.sort_order || 0) - (b.sort_order || 0))
        .map((faq: any) => {
          const translation = pickTranslation(faq.product_faq_translations, locale);

          return {
            question: translation?.question || faq.question,
            answer: translation?.answer || faq.answer,
          };
        })
        .filter((faq: any) => faq.question && faq.answer)
    : [];

  const gallery = Array.isArray(row.product_images)
    ? row.product_images
        .filter((image: any) => image.is_active !== false)
        .sort((a: any, b: any) => (a.sort_order || 0) - (b.sort_order || 0))
        .map((image: any) => ({
          imageUrl: image.image_url,
          altText: image.alt_text || '',
          caption: image.caption || '',
        }))
        .filter((image: any) => image.imageUrl)
    : [];

  const promotions = getPromotionRows(row)
    .map((item: any) => {
      const promotion = item.promotions || item.promotion;

      if (!promotion || promotion.is_active === false) return null;

      return {
        slug: promotion.slug,
        title: promotion.title,
        subtitle: promotion.subtitle || '',
        description: promotion.description || '',
        promotionType: promotion.promotion_type || '',
        badgeText: promotion.badge_text || '',
        discountType: promotion.discount_type || '',
        discountValue: promotion.discount_value ? Number(promotion.discount_value) : undefined,
        currency: promotion.currency || 'USD',
        terms: promotion.terms || '',
        startDate: promotion.start_date || undefined,
        endDate: promotion.end_date || undefined,
        minPeople: promotion.min_people || undefined,
        maxPeople: promotion.max_people || undefined,
        isFeatured: Boolean(promotion.is_featured),
        bannerImageUrl: promotion.banner_image_url || undefined,
        cardImageUrl: promotion.card_image_url || undefined,
        notes: item.notes || '',
        customBadge: item.custom_badge || '',
        promotionalPrice: item.promotional_price ? Number(item.promotional_price) : undefined,
        originalPrice: item.original_price ? Number(item.original_price) : undefined,
      };
    })
    .filter(Boolean);

  return {
    type: row.product_type,
    title: productTranslation?.title || row.title,
    slug: row.slug,
    subtitle: productTranslation?.subtitle || row.subtitle || row.short_description || '',
    shortDescription:
      productTranslation?.short_description ||
      row.short_description ||
      row.subtitle ||
      '',
    description:
      productTranslation?.description ||
      row.description ||
      row.short_description ||
      '',
    durationText:
      productTranslation?.duration_text ||
      row.duration_text ||
      `${row.duration_days || ''} días`.trim(),
    destinations: destinationNames.length ? destinationNames : row.destinations || [],
    destinationSlugs,
    destinationRegions: destinationRegions as RegionSlug[],
    places,
    placeSlugs,
    region: regionSlug as RegionSlug,
    categories,
    categorySlugs,
    priceFrom: row.price_from ? Number(row.price_from) : undefined,
    currency: row.currency || 'USD',
    serviceType: productTranslation?.service_type || row.service_type || undefined,
    difficulty: productTranslation?.difficulty_level || row.difficulty_level || undefined,
    cardImage: row.card_image_url || fallbackImage,
    heroImage: row.hero_image_url || row.card_image_url || fallbackImage,
    featured: Boolean(row.is_featured),
    itinerary,
    includes: included,
    notIncludes: notIncluded,
    recommendations,
    importantNotes,
    faqs,
    gallery,
    promotions,
    seoTitle: productTranslation?.seo_title || row.seo_title || undefined,
    seoDescription: productTranslation?.seo_description || row.seo_description || undefined,
    seoKeywords: productTranslation?.seo_keywords || row.seo_keywords || undefined,
  } as ProductExtended;
}

async function safeQuery<T>(
  query: PromiseLike<{ data: any; error: any }>,
  fallback: T
): Promise<T> {
  try {
    const { data, error } = await query;

    if (error || !data) {
      if (error) console.error(error);
      return fallback;
    }

    return data;
  } catch (error) {
    console.error(error);
    return fallback;
  }
}

export async function getRegions(locale: Locale = defaultLocale): Promise<Region[]> {
  if (!supabase) return mockRegions;

  const data = await safeQuery(
    supabase
      .from('regions')
      .select(`
        *,
        region_translations(*)
      `)
      .eq('is_active', true)
      .order('name'),
    null
  );

  return Array.isArray(data) && data.length
    ? data.map((row) => mapRegion(row, locale))
    : mockRegions;
}

export async function getRegionBySlug(
  slug: string,
  locale: Locale = defaultLocale
): Promise<Region | null> {
  const regions = await getRegions(locale);
  return regions.find((region) => region.slug === slug) || null;
}

export async function getDestinations(locale: Locale = defaultLocale): Promise<Destination[]> {
  if (!supabase) return mockDestinations;

  const data = await safeQuery(
    supabase
      .from('destinations')
      .select(`
        *,
        regions(slug,name),
        destination_translations(*)
      `)
      .eq('is_active', true)
      .order('sort_order', { ascending: true })
      .order('name', { ascending: true }),
    null
  );

  return Array.isArray(data) && data.length
    ? data.map((row) => mapDestination(row, locale))
    : mockDestinations;
}

export async function getDestinationBySlug(
  slug: string,
  locale: Locale = defaultLocale
): Promise<Destination | null> {
  const destinations = await getDestinations(locale);
  return destinations.find((destination) => destination.slug === slug) || null;
}

export async function getProducts(
  locale: Locale = defaultLocale,
  type?: 'package' | 'tour'
): Promise<ProductExtended[]> {
  if (!supabase) {
    return type === 'package'
      ? mockPackages
      : type === 'tour'
        ? mockTours
        : mockProducts;
  }

  let query = supabase
    .from('products')
    .select(`
      *,
      product_translations(*),
      regions(slug,name),
      product_destinations(
        sort_order,
        is_primary,
        destinations(
          name,
          slug,
          regions(slug,name),
          destination_translations(*)
        )
      ),
      product_places(
        sort_order,
        is_primary,
        destination_places(
          name,
          slug
        )
      ),
      product_categories(
        travel_categories(name,slug)
      ),
      product_itinerary_days(
        id,
        day_number,
        title,
        description,
        meals,
        accommodation,
        activities,
        image_url,
        sort_order,
        product_itinerary_day_translations(*)
      ),
      product_inclusions(
        id,
        item_type,
        content,
        sort_order,
        product_inclusion_translations(*)
      ),
      product_faqs(
        id,
        question,
        answer,
        sort_order,
        is_active,
        product_faq_translations(*)
      ),
      product_images(
        image_url,
        alt_text,
        caption,
        image_type,
        sort_order,
        is_active
      ),
      promotion_products(
        custom_badge,
        notes,
        sort_order,
        is_active,
        promotions(
          title,
          slug,
          subtitle,
          badge_text,
          discount_type,
          discount_value,
          start_date,
          end_date,
          is_active
        )
      )
    `)
    .eq('is_active', true)
    .eq('status', 'published')
    .order('sort_order', { ascending: true })
    .order('created_at', { ascending: false });
  if (type) {
    query = query.eq('product_type', type);
  }

  const data = await safeQuery(query, null);

  const fallback =
    type === 'package'
      ? mockPackages
      : type === 'tour'
        ? mockTours
        : mockProducts;

  return Array.isArray(data) && data.length
    ? data.map((row) => mapProduct(row, locale))
    : fallback;
}

export async function getPackages(locale: Locale = defaultLocale): Promise<ProductExtended[]> {
  return getProducts(locale, 'package');
}

export async function getTours(locale: Locale = defaultLocale): Promise<ProductExtended[]> {
  return getProducts(locale, 'tour');
}

export async function getProductBySlug(
  slug: string,
  type?: 'package' | 'tour',
  locale: Locale = defaultLocale
): Promise<ProductExtended | null> {
  const products = await getProducts(locale, type);
  return products.find((product) => product.slug === slug) || null;
}

export async function getProductsByRegion(
  regionSlug: string,
  locale: Locale = defaultLocale
): Promise<ProductExtended[]> {
  const products = await getProducts(locale);

  return products.filter((product) => {
    return (
      product.region === regionSlug ||
      product.destinationRegions?.includes(regionSlug as RegionSlug)
    );
  });
}

export async function getProductsByDestinationName(
  destinationName: string,
  locale: Locale = defaultLocale
): Promise<ProductExtended[]> {
  const products = await getProducts(locale);
  const cleanName = destinationName.toLowerCase().trim();

  return products.filter((product) => {
    return product.destinations.some(
      (destination) => destination.toLowerCase().trim() === cleanName
    );
  });
}

export async function getProductsByDestinationSlug(
  destinationSlug: string,
  locale: Locale = defaultLocale
): Promise<ProductExtended[]> {
  const products = await getProducts(locale);

  return products.filter((product) => {
    return product.destinationSlugs?.includes(destinationSlug);
  });
}

export async function getProductsByCategorySlug(
  categorySlug: string,
  locale: Locale = defaultLocale,
  type?: ProductType
): Promise<ProductExtended[]> {
  const products = await getProducts(locale, type);
  const cleanSlug = normalizeText(categorySlug);

  return products.filter((product) =>
    product.categorySlugs?.some((slug) => normalizeText(slug) === cleanSlug)
  );
}

export async function getPackagesByCategorySlug(
  categorySlug: string,
  locale: Locale = defaultLocale
): Promise<ProductExtended[]> {
  return getProductsByCategorySlug(categorySlug, locale, 'package');
}

export async function getToursByCategorySlug(
  categorySlug: string,
  locale: Locale = defaultLocale
): Promise<ProductExtended[]> {
  return getProductsByCategorySlug(categorySlug, locale, 'tour');
}

export async function getProductsByTravelStyle(
  styleSlug: string,
  locale: Locale = defaultLocale,
  type?: ProductType
): Promise<ProductExtended[]> {
  return getProductsByCategorySlug(styleSlug, locale, type);
}

export async function getPackagesByTravelStyle(
  styleSlug: string,
  locale: Locale = defaultLocale
): Promise<ProductExtended[]> {
  return getProductsByTravelStyle(styleSlug, locale, 'package');
}

export async function getToursByTravelStyle(
  styleSlug: string,
  locale: Locale = defaultLocale
): Promise<ProductExtended[]> {
  return getProductsByTravelStyle(styleSlug, locale, 'tour');
}

export async function getProductsByPlaceSlug(
  placeSlug: string,
  locale: Locale = defaultLocale,
  type?: ProductType
): Promise<ProductExtended[]> {
  const products = await getProducts(locale, type);
  const cleanSlug = normalizeText(placeSlug);

  return products.filter((product) =>
    product.placeSlugs?.some((slug) => normalizeText(slug) === cleanSlug)
  );
}

export async function getFeaturedProducts(
  locale: Locale = defaultLocale,
  type?: ProductType,
  limit?: number
): Promise<ProductExtended[]> {
  const products = await getProducts(locale, type);
  const featured = products.filter((product) => product.featured);

  return typeof limit === 'number' ? featured.slice(0, limit) : featured;
}

export async function getFeaturedPackages(
  locale: Locale = defaultLocale,
  limit?: number
): Promise<ProductExtended[]> {
  return getFeaturedProducts(locale, 'package', limit);
}

export async function getFeaturedTours(
  locale: Locale = defaultLocale,
  limit?: number
): Promise<ProductExtended[]> {
  return getFeaturedProducts(locale, 'tour', limit);
}

export async function getProductsWithPromotions(
  locale: Locale = defaultLocale,
  type?: ProductType
): Promise<ProductExtended[]> {
  const products = await getProducts(locale, type);

  return products.filter(
    (product) => Array.isArray(product.promotions) && product.promotions.length > 0
  );
}

export async function getPackagesWithPromotions(
  locale: Locale = defaultLocale
): Promise<ProductExtended[]> {
  return getProductsWithPromotions(locale, 'package');
}

export async function getToursWithPromotions(
  locale: Locale = defaultLocale
): Promise<ProductExtended[]> {
  return getProductsWithPromotions(locale, 'tour');
}

export async function getProductPromotions(
  productSlug: string,
): Promise<NonNullable<ProductExtended['promotions']>> {
  if (!supabase) {
    const product =
      mockProducts.find((p) => p.slug === productSlug) ||
      mockPackages.find((p) => p.slug === productSlug) ||
      mockTours.find((p) => p.slug === productSlug);
    return product?.promotions ?? [];
  }

  // Paso 1: obtener el id del producto por slug
  const { data: productRow, error: productError } = await supabase
    .from('products')
    .select('id')
    .eq('slug', productSlug)
    .maybeSingle();

  if (productError) {
    console.error('[getProductPromotions] error al buscar producto:', productError.message);
    return [];
  }
  if (!productRow?.id) return [];

  // Paso 2: obtener promotion_products + promotions via FK promotion_id → promotions.id
  // No filtramos is_active a nivel DB para evitar problemas con valores NULL (default true)
  const { data, error } = await supabase
    .from('promotion_products')
    .select(`
      is_active,
      promotional_price,
      original_price,
      custom_badge,
      notes,
      sort_order,
      promotions(
        title,
        slug,
        subtitle,
        description,
        promotion_type,
        discount_type,
        discount_value,
        currency,
        badge_text,
        terms,
        start_date,
        end_date,
        min_people,
        max_people,
        is_featured,
        banner_image_url,
        card_image_url,
        is_active
      )
    `)
    .eq('product_id', productRow.id)
    .order('sort_order', { ascending: true });

  if (error) {
    console.error('[getProductPromotions] error al obtener promociones:', error.message);
    return [];
  }

  if (!Array.isArray(data) || !data.length) return [];

  return data
    .filter((item: any) => item.is_active !== false)
    .map((item: any) => {
      const promo = item.promotions;
      if (!promo || promo.is_active === false) return null;

      return {
        slug: promo.slug,
        title: promo.title,
        subtitle: promo.subtitle || '',
        description: promo.description || '',
        promotionType: promo.promotion_type || '',
        badgeText: promo.badge_text || '',
        discountType: promo.discount_type || '',
        discountValue: promo.discount_value ? Number(promo.discount_value) : undefined,
        currency: promo.currency || 'USD',
        terms: promo.terms || '',
        startDate: promo.start_date || undefined,
        endDate: promo.end_date || undefined,
        minPeople: promo.min_people || undefined,
        maxPeople: promo.max_people || undefined,
        isFeatured: Boolean(promo.is_featured),
        bannerImageUrl: promo.banner_image_url || undefined,
        cardImageUrl: promo.card_image_url || undefined,
        notes: item.notes || '',
        customBadge: item.custom_badge || '',
        promotionalPrice: item.promotional_price ? Number(item.promotional_price) : undefined,
        originalPrice: item.original_price ? Number(item.original_price) : undefined,
      };
    })
    .filter(Boolean) as NonNullable<ProductExtended['promotions']>;
}

export async function getProductsByRegionAndCategory(
  regionSlug: RegionSlug,
  categorySlug: string,
  locale: Locale = defaultLocale,
  type?: ProductType
): Promise<ProductExtended[]> {
  const products = await getProductsByRegion(regionSlug, locale);
  const cleanCategory = normalizeText(categorySlug);

  return products.filter((product) => {
    const matchesType = type ? product.type === type : true;

    const matchesCategory = product.categorySlugs?.some(
      (slug) => normalizeText(slug) === cleanCategory
    );

    return matchesType && matchesCategory;
  });
}

export async function getRelatedProducts(
  productSlug: string,
  locale: Locale = defaultLocale,
  limit = 3
): Promise<ProductExtended[]> {
  const products = await getProducts(locale);
  const currentProduct = products.find((product) => product.slug === productSlug);

  if (!currentProduct) return [];

  return products
    .filter((product) => product.slug !== currentProduct.slug)
    .map((product) => {
      let score = 0;

      if (product.type === currentProduct.type) score += 2;
      if (product.region === currentProduct.region) score += 3;

      const sharedDestinations = product.destinationSlugs?.filter((slug) =>
        currentProduct.destinationSlugs?.includes(slug)
      );

      const sharedPlaces = product.placeSlugs?.filter((slug) =>
        currentProduct.placeSlugs?.includes(slug)
      );

      const sharedCategories = product.categorySlugs?.filter((slug) =>
        currentProduct.categorySlugs?.includes(slug)
      );

      score += (sharedDestinations?.length || 0) * 4;
      score += (sharedPlaces?.length || 0) * 3;
      score += (sharedCategories?.length || 0) * 2;

      return { product, score };
    })
    .filter((item) => item.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, limit)
    .map((item) => item.product);
}

export async function searchProducts(
  searchTerm: string,
  locale: Locale = defaultLocale,
  type?: ProductType
): Promise<ProductExtended[]> {
  const products = await getProducts(locale, type);
  const term = normalizeText(searchTerm);

  if (!term) return products;

  return products.filter((product) => {
    const searchableContent = [
      product.title,
      product.subtitle,
      product.shortDescription,
      product.description,
      product.region,
      ...(product.destinations || []),
      ...(product.places || []),
      ...(product.categories || []),
      ...(product.categorySlugs || []),
    ]
      .join(' ')
      .toLowerCase();

    return normalizeText(searchableContent).includes(term);
  });
}

export async function getTravelCategories(): Promise<TravelCategory[]> {
  if (!supabase) return [];

  const data = await safeQuery(
    supabase
      .from('travel_categories')
      .select('id, name, slug, description, icon, cardImage, heroImage')
      .eq('is_active', true)
      .order('name'),
    null
  );

  if (!Array.isArray(data) || !data.length) return [];

  return data.map((row) => ({
    id: row.id,
    name: row.name,
    slug: row.slug,
    description: row.description || '',
    icon: row.icon || '',
    cardImage: row.cardImage || '',
    heroImage: row.heroImage || '',
  }));
}

function mapPlace(row: any): DestinationPlace {
  return {
    id: row.id,
    destinationId: row.destination_id,
    destinationSlug: row.destinations?.slug || undefined,
    destinationName: row.destinations?.name || undefined,
    name: row.name || '',
    slug: row.slug,
    subtitle: row.subtitle || undefined,
    shortDescription: row.short_description || undefined,
    description: row.description || undefined,
    heroImage: row.hero_image_url || undefined,
    cardImage: row.card_image_url || row.hero_image_url || undefined,
    altitude: row.altitude || undefined,
    bestTime: row.best_time_to_visit || undefined,
    recommendedDays: row.recommended_days || undefined,
    idealFor: Array.isArray(row.ideal_for) ? row.ideal_for : [],
    latitude: row.latitude != null ? Number(row.latitude) : undefined,
    longitude: row.longitude != null ? Number(row.longitude) : undefined,
    mapX: row.map_x != null ? Number(row.map_x) : undefined,
    mapY: row.map_y != null ? Number(row.map_y) : undefined,
    showOnMap: row.show_on_map !== false,
    seoTitle: row.seo_title || undefined,
    seoDescription: row.seo_description || undefined,
  };
}

export async function getPlacesByDestinationId(
  destinationId: string
): Promise<DestinationPlace[]> {
  if (!supabase) return [];

  const data = await safeQuery(
    supabase
      .from('destination_places')
      .select('*')
      .eq('destination_id', destinationId)
      .eq('is_active', true)
      .order('sort_order', { ascending: true })
      .order('name', { ascending: true }),
    null
  );

  return Array.isArray(data) ? data.map(mapPlace) : [];
}

export async function getPlacesByDestinationSlug(
  destinationSlug: string
): Promise<DestinationPlace[]> {
  if (!supabase) return [];

  const { data: destRow } = await supabase
    .from('destinations')
    .select('id')
    .eq('slug', destinationSlug)
    .maybeSingle();

  if (!destRow?.id) return [];

  return getPlacesByDestinationId(destRow.id);
}

export async function getAllPlaces(): Promise<DestinationPlace[]> {
  if (!supabase) return [];

  const data = await safeQuery(
    supabase
      .from('destination_places')
      .select('*')
      .eq('is_active', true)
      .order('name', { ascending: true }),
    null
  );

  return Array.isArray(data) ? data.map(mapPlace) : [];
}

export async function getPlaceBySlug(
  slug: string
): Promise<DestinationPlace | null> {
  if (!supabase) return null;

  const data = await safeQuery(
    supabase
      .from('destination_places')
      .select(`
        *,
        destinations(id, slug, name)
      `)
      .eq('slug', slug)
      .eq('is_active', true)
      .maybeSingle(),
    null
  );

  return data ? mapPlace(data) : null;
}

export async function getProductsByFilters({
  locale = defaultLocale,
  type,
  regionSlug,
  destinationSlug,
  placeSlug,
  categorySlug,
  featured,
  withPromotions,
  limit,
}: {
  locale?: Locale;
  type?: ProductType;
  regionSlug?: RegionSlug;
  destinationSlug?: string;
  placeSlug?: string;
  categorySlug?: string;
  featured?: boolean;
  withPromotions?: boolean;
  limit?: number;
}): Promise<ProductExtended[]> {
  let products = await getProducts(locale, type);

  if (regionSlug) {
    products = products.filter((product) => {
      return (
        product.region === regionSlug ||
        product.destinationRegions?.includes(regionSlug)
      );
    });
  }

  if (destinationSlug) {
    const cleanDestination = normalizeText(destinationSlug);

    products = products.filter((product) =>
      product.destinationSlugs?.some(
        (slug) => normalizeText(slug) === cleanDestination
      )
    );
  }

  if (placeSlug) {
    const cleanPlace = normalizeText(placeSlug);

    products = products.filter((product) =>
      product.placeSlugs?.some((slug) => normalizeText(slug) === cleanPlace)
    );
  }

  if (categorySlug) {
    const cleanCategory = normalizeText(categorySlug);

    products = products.filter((product) =>
      product.categorySlugs?.some(
        (slug) => normalizeText(slug) === cleanCategory
      )
    );
  }

  if (featured !== undefined) {
    products = products.filter((product) => Boolean(product.featured) === featured);
  }

  if (withPromotions) {
    products = products.filter(
      (product) => Array.isArray(product.promotions) && product.promotions.length > 0
    );
  }

  return typeof limit === 'number' ? products.slice(0, limit) : products;
}