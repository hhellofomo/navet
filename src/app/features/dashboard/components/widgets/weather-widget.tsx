import { Droplets, Sun, Wind } from 'lucide-react';
import { type CardSize, isCompactCardSize } from '@/app/components/shared/card-size-selector';
import { getThemeColorValue } from '@/app/components/shared/theme/theme-colors';
import { WeatherIcon } from '@/app/features/weather';
import { useTheme } from '@/app/hooks';
import { getDashboardWidgetSurfaceTokens } from './widget-surface-tokens';

interface WeatherForecast {
  day: string;
  high: number;
  low: number;
  condition: 'sunny' | 'cloudy' | 'rainy' | 'snowy';
}

const mockForecast: WeatherForecast[] = [
  { day: 'Mon', high: 72, low: 58, condition: 'sunny' },
  { day: 'Tue', high: 68, low: 55, condition: 'cloudy' },
  { day: 'Wed', high: 65, low: 52, condition: 'rainy' },
  { day: 'Thu', high: 70, low: 56, condition: 'sunny' },
  { day: 'Fri', high: 74, low: 60, condition: 'sunny' },
];

interface WeatherWidgetProps {
  size?: CardSize;
}

export function WeatherWidget({ size = 'medium' }: WeatherWidgetProps) {
  const { theme, primaryColor } = useTheme();
  const surface = getDashboardWidgetSurfaceTokens(theme);
  const isCompact = isCompactCardSize(size);

  const displayForecast = isCompact ? [] : mockForecast.slice(0, size === 'medium' ? 3 : 5);

  return (
    <div className={`${surface.panelClassName} h-full flex flex-col`}>
      {/* Current Weather */}
      <div className="flex items-start justify-between mb-4">
        <div>
          <p className={`mb-1 text-xs ${surface.textSecondary}`}>San Francisco, CA</p>
          <div className="flex items-baseline gap-2">
            <p className={`text-5xl font-light ${surface.textPrimary}`}>72°</p>
            <div
              className="w-12 h-12 rounded-xl flex items-center justify-center"
              style={{
                backgroundColor: `${getThemeColorValue(primaryColor)}20`,
                color: getThemeColorValue(primaryColor),
              }}
            >
              <Sun className="w-6 h-6" />
            </div>
          </div>
          <p className={`mt-1 text-sm ${surface.textSecondary}`}>Mostly Sunny</p>
        </div>
      </div>

      {/* Weather Details */}
      {!isCompact && (
        <div className="grid grid-cols-2 gap-3 mb-4">
          <div className="p-3 rounded-xl" style={{ backgroundColor: surface.subtleFill }}>
            <div className="flex items-center gap-2 mb-1">
              <Wind className={`h-4 w-4 ${surface.textSecondary}`} />
              <p className={`text-xs ${surface.textSecondary}`}>Wind</p>
            </div>
            <p className={`text-lg font-semibold ${surface.textPrimary}`}>8 mph</p>
          </div>
          <div className="p-3 rounded-xl" style={{ backgroundColor: surface.subtleFill }}>
            <div className="flex items-center gap-2 mb-1">
              <Droplets className={`h-4 w-4 ${surface.textSecondary}`} />
              <p className={`text-xs ${surface.textSecondary}`}>Humidity</p>
            </div>
            <p className={`text-lg font-semibold ${surface.textPrimary}`}>65%</p>
          </div>
        </div>
      )}

      {/* Forecast */}
      {displayForecast.length > 0 && (
        <>
          <p className={`mb-3 text-xs font-medium ${surface.textSecondary}`}>5-DAY FORECAST</p>
          <div className="flex-1 space-y-2">
            {displayForecast.map((day) => (
              <div key={day.day} className="flex items-center justify-between">
                <p className={`w-12 text-sm font-medium ${surface.textPrimary}`}>{day.day}</p>
                <div
                  className="w-8 h-8 rounded-lg flex items-center justify-center"
                  style={{ backgroundColor: surface.subtleFill }}
                >
                  <WeatherIcon condition={day.condition} className="w-5 h-5" />
                </div>
                <div className="flex items-center gap-2">
                  <p className={`text-sm font-medium ${surface.textPrimary}`}>{day.high}°</p>
                  <p className={`text-sm ${surface.textSecondary}`}>{day.low}°</p>
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
