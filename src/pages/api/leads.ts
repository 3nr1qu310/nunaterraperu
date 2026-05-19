import type { APIRoute } from 'astro';
import { supabase } from '@/lib/supabase';

export const prerender = true;

export const POST: APIRoute = async ({ request }) => {
  try {
    const body = await request.json();

    if (!body.full_name || !body.phone) {
      return new Response(JSON.stringify({ ok: false, message: 'Nombre y WhatsApp son obligatorios.' }), { status: 400 });
    }

    const payload = {
      full_name: body.full_name,
      email: body.email || null,
      phone: body.phone,
      country: body.country || null,
      interest_type: body.interest_type || 'general_question',
      destinations_interest: body.destinations_interest ? [body.destinations_interest] : [],
      travel_date: body.travel_date || null,
      number_of_people: body.number_of_people ? Number(body.number_of_people) : null,
      duration_range: body.duration_range || null,
      travel_style: body.travel_style || null,
      message: body.message || null,
      source: body.source || 'contact_page',
      status: 'new',
    };

    if (!supabase) {
      return new Response(JSON.stringify({ ok: true, dev: true, message: 'Lead recibido en modo local. Configura Supabase para guardarlo.' }), { status: 200 });
    }

    const { error } = await supabase.from('leads').insert(payload);
    if (error) throw error;

    return new Response(JSON.stringify({ ok: true, message: 'Consulta enviada correctamente.' }), { status: 200 });
  } catch (error) {
    return new Response(JSON.stringify({ ok: false, message: 'No se pudo enviar la consulta.', error: String(error) }), { status: 500 });
  }
};
