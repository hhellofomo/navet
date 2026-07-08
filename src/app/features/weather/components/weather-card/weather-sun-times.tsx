import { Sunrise, Sunset } from 'lucide-react';
import type { CSSProperties } from 'react';

interface WeatherSunTimesProps {
  sunrise: string;
  sunset: string;
  daylight: string;
  textPrimary?: string;
  textSecondary: string;
  textShadow?: string;
  titleStyle: CSSProperties;
  subtitleStyle: CSSProperties;
  iconStyleSecondary: CSSProperties;
}

export function WeatherSunTimes({
  sunrise,
  sunset,
  daylight,
  textSecondary,
  titleStyle,
  subtitleStyle,
  iconStyleSecondary,
}: WeatherSunTimesProps) {
  return (
    <div className="my-5 flex items-center justify-between px-1">
      <div className="flex items-center gap-2">
        <Sunrise className="h-4 w-4" style={iconStyleSecondary} />
        <span className="text-sm font-medium" style={titleStyle}>
          {sunrise}
        </span>
      </div>
      <div className="mx-3 flex min-w-0 flex-1 items-center">
        <div className="flex-1 border-t border-dashed" style={{ borderColor: textSecondary }} />
      </div>
      <div className="shrink-0 text-sm" style={subtitleStyle}>
        {daylight}
      </div>
      <div className="mx-3 flex min-w-0 flex-1 items-center">
        <div className="flex-1 border-t border-dashed" style={{ borderColor: textSecondary }} />
      </div>
      <div className="flex items-center gap-2">
        <Sunset className="h-4 w-4" style={iconStyleSecondary} />
        <span className="text-sm font-medium" style={titleStyle}>
          {sunset}
        </span>
      </div>
    </div>
  );
}
