import { useCallback, useEffect, useState } from 'react';
import { STORAGE_KEYS } from '@/app/constants/storage-keys';
import { storage } from '@/app/utils/storage';
import type { ZoneName } from '../zones/zone-types';

/**
 * Reads and writes per-card zone overrides from localStorage.
 * Follows the same pattern as useCardOrdering.
 *
 * Zone overrides are stored separately from card records so that
 * auto-discovered HA entity cards (which live only in the HA store)
 * can also have explicit zone assignments.
 */
export function useCardZones() {
  const [cardZones, setCardZones] = useState<Record<string, ZoneName>>(() =>
    storage.get<Record<string, ZoneName>>(STORAGE_KEYS.cardZones, {})
  );

  const updateCardZone = useCallback((id: string, zone: ZoneName) => {
    setCardZones((prev) => ({ ...prev, [id]: zone }));
  }, []);

  useEffect(() => {
    storage.set(STORAGE_KEYS.cardZones, cardZones);
  }, [cardZones]);

  return { cardZones, updateCardZone };
}
