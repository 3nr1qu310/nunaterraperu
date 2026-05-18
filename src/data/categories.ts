import type { TravelCategory } from '@/types/content';

export const travelCategories: TravelCategory[] = [
  {
    name: 'Cultural',
    slug: 'cultural',
    icon: '◈',
    description: 'Conecta con la historia, tradición y patrimonio del Perú.',
  },
  {
    name: 'Aventura',
    slug: 'aventura',
    icon: '◬',
    description: 'Experiencias activas en entornos naturales únicos del Perú.',
  },
  {
    name: 'Familiar',
    slug: 'familiar',
    icon: '◇',
    description: 'Rutas diseñadas para disfrutar en familia con comodidad.',
  },
  {
    name: 'Premium',
    slug: 'premium',
    icon: '◆',
    description: 'Experiencias de alto estándar con atención exclusiva.',
  },
  {
    name: 'Full Day',
    slug: 'full-day',
    icon: '○',
    description: 'Tours de un día completo desde los principales destinos.',
  },
];
