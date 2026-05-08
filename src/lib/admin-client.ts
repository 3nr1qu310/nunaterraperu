import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.PUBLIC_SUPABASE_URL || import.meta.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = import.meta.env.PUBLIC_SUPABASE_ANON_KEY || import.meta.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.warn('Supabase no está configurado. Revisa PUBLIC_SUPABASE_URL y PUBLIC_SUPABASE_ANON_KEY en .env');
}

export const adminSupabase = createClient(supabaseUrl || '', supabaseKey || '', {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true,
  },
});

export const supabaseAdminClient = createClient(supabaseUrl, supabaseKey);

export async function requireAdmin() {
  if (!supabaseUrl || !supabaseKey) {
    document.body.classList.add('admin-ready');
    return null;
  }

  const { data } = await adminSupabase.auth.getSession();
  if (!data.session) {
    const next = encodeURIComponent(window.location.pathname + window.location.search);
    window.location.href = `/admin/login?next=${next}`;
    return null;
  }

  document.body.classList.add('admin-ready');
  const emailEl = document.querySelector('[data-admin-email]');
  if (emailEl) emailEl.textContent = data.session.user.email || 'Administrador';
  return data.session;
}

export async function logoutAdmin() {
  await adminSupabase.auth.signOut();
  window.location.href = '/admin/login';
}

export function slugify(value: string) {
  return value
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)+/g, '');
}

export function lines(value: string) {
  return value
    .split('\n')
    .map((item) => item.trim())
    .filter(Boolean);
}

export function csv(value: string) {
  return value
    .split(',')
    .map((item) => item.trim())
    .filter(Boolean);
}

export function toNumber(value: FormDataEntryValue | null) {
  if (value === null || value === '') return null;
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : null;
}

export function notify(message: string, type: 'success' | 'error' | 'info' = 'info') {
  const el = document.querySelector('[data-admin-message]');
  if (!el) return alert(message);
  el.textContent = message;
  el.setAttribute('data-type', type);
  window.setTimeout(() => {
    if (el.textContent === message) el.textContent = '';
  }, 6000);
}
