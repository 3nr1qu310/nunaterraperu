// ─────────────────────────────────────────────────────────────────────────────
// WhatsApp helpers — genera URLs con mensaje predeterminado para cada página
// ─────────────────────────────────────────────────────────────────────────────

/** Construye una URL wa.me con texto URL-encoded */
export function buildWaUrl(phone: string, message: string): string {
  return `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;
}

// ── Tipos mínimos ────────────────────────────────────────────────────────────

interface ProductLike {
  title: string;
  durationText?: string;
  destinations?: string[];
  places?: string[];
  priceFrom?: number;
  currency?: string;
}

interface PlaceLike {
  name: string;
  destinationName?: string;
}

// ── Mensajes predeterminados ─────────────────────────────────────────────────

export function packageMessage(p: ProductLike): string {
  const lines: string[] = [
    `Hola 👋, me interesa el paquete *${p.title}*.`,
    '',
  ];
  if (p.destinations?.length)
    lines.push(`📍 Destinos: ${p.destinations.join(', ')}`);
  if (p.places?.length)
    lines.push(`🗺 Lugares: ${p.places.join(', ')}`);
  if (p.durationText)
    lines.push(`⏱ Duración: ${p.durationText}`);
  if (p.priceFrom)
    lines.push(`💰 Precio desde: ${p.currency ?? 'USD'} ${p.priceFrom.toLocaleString('es-PE')}`);
  lines.push('', '¿Podrían darme más información y disponibilidad? Gracias 🙏');
  return lines.join('\n');
}

export function tourMessage(p: ProductLike): string {
  const lines: string[] = [
    `Hola 👋, me interesa el tour *${p.title}*.`,
    '',
  ];
  if (p.destinations?.length)
    lines.push(`📍 Destinos: ${p.destinations.join(', ')}`);
  if (p.places?.length)
    lines.push(`🗺 Lugares: ${p.places.join(', ')}`);
  if (p.durationText)
    lines.push(`⏱ Duración: ${p.durationText}`);
  if (p.priceFrom)
    lines.push(`💰 Precio desde: ${p.currency ?? 'USD'} ${p.priceFrom.toLocaleString('es-PE')}`);
  lines.push('', '¿Podrían darme más información? Gracias 🙏');
  return lines.join('\n');
}

export function lugarMessage(place: PlaceLike): string {
  const dest = place.destinationName ? ` (${place.destinationName})` : '';
  return [
    `Hola 👋, me interesa visitar *${place.name}*${dest}.`,
    '',
    '¿Qué tours o paquetes tienen disponibles para este lugar?',
    '¡Gracias! 🙏',
  ].join('\n');
}
