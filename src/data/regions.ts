import type { Region } from '@/types/content';

export const regions: Region[] = [
  {
    name: 'Costa',
    slug: 'costa',
    headline: 'Mar, desierto, gastronomía y cultura viva.',
    description: 'La costa peruana combina historia, mar, desierto y una identidad gastronómica única.',
    heroImage: '/images/regions/costa-hero.jpg',
    cardImage: '/images/regions/costa-card.jpg',
  },
  {
    name: 'Sierra',
    slug: 'sierra',
    headline: 'Montañas, historia y paisajes sagrados.',
    description: 'La sierra reúne ciudades históricas, caminos andinos y una herencia cultural viva.',
    heroImage: '/images/regions/sierra-hero.jpg',
    cardImage: '/images/regions/sierra-card.jpg',
  },
  {
    name: 'Selva',
    slug: 'selva',
    headline: 'Naturaleza, biodiversidad y conexión profunda.',
    description: 'La selva invita a descubrir ríos, biodiversidad y experiencias donde la naturaleza se vive de cerca.',
    heroImage: '/images/regions/selva-hero.jpg',
    cardImage: '/images/regions/selva-card.jpg',
  },
];
