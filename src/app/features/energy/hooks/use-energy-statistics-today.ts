import { useEffect, useRef, useState } from 'react';
import { homeAssistantService } from '@/app/services/home-assistant.service';
import { getEnergyStatisticsToday } from '../services/energy-statistics-service';
import type { EnergySourceConfig } from '../types/energy.types';

const REFRESH_MS = 5 * 60 * 1000;

/**
 * Polls HA statistics for today's kWh delta for all configured energy entities.
 * Returns a map of entityId → kWh used today (0 when unavailable).
 * Refreshes every 5 minutes.
 */
export function useEnergyStatisticsToday(
  sourceConfig: EnergySourceConfig | null
): Record<string, number> {
  const [todayKWh, setTodayKWh] = useState<Record<string, number>>({});
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    if (!sourceConfig) {
      setTodayKWh({});
      return;
    }

    const entityIds = [
      sourceConfig.gridImportEnergyEntityId,
      sourceConfig.solarEnergyEntityId,
      ...sourceConfig.devices.map((d) => d.entityId),
    ].filter((id): id is string => Boolean(id));

    if (entityIds.length === 0) return;

    async function fetchStats() {
      const connection = homeAssistantService.getConnection();
      if (!connection) return;
      try {
        const result = await getEnergyStatisticsToday(connection, entityIds);
        setTodayKWh(result);
      } catch {
        // silently fail — dashboard remains useful without today stats
      }
    }

    void fetchStats();
    timerRef.current = setInterval(() => void fetchStats(), REFRESH_MS);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [sourceConfig]);

  return todayKWh;
}
