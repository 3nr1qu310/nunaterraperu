export type RegionSlug = 'costa' | 'sierra' | 'selva';

export interface TravelCategory {
  name: string;
  slug: string;
  description?: string;
  shortDescription?: string;
  icon?: string;
  image?: string;
  cardImage?: string;
  heroImage?: string;
  color?: string;
}
export type ProductType = 'package' | 'tour';

export type InclusionType =
  | 'included'
  | 'not_included'
  | 'recommendation'
  | 'important_note';

export interface Region {
  name: string;
  slug: RegionSlug;
  headline: string;
  description: string;
  shortDescription?: string;
  heroImage: string;
  cardImage: string;
  seoTitle?: string;
  seoDescription?: string;
}

export interface Destination {
  name: string;
  slug: string;
  region: RegionSlug;
  subtitle: string;
  description: string;
  shortDescription: string;
  heroImage: string;
  cardImage: string;
  altitude?: string;
  bestTime?: string;
  recommendedDays?: string;
  idealFor?: string[];
  seoTitle?: string;
  seoDescription?: string;
  mapX?: number;
  mapY?: number;
}

export interface ProductItineraryDay {
  day: string;
  dayNumber?: number;
  title: string;
  description: string;
  meals?: string;
  accommodation?: string;
  activities?: string;
  imageUrl?: string;
}

export interface ProductFaq {
  question: string;
  answer: string;
}

export interface ProductGalleryImage {
  imageUrl: string;
  altText?: string;
  caption?: string;
}

export interface ProductPromotion {
  slug: string;
  title: string;
  subtitle?: string;
  description?: string;
  promotionType?: string;
  badgeText?: string;
  discountType?: string;
  discountValue?: number;
  currency?: string;
  terms?: string;
  startDate?: string;
  endDate?: string;
  minPeople?: number;
  maxPeople?: number;
  isFeatured?: boolean;
  bannerImageUrl?: string;
  cardImageUrl?: string;
  notes?: string;
  customBadge?: string;
  promotionalPrice?: number;
  originalPrice?: number;
}

export interface Product {
  type: ProductType;
  title: string;
  slug: string;
  subtitle: string;
  description: string;
  shortDescription: string;
  durationText: string;

  destinations: string[];
  destinationSlugs?: string[];
  destinationRegions?: RegionSlug[];

  places?: string[];
  placeSlugs?: string[];

  region: RegionSlug;

  categories: string[];
  categorySlugs?: string[];

  priceFrom?: number;
  currency?: 'USD' | 'PEN';

  serviceType?: string;
  difficulty?: string;

  cardImage: string;
  heroImage: string;

  featured?: boolean;

  itinerary?: ProductItineraryDay[];

  includes?: string[];
  notIncludes?: string[];
  recommendations?: string[];
  importantNotes?: string[];

  faqs?: ProductFaq[];
  gallery?: ProductGalleryImage[];
  promotions?: ProductPromotion[];

  seoTitle?: string;
  seoDescription?: string;
  seoKeywords?: string;
}

export type ProductExtended = Product;

export interface DestinationPlace {
  id: string;
  destinationId: string;
  destinationSlug?: string;
  destinationName?: string;
  name: string;
  slug: string;
  subtitle?: string;
  shortDescription?: string;
  description?: string;
  heroImage?: string;
  cardImage?: string;
  altitude?: string;
  bestTime?: string;
  recommendedDays?: string;
  idealFor?: string[];
  latitude?: number;
  longitude?: number;
  mapX?: number;
  mapY?: number;
  showOnMap?: boolean;
  seoTitle?: string;
  seoDescription?: string;
}