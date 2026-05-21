const WIX_MEDIA_PREFIX = 'wix:';
const VIDEO_EXTENSIONS = ['.mp4', '.mov', '.webm', '.m4v'];

function normalizeMediaRef(value: string | null | undefined): string {
  return String(value ?? '').trim();
}

export function isWixMediaRef(value: string | null | undefined): boolean {
  return normalizeMediaRef(value).startsWith(WIX_MEDIA_PREFIX);
}

export function isExternalMediaUrl(value: string | null | undefined): boolean {
  const trimmed = normalizeMediaRef(value);
  return trimmed.startsWith('http://') || trimmed.startsWith('https://');
}

export function isLocalAssetPath(value: string | null | undefined): boolean {
  const trimmed = normalizeMediaRef(value);

  if (!trimmed) {
    return false;
  }

  if (trimmed.startsWith('/assets/')) {
    return true;
  }

  if (trimmed.startsWith('./') || trimmed.startsWith('../')) {
    return true;
  }

  return /^[^:/?#][^?#]*$/.test(trimmed);
}

export function isRenderableMediaRef(value: string | null | undefined): boolean {
  const trimmed = normalizeMediaRef(value);
  if (!trimmed || isWixMediaRef(trimmed)) {
    return false;
  }

  return isLocalAssetPath(trimmed) || isExternalMediaUrl(trimmed);
}

export function getRenderableMediaType(value: string | null | undefined): 'image' | 'video' {
  const cleanValue = normalizeMediaRef(value).split(/[?#]/)[0].toLowerCase();

  return VIDEO_EXTENSIONS.some((extension) => cleanValue.endsWith(extension)) ? 'video' : 'image';
}
