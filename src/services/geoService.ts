import { DEFAULT_MAP_CENTER } from '@/utils/constants';

export interface Coords {
  latitude: number;
  longitude: number;
}

/**
 * Resolves the browser's current position, falling back to the default
 * demo coordinates if permission is denied or geolocation is unavailable.
 */
export function getCurrentPosition(): Promise<Coords> {
  return new Promise((resolve) => {
    if (!('geolocation' in navigator)) {
      resolve({ latitude: DEFAULT_MAP_CENTER[0], longitude: DEFAULT_MAP_CENTER[1] });
      return;
    }
    navigator.geolocation.getCurrentPosition(
      (pos) => resolve({ latitude: pos.coords.latitude, longitude: pos.coords.longitude }),
      () => resolve({ latitude: DEFAULT_MAP_CENTER[0], longitude: DEFAULT_MAP_CENTER[1] }),
      { timeout: 5000 },
    );
  });
}
