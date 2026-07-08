import type { HassEntity } from 'home-assistant-js-websocket';

export function getBrightnessPercent(entity: HassEntity): number {
  const brightnessPct = parseNumberish(entity.attributes?.brightness_pct);
  if (brightnessPct !== null) {
    return clampPercentage(brightnessPct);
  }

  const brightness = parseNumberish(entity.attributes?.brightness);
  if (brightness !== null) {
    if (brightness >= 0 && brightness <= 1) {
      return clampPercentage(brightness * 100);
    }
    return clampPercentage((Math.max(0, Math.min(255, brightness)) / 255) * 100);
  }

  return entity.state === 'on' ? 100 : 0;
}

export function clampPercentage(value: number, min = 0): number {
  return Math.max(min, Math.min(100, Math.round(value)));
}

export function clampKelvin(value: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, roundKelvin(value)));
}

export function getReportedColorTempKelvin(entity: HassEntity): number | null {
  const kelvin = parseNumberish(entity.attributes?.color_temp_kelvin);
  if (kelvin !== null) {
    return roundKelvin(kelvin);
  }

  const mired = parseNumberish(entity.attributes?.color_temp);
  if (mired !== null && mired > 0) {
    return roundKelvin(1000000 / mired);
  }

  return null;
}

export function getReportedColorHex(entity: HassEntity): string | null {
  const activeColorMode = entity.attributes?.color_mode;
  if (
    typeof activeColorMode === 'string' &&
    !['hs', 'rgb', 'rgbw', 'rgbww', 'xy'].includes(activeColorMode)
  ) {
    return null;
  }

  const rgbColor = entity.attributes?.rgb_color;
  if (
    Array.isArray(rgbColor) &&
    rgbColor.length >= 3 &&
    rgbColor.every((value) => typeof value === 'number' && Number.isFinite(value))
  ) {
    return rgbToHex(rgbColor[0], rgbColor[1], rgbColor[2]);
  }

  const hsColor = entity.attributes?.hs_color;
  if (
    Array.isArray(hsColor) &&
    hsColor.length >= 2 &&
    hsColor.every((value) => typeof value === 'number' && Number.isFinite(value)) &&
    hsColor[1] > 0
  ) {
    return hsToHex(hsColor[0], hsColor[1]);
  }

  return null;
}

export function roundKelvin(value: number): number {
  return Math.round(value / 100) * 100;
}

export function supportsColorTemperatureControl(entity?: HassEntity): boolean {
  if (!entity) {
    return true;
  }

  const colorModes = getSupportedColorModes(entity);
  return (
    colorModes.has('color_temp') ||
    typeof entity.attributes?.color_temp_kelvin === 'number' ||
    typeof entity.attributes?.color_temp === 'number'
  );
}

export function supportsColorSelection(entity?: HassEntity): boolean {
  if (!entity) {
    return true;
  }

  const colorModes = getSupportedColorModes(entity);
  return ['hs', 'rgb', 'rgbw', 'rgbww', 'xy'].some((mode) => colorModes.has(mode));
}

export function getSupportedColorTemperatureRange(entity?: HassEntity): {
  min: number;
  max: number;
} {
  if (!entity) {
    return { min: 2700, max: 6500 };
  }

  const minKelvin = parseNumberish(entity.attributes?.min_color_temp_kelvin);
  const maxKelvin = parseNumberish(entity.attributes?.max_color_temp_kelvin);
  if (minKelvin !== null && maxKelvin !== null && minKelvin < maxKelvin) {
    const normalizedMin = Math.ceil(minKelvin / 100) * 100;
    const normalizedMax = Math.floor(maxKelvin / 100) * 100;
    return {
      min: normalizedMin < normalizedMax ? normalizedMin : roundKelvin(minKelvin),
      max: normalizedMin < normalizedMax ? normalizedMax : roundKelvin(maxKelvin),
    };
  }

  const minMired = parseNumberish(entity.attributes?.min_mireds);
  const maxMired = parseNumberish(entity.attributes?.max_mireds);
  if (minMired !== null && maxMired !== null && minMired > 0 && maxMired > 0) {
    const derivedMaxKelvin = Math.round(1000000 / minMired);
    const derivedMinKelvin = Math.round(1000000 / maxMired);
    if (derivedMinKelvin < derivedMaxKelvin) {
      const normalizedMin = Math.ceil(derivedMinKelvin / 100) * 100;
      const normalizedMax = Math.floor(derivedMaxKelvin / 100) * 100;
      return {
        min: normalizedMin < normalizedMax ? normalizedMin : roundKelvin(derivedMinKelvin),
        max: normalizedMin < normalizedMax ? normalizedMax : roundKelvin(derivedMaxKelvin),
      };
    }
  }

  return { min: 2700, max: 6500 };
}

function parseNumberish(value: unknown): number | null {
  if (typeof value === 'number' && !Number.isNaN(value)) {
    return value;
  }

  if (typeof value === 'string') {
    const parsed = Number.parseFloat(value);
    if (!Number.isNaN(parsed)) {
      return parsed;
    }
  }

  return null;
}

function hsToHex(hue: number, saturation: number): string {
  const normalizedHue = ((hue % 360) + 360) % 360;
  const normalizedSaturation = Math.max(0, Math.min(100, saturation)) / 100;
  const chroma = normalizedSaturation;
  const segment = normalizedHue / 60;
  const second = chroma * (1 - Math.abs((segment % 2) - 1));
  const match = 1 - chroma;

  let red = 0;
  let green = 0;
  let blue = 0;

  if (segment >= 0 && segment < 1) {
    red = chroma;
    green = second;
  } else if (segment < 2) {
    red = second;
    green = chroma;
  } else if (segment < 3) {
    green = chroma;
    blue = second;
  } else if (segment < 4) {
    green = second;
    blue = chroma;
  } else if (segment < 5) {
    red = second;
    blue = chroma;
  } else {
    red = chroma;
    blue = second;
  }

  return rgbToHex((red + match) * 255, (green + match) * 255, (blue + match) * 255);
}

function rgbToHex(red: number, green: number, blue: number): string {
  return `#${[red, green, blue]
    .map((value) =>
      Math.max(0, Math.min(255, Math.round(value)))
        .toString(16)
        .padStart(2, '0')
    )
    .join('')}`;
}

function getSupportedColorModes(entity: HassEntity): Set<string> {
  const modes = entity.attributes?.supported_color_modes;
  if (Array.isArray(modes)) {
    return new Set(modes.filter((mode): mode is string => typeof mode === 'string'));
  }

  const colorMode = entity.attributes?.color_mode;
  if (typeof colorMode === 'string') {
    return new Set([colorMode]);
  }

  return new Set();
}
