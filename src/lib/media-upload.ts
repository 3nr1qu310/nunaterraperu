import { supabaseAdminClient } from './admin-client';

export const MEDIA_BUCKET = 'nuna-terra';
export const MEDIA_FOLDER = 'media';

// Límites de tamaño de archivo
export const MAX_IMAGE_SIZE = 10 * 1024 * 1024; // 10 MB
export const MAX_VIDEO_SIZE = 500 * 1024 * 1024; // 500 MB

// Tipos de archivo permitidos
export const ALLOWED_IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
export const ALLOWED_VIDEO_TYPES = ['video/mp4', 'video/webm', 'video/quicktime'];

export type MediaItem = {
  id: string;
  file_name: string;
  file_path: string;
  public_url: string;
  alt_text: string | null;
  title: string | null;
  caption: string | null;
  mime_type: string | null;
  size_bytes: number | null;
  is_active: boolean;
  created_at: string;
};

function sanitizeFileName(fileName: string) {
  return fileName
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/\s+/g, '-')
    .replace(/[^a-z0-9._-]/g, '')
    .replace(/-+/g, '-')
    .slice(0, 120);
}

export async function listMedia(search = ''): Promise<MediaItem[]> {
  let query = supabaseAdminClient
    .from('media')
    .select('*')
    .eq('is_active', true)
    .order('created_at', { ascending: false });

  if (search.trim()) {
    query = query.or(
      `file_name.ilike.%${search.trim()}%,title.ilike.%${search.trim()}%,alt_text.ilike.%${search.trim()}%`
    );
  }

  const { data, error } = await query;

  if (error) throw error;
  return data ?? [];
}

export async function uploadMedia(file: File): Promise<MediaItem> {
  if (!file) throw new Error('Selecciona una imagen o video.');
  
  const isImage = file.type.startsWith('image/');
  const isVideo = file.type.startsWith('video/');
  
  if (!isImage && !isVideo) {
    throw new Error('Solo se permiten imágenes (JPG, PNG, WebP, GIF) o videos (MP4, WebM).');
  }
  
  // Validar tamaño máximo
  const maxSize = isVideo ? MAX_VIDEO_SIZE : MAX_IMAGE_SIZE;
  if (file.size > maxSize) {
    const maxMB = maxSize / (1024 * 1024);
    throw new Error(`El archivo es muy grande. Máximo ${maxMB}MB.`);
  }

  const safeName = sanitizeFileName(file.name);
  const filePath = `${MEDIA_FOLDER}/${Date.now()}-${safeName}`;

  const { error: uploadError } = await supabaseAdminClient.storage
    .from(MEDIA_BUCKET)
    .upload(filePath, file, {
      cacheControl: '3600',
      upsert: false,
      contentType: file.type,
    });

  if (uploadError) throw uploadError;

  const { data: publicData } = supabaseAdminClient.storage
    .from(MEDIA_BUCKET)
    .getPublicUrl(filePath);

  const publicUrl = publicData.publicUrl;

  const { data, error: insertError } = await supabaseAdminClient
    .from('media')
    .insert({
      file_name: file.name,
      file_path: filePath,
      public_url: publicUrl,
      title: file.name.replace(/\.[^/.]+$/, ''),
      alt_text: '',
      caption: '',
      mime_type: file.type,
      size_bytes: file.size,
    })
    .select('*')
    .single();

  if (insertError) throw insertError;
  return data;
}

export async function updateMediaMeta(id: string, values: Partial<Pick<MediaItem, 'title' | 'alt_text' | 'caption'>>) {
  const { error } = await supabaseAdminClient
    .from('media')
    .update(values)
    .eq('id', id);

  if (error) throw error;
}

export async function deactivateMedia(id: string) {
  const { error } = await supabaseAdminClient
    .from('media')
    .update({ is_active: false })
    .eq('id', id);

  if (error) throw error;
}
