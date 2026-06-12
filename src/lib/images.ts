/**
 * Optimización de imágenes servidas desde Supabase Storage.
 *
 * Convierte URLs públicas de objetos a la ruta de transformación
 * (`render/image`) para servir versiones redimensionadas y comprimidas.
 * Una imagen original de ~260KB baja a ~60KB con width=800.
 *
 * URLs externas o locales (/images/...) se devuelven sin cambios.
 */

const OBJECT_PATH = '/storage/v1/object/public/';
const RENDER_PATH = '/storage/v1/render/image/public/';

/** Anchos estándar según el contexto de uso. */
export const IMAGE_SIZES = {
  /** Miniaturas pequeñas (menús, avatares): 320px */
  thumb: 320,
  /** Tarjetas de producto/destino: 800px (cubre retina) */
  card: 800,
  /** Imágenes de galería / colage: 1200px */
  gallery: 1200,
  /** Fondos hero a pantalla completa: 1600px */
  hero: 1600,
} as const;

export function optimizeImage(
  url: string | null | undefined,
  width: number = IMAGE_SIZES.card,
  quality = 75
): string {
  if (!url || typeof url !== 'string') return url || '';
  if (!url.includes(OBJECT_PATH)) return url;

  const base = url.replace(OBJECT_PATH, RENDER_PATH);
  const sep = base.includes('?') ? '&' : '?';

  return `${base}${sep}width=${width}&quality=${quality}&resize=cover`;
}
