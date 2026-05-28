import type { APIRoute } from 'astro';
import { supabase } from '@/lib/supabase';

export const prerender = false;

// ─────────────────────────────────────────────────────────────────
// MIME email builder — no external dependencies
// ─────────────────────────────────────────────────────────────────

function mimeB64(str: string): string {
  // encode UTF-8 string to base64 for MIME header
  const bytes = new TextEncoder().encode(str);
  let binary = '';
  bytes.forEach((b) => (binary += String.fromCharCode(b)));
  return btoa(binary);
}

function mimeSubject(str: string): string {
  return `=?UTF-8?B?${mimeB64(str)}?=`;
}

function buildRaw(
  from: string,
  fromName: string,
  to: string,
  subject: string,
  html: string,
): string {
  return [
    `MIME-Version: 1.0`,
    `From: ${fromName} <${from}>`,
    `To: ${to}`,
    `Subject: ${mimeSubject(subject)}`,
    `Content-Type: text/html; charset=utf-8`,
    ``,
    html,
  ].join('\r\n');
}

function toStream(raw: string): ReadableStream {
  const bytes = new TextEncoder().encode(raw);
  return new ReadableStream({
    start(ctrl) {
      ctrl.enqueue(bytes);
      ctrl.close();
    },
  });
}

// ─────────────────────────────────────────────────────────────────
// Email templates
// ─────────────────────────────────────────────────────────────────

const FROM_ADDR = 'info@nunaterraperu.com';
const FROM_NAME = 'Nuna Terra Perú';
const NOTIFY_TO = 'info@nunaterraperu.com';

function notificationHtml(d: Record<string, unknown>): string {
  const row = (label: string, val: unknown) =>
    val
      ? `<tr>
           <td style="padding:8px 12px;font-weight:600;color:#5A3E2B;white-space:nowrap;border-bottom:1px solid #f0e9df">${label}</td>
           <td style="padding:8px 12px;border-bottom:1px solid #f0e9df">${val}</td>
         </tr>`
      : '';

  return `<!doctype html><html lang="es"><head><meta charset="UTF-8"></head>
<body style="margin:0;padding:0;background:#f7f1e7;font-family:'Helvetica Neue',Arial,sans-serif;color:#252525">
<div style="max-width:560px;margin:32px auto;background:#fff;border-radius:16px;overflow:hidden;box-shadow:0 8px 32px rgba(37,37,37,.1)">
  <div style="background:#5A3E2B;padding:28px 32px">
    <p style="margin:0;color:rgba(247,241,231,.7);font-size:.78rem;letter-spacing:.12em;text-transform:uppercase">Nueva solicitud de viaje</p>
    <h1 style="margin:6px 0 0;color:#F7F1E7;font-size:1.5rem;font-weight:700">Consulta recibida</h1>
  </div>
  <div style="padding:24px 32px">
    <table style="width:100%;border-collapse:collapse;font-size:.92rem">
      ${row('Nombre',   d.full_name)}
      ${row('Email',    d.email)}
      ${row('WhatsApp', d.phone)}
      ${row('Destino',  d.destinations_interest)}
      ${row('Fecha',    d.travel_date)}
      ${row('Viajeros', d.number_of_people)}
      ${row('Mensaje',  d.message)}
    </table>
  </div>
  <div style="padding:16px 32px 24px;background:#faf8f4;border-top:1px solid #f0e9df">
    <p style="margin:0;font-size:.78rem;color:rgba(37,37,37,.45)">Formulario de contacto · nunaterraperu.com</p>
  </div>
</div>
</body></html>`;
}

