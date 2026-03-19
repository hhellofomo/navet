import { useMemo, useState } from 'react';
import { useInterval } from '@/app/hooks';
import type { EnergySeriesPoint } from '../types/energy.types';

interface LoadSample {
  timestamp: number;
  value: number;
}

const SAMPLE_INTERVAL_MS = 15_000;
const BUCKET_MS = 5 * 60_000;
const BUCKET_COUNT = 12;
const MAX_SAMPLE_AGE_MS = BUCKET_MS * BUCKET_COUNT;

export function useEnergyLoadHistory(currentLoadW: number): EnergySeriesPoint[] {
  const [samples, setSamples] = useState<LoadSample[]>([]);

  useInterval(() => {
    const now = Date.now();
    setSamples((prev) => {
      const next = [...prev, { timestamp: now, value: currentLoadW }];
      return next.filter((sample) => now - sample.timestamp <= MAX_SAMPLE_AGE_MS);
    });
  }, SAMPLE_INTERVAL_MS);

  return useMemo(() => {
    const now = Date.now();

    return Array.from({ length: BUCKET_COUNT }, (_, index) => {
      const bucketEnd = now - (BUCKET_COUNT - 1 - index) * BUCKET_MS;
      const bucketStart = bucketEnd - BUCKET_MS;
      const bucketSamples = samples.filter(
        (sample) => sample.timestamp > bucketStart && sample.timestamp <= bucketEnd
      );

      const averageW =
        bucketSamples.length > 0
          ? bucketSamples.reduce((sum, sample) => sum + sample.value, 0) / bucketSamples.length
          : currentLoadW;

      return {
        label: index === BUCKET_COUNT - 1 ? 'Now' : `-${(BUCKET_COUNT - 1 - index) * 5}m`,
        value: +(averageW / 1000).toFixed(2),
      };
    });
  }, [currentLoadW, samples]);
}
