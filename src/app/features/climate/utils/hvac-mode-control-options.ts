export interface HVACModeControlOption {
  key: 'cool' | 'heat' | 'fan';
  mode: string;
}

const DEFAULT_HVAC_MODE_CONTROLS: HVACModeControlOption[] = [
  { key: 'cool', mode: 'cool' },
  { key: 'heat', mode: 'heat' },
  { key: 'fan', mode: 'fan' },
];

export function resolveHvacModeControlOptions(
  supportedHvacModes?: string[]
): HVACModeControlOption[] {
  if (!supportedHvacModes) {
    return DEFAULT_HVAC_MODE_CONTROLS;
  }

  const supportedModes = new Set(supportedHvacModes.map((mode) => mode.toLowerCase()));
  const options: HVACModeControlOption[] = [];

  if (supportedModes.has('cool')) {
    options.push({ key: 'cool', mode: 'cool' });
  }

  if (supportedModes.has('heat')) {
    options.push({ key: 'heat', mode: 'heat' });
  }

  if (supportedModes.has('fan_only') || supportedModes.has('fan')) {
    options.push({
      key: 'fan',
      mode: supportedModes.has('fan_only') ? 'fan_only' : 'fan',
    });
  }

  return options;
}
