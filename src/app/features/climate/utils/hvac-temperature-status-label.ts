import type { TranslateFn } from '@/app/hooks';

export function getHvacTemperatureStatusLabel(
  t: TranslateFn,
  targetTemp: number,
  currentTemp: number,
  visualMode?: string
) {
  if (visualMode === 'cool') {
    return t('climate.coolingDownTo', { temp: targetTemp });
  }

  if (visualMode === 'heat') {
    return t('climate.heatingTo', { temp: targetTemp });
  }

  return targetTemp < currentTemp
    ? t('climate.coolingDownTo', { temp: targetTemp })
    : t('climate.heatingTo', { temp: targetTemp });
}