function autoReplyHtml(name: string): string {
  return `<!doctype html><html lang="es"><head><meta charset="UTF-8"></head>
<body style="margin:0;padding:0;background:#f7f1e7;font-family:'Helvetica Neue',Arial,sans-serif;color:#252525">
<div style="max-width:560px;margin:32px auto;background:#fff;border-radius:16px;overflow:hidden;box-shadow:0 8px 32px rgba(37,37,37,.1)">
  <div style="background:#5A3E2B;padding:28px 32px">
    <p style="margin:0;color:rgba(247,241,231,.7);font-size:.78rem;letter-spacing:.12em;text-transform:uppercase">Nuna Terra Perú</p>
    <h1 style="margin:6px 0 0;color:#F7F1E7;font-size:1.5rem;font-weight:700">Recibimos tu solicitud ✓</h1>
  </div>
  <div style="padding:32px">
    <p style="margin:0 0 14px;font-size:1rem;line-height:1.7">Hola <strong>${name}</strong>,</p>
    <p style="margin:0 0 14px;font-size:.95rem;line-height:1.7;color:rgba(37,37,37,.8)">
      Gracias por escribirnos. Hemos recibido tu solicitud de viaje y uno de nuestros especialistas
      la revisará a la brevedad.
    </p>
    <p style="margin:0 0 28px;font-size:.95rem;line-height:1.7;color:rgba(37,37,37,.8)">
      Nos comunicaremos contigo en <strong>menos de 24 horas</strong> con una propuesta personalizada.
    </p>
    <div style="background:#f7f1e7;border-radius:12px;padding:18px 22px;margin-bottom:28px">
      <p style="margin:0 0 6px;font-size:.78rem;font-weight:700;letter-spacing:.1em;text-transform:uppercase;color:#5A3E2B">¿Necesitas respuesta urgente?</p>
      <p style="margin:0;font-size:.9rem;color:rgba(37,37,37,.75)">
        Escríbenos por WhatsApp:
        <a href="https://wa.me/51963797348" style="color:#2F5D50;font-weight:600;text-decoration:none">+51 963 797 348</a>
      </p>
    </div>
    <p style="margin:0;font-size:.85rem;color:rgba(37,37,37,.5)">— El equipo de Nuna Terra Perú</p>
  </div>
  <div style="padding:14px 32px;background:#faf8f4;border-top:1px solid #f0e9df;text-align:center">
    <p style="margin:0;font-size:.72rem;color:rgba(37,37,37,.38)">
      Cusco, Perú · <a href="https://nunaterraperu.com" style="color:#2F5D50;text-decoration:none">nunaterraperu.com</a>
    </p>
  </div>
</div>
</body></html>`;
}

// ─────────────────────────────────────────────────────────────────
// POST /api/leads
// ─────────────────────────────────────────────────────────────────

export const POST: APIRoute = async ({ request, locals }) => {
  try {
    const body = await request.json();

    if (!body.full_name || !body.phone) {
      return new Response(
        JSON.stringify({ ok: false, message: 'Nombre y WhatsApp son obligatorios.' }),
        { status: 400 },
      );
    }

    // ── 1. Save lead to Supabase ──────────────────────────────────
    const payload = {
      full_name:             body.full_name,
      email:                 body.email || null,
      phone:                 body.phone,
      country:               body.country || null,
      interest_type:         body.interest_type || 'general_question',
      destinations_interest: body.destinations_interest ? [body.destinations_interest] : [],
      travel_date:           body.travel_date || null,
      number_of_people:      body.number_of_people ? Number(body.number_of_people) : null,
      duration_range:        body.duration_range || null,
      travel_style:          body.travel_style || null,
      message:               body.message || null,
      source:                body.source || 'contact_page',
      status:                'new',
    };

    if (supabase) {
      const { error } = await supabase.from('leads').insert(payload);
      if (error) console.error('[leads] Supabase:', error.message);
    }

    // ── 2. Send emails via Cloudflare Email Workers ──────────────
    // Binding name "SEND_EMAIL" configured in Cloudflare Pages dashboard
    // Cloudflare Dashboard → Pages → Settings → Functions → Email bindings
    const cfEnv = ((locals as unknown) as {
      runtime?: { env?: Record<string, unknown> };
    })?.runtime?.env ?? {};

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const sendEmailBinding = cfEnv.SEND_EMAIL as { send: (msg: any) => Promise<void> } | undefined;

    if (sendEmailBinding) {
      try {
        // Dynamic import keeps cloudflare:email external in the bundle
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const { EmailMessage } = (await import('cloudflare:email')) as { EmailMessage: any };

        const emailTasks: Promise<void>[] = [];

        // Notification to the team
        emailTasks.push(
          sendEmailBinding.send(
            new EmailMessage(
              FROM_ADDR,
              NOTIFY_TO,
              toStream(buildRaw(FROM_ADDR, FROM_NAME, NOTIFY_TO, `Nueva solicitud — ${body.full_name}`, notificationHtml(body))),
            ),
          ),
        );

        // Auto-reply to the client
        if (body.email) {
          emailTasks.push(
            sendEmailBinding.send(
              new EmailMessage(
                FROM_ADDR,
                body.email,
                toStream(buildRaw(FROM_ADDR, FROM_NAME, body.email, 'Recibimos tu solicitud — Nuna Terra Perú', autoReplyHtml(body.full_name))),
              ),
            ),
          );
        }

        await Promise.allSettled(emailTasks);
      } catch (emailErr) {
        // Email failure should never block the lead from being saved
        console.error('[leads] Email error:', emailErr);
      }
    } else {
      console.warn('[leads] SEND_EMAIL binding not configured — emails skipped.');
    }

    return new Response(
      JSON.stringify({ ok: true, message: 'Consulta enviada correctamente.' }),
      { status: 200 },
    );
  } catch (err) {
    console.error('[leads] Unexpected error:', err);
    return new Response(
      JSON.stringify({ ok: false, message: 'No se pudo enviar la consulta.' }),
      { status: 500 },
    );
  }
};
