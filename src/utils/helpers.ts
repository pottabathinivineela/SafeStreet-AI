import { DEFAULT_MAP_CENTER } from './constants';

/** Generates a short unique id without pulling in a uuid dependency. */
export function generateId(prefix = 'evt'): string {
  return `${prefix}_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 8)}`;
}

export function formatTime(iso: string): string {
  return new Date(iso).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
}

export function formatDateTime(iso: string): string {
  return new Date(iso).toLocaleString([], {
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

/**
 * Fallback coordinates used only when the browser's real geolocation is
 * denied or unavailable, so the map still has something sensible to show.
 * This never affects what the AI detects — it only affects where an
 * already-real detection is pinned on the map.
 */
export function fallbackCoords(): { latitude: number; longitude: number } {
  const [lat, lng] = DEFAULT_MAP_CENTER;
  return { latitude: lat, longitude: lng };
}
