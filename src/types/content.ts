export type RegionSlug = 'costa' | 'sierra' | 'selva';
export type ProductType = 'package' | 'tour';

export interface Region {
  name: string;
  slug: RegionSlug;
  headline: string;
  description: string;
  heroImage: string;
  cardImage: string;
}

export interface Destination {
  name: string;
  slug: string;
  region: RegionSlug;
  subtitle: string;
  description: string;
  heroImage: string;
  cardImage: string;
  altitude?: string;
  bestTime?: string;
  recommendedDays?: string;
  idealFor?: string[];
}

export interface Product {
  type: ProductType;
  title: string;
  slug: string;
  subtitle: string;
  description: string;
  durationText: string;
  destinations: string[];
  region: RegionSlug;
  categories: string[];
  priceFrom?: number;
  currency?: 'USD' | 'PEN';
  serviceType?: string;
  difficulty?: string;
  cardImage: string;
  heroImage: string;
  featured?: boolean;
  itinerary?: Array<{ day: string; title: string; description: string }>;
  includes?: string[];
  notIncludes?: string[];
  recommendations?: string[];
}
