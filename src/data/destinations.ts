import type { Destination } from '@/types/content';

export const destinations: Destination[] = [
  {
    name: 'Cusco', slug: 'cusco', region: 'sierra',
    subtitle: 'Historia viva, cultura andina y paisajes sagrados.',
    description: 'Antigua capital del Imperio Inca, punto de partida hacia Machu Picchu, Valle Sagrado y rutas andinas.',
    heroImage: '/images/destinations/cusco-hero.jpg', cardImage: '/images/destinations/cusco-card.jpg',
    altitude: '3,399 m s. n. m.', bestTime: 'Abril a octubre', recommendedDays: '4 a 6 días', idealFor: ['Cultura', 'Historia', 'Aventura'],
  },
  { name: 'Machu Picchu', slug: 'machu-picchu', region: 'sierra', subtitle: 'Una experiencia icónica en el corazón andino.', description: 'Maravilla del mundo y símbolo de la cultura inca.', heroImage: '/images/destinations/machu-picchu-hero.jpg', cardImage: '/images/destinations/machu-picchu-card.jpg', bestTime: 'Abril a octubre', recommendedDays: '1 a 2 días', idealFor: ['Cultura', 'Fotografía'] },
  { name: 'Lima', slug: 'lima', region: 'costa', subtitle: 'Gastronomía, historia y vida cultural frente al Pacífico.', description: 'Capital del Perú, ideal para iniciar rutas por la costa y conectar con otros destinos.', heroImage: '/images/destinations/lima-hero.jpg', cardImage: '/images/destinations/lima-card.jpg', bestTime: 'Todo el año', recommendedDays: '1 a 3 días', idealFor: ['Gastronomía', 'Cultura'] },
  { name: 'Ica', slug: 'ica', region: 'costa', subtitle: 'Desierto, viñedos y aventura en Huacachina.', description: 'Un destino costero que combina dunas, bodegas y experiencias visuales únicas.', heroImage: '/images/destinations/ica-hero.jpg', cardImage: '/images/destinations/ica-card.jpg', bestTime: 'Todo el año', recommendedDays: '1 a 2 días', idealFor: ['Aventura', 'Naturaleza'] },
  { name: 'Puno', slug: 'puno', region: 'sierra', subtitle: 'Lago Titicaca y cultura altiplánica.', description: 'Destino de tradición viva, islas y paisajes del altiplano peruano.', heroImage: '/images/destinations/puno-hero.jpg', cardImage: '/images/destinations/puno-card.jpg', bestTime: 'Abril a noviembre', recommendedDays: '2 a 3 días', idealFor: ['Cultura', 'Familia'] },
  { name: 'Puerto Maldonado', slug: 'puerto-maldonado', region: 'selva', subtitle: 'Amazonía, lodges y biodiversidad.', description: 'Puerta de entrada a experiencias amazónicas de naturaleza y conexión profunda.', heroImage: '/images/destinations/puerto-maldonado-hero.jpg', cardImage: '/images/destinations/puerto-maldonado-card.jpg', bestTime: 'Mayo a octubre', recommendedDays: '3 a 4 días', idealFor: ['Naturaleza', 'Aventura'] },
];
