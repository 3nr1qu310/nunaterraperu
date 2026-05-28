import { supabase } from './supabase';

/**
 * Fetches a map of setting_key → setting_value from the site_settings table.
 * Safe to call at SSR time. Returns {} when Supabase isn't configured or on error.
 */
export async function getSiteSettings(
  keys: string[]
): Promise<Record<string, string>> {
  if (!supabase || keys.length === 0) return {};

  try {
    const { data, error } = await supabase
      .from('site_settings')
      .select('setting_key, setting_value')
      .in('setting_key', keys);

    if (error || !data) return {};

    return Object.fromEntries(
      data.map((row: { setting_key: string; setting_value: string | null }) => [
        row.setting_key,
        row.setting_value || '',
      ])
    );
  } catch {
    return {};
  }
}
