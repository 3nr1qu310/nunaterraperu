export async function onRequestPost(context) {
  const { env, request } = context;

  const hookUrl = env.DEPLOY_HOOK_URL;
  const supabaseUrl = env.PUBLIC_SUPABASE_URL;
  const supabaseKey = env.PUBLIC_SUPABASE_ANON_KEY;

  if (!hookUrl) {
    return json({ error: 'DEPLOY_HOOK_URL no está configurado en Cloudflare Pages.' }, 500);
  }

  const auth = request.headers.get('Authorization');
  if (!auth?.startsWith('Bearer ')) {
    return json({ error: 'No autorizado.' }, 401);
  }

  if (supabaseUrl && supabaseKey) {
    const token = auth.slice(7);
    const userRes = await fetch(`${supabaseUrl}/auth/v1/user`, {
      headers: {
        Authorization: `Bearer ${token}`,
        apikey: supabaseKey,
      },
    });
    if (!userRes.ok) {
      return json({ error: 'Sesión inválida. Inicia sesión nuevamente.' }, 401);
    }
  }

  const buildRes = await fetch(hookUrl, { method: 'POST', body: '' });
  if (!buildRes.ok) {
    return json({ error: `Error al contactar Cloudflare (${buildRes.status}).` }, 502);
  }

  const data = await buildRes.json().catch(() => ({}));
  return json({ ok: true, id: data?.result?.id ?? null });
}

export async function onRequestGet() {
  return json({ error: 'Método no permitido.' }, 405);
}

function json(body, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { 'Content-Type': 'application/json' },
  });
}
