import type { Product } from '@/types/content';

export const products: Product[] = [
  {
    type: 'package', title: 'Cusco y Machu Picchu 5 días', slug: 'cusco-machu-picchu-5-dias',
    subtitle: 'Historia, cultura andina y la experiencia de Machu Picchu en una ruta organizada.',
    description: 'Una experiencia diseñada para descubrir Cusco, el Valle Sagrado y Machu Picchu con acompañamiento y atención personalizada.',
    durationText: '5 días / 4 noches', destinations: ['Cusco', 'Valle Sagrado', 'Machu Picchu'], region: 'sierra', categories: ['Cultural', 'Familiar'], priceFrom: 690, currency: 'USD', serviceType: 'Privado o compartido', difficulty: 'Fácil a moderada',
    cardImage: '/images/products/cusco-machu-picchu-card.jpg', heroImage: '/images/products/cusco-machu-picchu-hero.jpg', featured: true,
    itinerary: [
      { day: 'Día 1', title: 'Llegada a Cusco', description: 'Recepción, traslado al hotel y tiempo de aclimatación.' },
      { day: 'Día 2', title: 'City Tour Cusco', description: 'Visita a Qorikancha y principales centros arqueológicos cercanos.' },
      { day: 'Día 3', title: 'Valle Sagrado', description: 'Recorrido por paisajes andinos y conexión hacia Aguas Calientes.' },
      { day: 'Día 4', title: 'Machu Picchu', description: 'Visita guiada a la ciudadela y retorno a Cusco.' },
      { day: 'Día 5', title: 'Salida', description: 'Traslado final según horario de viaje.' },
    ],
    includes: ['Traslados turísticos', 'Guía profesional', 'Asistencia durante el viaje'],
    notIncludes: ['Vuelos internacionales', 'Gastos personales', 'Alimentación no mencionada'],
    recommendations: ['Llevar documento de identidad o pasaporte', 'Usar ropa cómoda y en capas', 'Reservar con anticipación'],
  },
  {
    type: 'package', title: 'Perú Esencial 7 días', slug: 'peru-esencial-7-dias', subtitle: 'Una ruta por destinos clave del Perú para primera visita.', description: 'Combina Lima, Cusco y Machu Picchu en una experiencia completa.', durationText: '7 días / 6 noches', destinations: ['Lima', 'Cusco', 'Machu Picchu'], region: 'sierra', categories: ['Cultural', 'Premium'], priceFrom: 990, currency: 'USD', cardImage: '/images/products/peru-esencial-card.jpg', heroImage: '/images/products/peru-esencial-hero.jpg', featured: true,
  },
  {
    type: 'tour', title: 'Valle Sagrado Full Day', slug: 'valle-sagrado-full-day', subtitle: 'Paisajes, pueblos y sitios arqueológicos desde Cusco.', description: 'Tour de día completo para conocer el Valle Sagrado con organización y acompañamiento.', durationText: 'Full Day', destinations: ['Cusco', 'Valle Sagrado'], region: 'sierra', categories: ['Cultural', 'Full Day'], priceFrom: 45, currency: 'USD', serviceType: 'Privado o compartido', difficulty: 'Fácil a moderada', cardImage: '/images/products/valle-sagrado-card.jpg', heroImage: '/images/products/valle-sagrado-hero.jpg', featured: true,
  },
  {
    type: 'tour', title: 'Ica y Huacachina Full Day', slug: 'ica-huacachina-full-day', subtitle: 'Desierto, viñedos y aventura suave en la costa.', description: 'Una experiencia de un día para descubrir Ica y la magia de Huacachina.', durationText: 'Full Day', destinations: ['Ica', 'Huacachina'], region: 'costa', categories: ['Aventura', 'Full Day'], priceFrom: 55, currency: 'USD', cardImage: '/images/products/ica-huacachina-card.jpg', heroImage: '/images/products/ica-huacachina-hero.jpg', featured: true,
  },
];

export const packages = products.filter((p) => p.type === 'package');
export const tours = products.filter((p) => p.type === 'tour');
