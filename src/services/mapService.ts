// ---------------------------------------------------------------------------
// Map service — resolves where an alert should be pinned. Prefers the
// browser's real geolocation; falls back to a fixed demo coordinate only
// when permission is denied or unavailable (this affects the map pin only,
// never the AI's threat classification).
// ---------------------------------------------------------------------------

import { getCurrentPosition, type Coords } from '@/services/geoService';
import { fallbackCoords } from '@/utils/helpers';

export async function resolveAlertLocation(): Promise<Coords> {
  try {
    return await getCurrentPosition();
  } catch {
    return fallbackCoords();
  }
}
