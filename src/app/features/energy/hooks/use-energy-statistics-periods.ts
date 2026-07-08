import { useEffect, useRef, useState } from 'react';
import { homeAssistantService } from '@/app/services/home-assistant.service';
import { getEnergyStatisticsPeriods } from '../services/energy-statistics-service';

const REFRESH_MS = 5 * 60 * 1000;

interface EnergyPeriodTotals {
  today: number;
  week: number;
  month: number;
}

export function useEnergyStatisticsPeriods(entityId?: string): EnergyPeriodTotals {
  const [totals, setTotals] = useState<EnergyPeriodTotals>({ today: 0, week: 0, month: 0 });
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    if (!entityId) {
      setTotals({ today: 0, week: 0, month: 0 });
      return;
    }
    const statisticId = entityId;

    async function fetchStats() {
      const connection = homeAssistantService.getConnection();
      if (!connection) return;
      try {
        const result = await getEnergyStatisticsPeriods(connection, statisticId);
        setTotals(result);
      } catch {
        // keep previous values if statistics are unavailable
      }
    }

    void fetchStats();
    timerRef.current = setInterval(() => void fetchStats(), REFRESH_MS);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [entityId]);

  return totals;
}
