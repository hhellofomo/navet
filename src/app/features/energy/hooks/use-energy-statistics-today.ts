import { useEffect, useRef, useState } from 'react';
import { ENERGY_STATISTICS_REFRESH_INTERVAL } from '@/app/constants';
import { useHomeAssistant } from '@/app/hooks';
import { homeAssistantService } from '@/app/services/home-assistant.service';
import { homeAssistantSelectors } from '@/app/stores/selectors';
import { getEnergyStatisticsToday } from '../services/energy-statistics-service';

const REFRESH_MS = ENERGY_STATISTICS_REFRESH_INTERVAL;

/**
 * Polls HA statistics for today's kWh delta for all configured energy entities.
 * Returns a map of entityId → kWh used today (0 when unavailable).
 * Refreshes every 5 minutes.
 */
interface EnergyStatisticsTodayState {
  hasLoaded: boolean;
  values: Record<string, number>;
}

export function useEnergyStatisticsToday(entityIds: string[]): EnergyStatisticsTodayState {
  const [todayKWh, setTodayKWh] = useState<Record<string, number>>({});
  const [hasLoaded, setHasLoaded] = useState(false);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const connection = useHomeAssistant(homeAssistantSelectors.connection);

  useEffect(() => {
    if (entityIds.length === 0) {
      setTodayKWh({});
      setHasLoaded(false);
      return;
    }
    setHasLoaded(false);

    async function fetchStats() {
      const activeConnection = connection ?? homeAssistantService.getConnection();
      if (!activeConnection) return;
      try {
        const result = await getEnergyStatisticsToday(activeConnection, entityIds);
        setTodayKWh(result);
        setHasLoaded(true);
      } catch (error) {
        console.error('[EnergyStatisticsToday] Failed to fetch today stats:', error);
        setHasLoaded(true);
        // Dashboard remains useful without today stats
      }
    }

    void fetchStats();
    timerRef.current = setInterval(() => void fetchStats(), REFRESH_MS);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [connection, entityIds]);

  return { hasLoaded, values: todayKWh };
}
