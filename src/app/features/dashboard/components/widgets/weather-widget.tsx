import { Droplets, Sun, Wind } from 'lucide-react';
import type { CardSize } from '@/app/components/shared/card-size-selector';
import { getThemeColorValue } from '@/app/components/shared/theme/theme-colors';
import { getThemeSurfaceTokens } from '@/app/components/shared/theme/theme-surface-tokens';
import { WeatherIcon } from '@/app/features/weather';
import { useTheme } from '@/app/hooks';

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
  const surface = getThemeSurfaceTokens(theme);
  const bgColor = theme === 'light' ? 'bg-white/70' : theme === 'contrast' ? 'bg-black/50' : surface.panel;
  const textPrimary = surface.textPrimary;
  const textSecondary = surface.textSecondary;
  const border = theme === 'light' ? 'border-gray-200/50' : surface.border;
  const subtleFill = theme === 'light' ? '#f3f4f6' : theme === 'contrast' ? 'rgba(255,255,255,0.05)' : 'rgba(255,255,255,0.08)';

  const displayForecast =
    size === 'extra-small' || size === 'small'
      ? []
      : mockForecast.slice(0, size === 'medium' ? 3 : 5);

  return (
    <div
      className={`${bgColor} backdrop-blur-xl rounded-2xl p-4 border ${border} h-full flex flex-col`}
    >
      {/* Current Weather */}
      <div className="flex items-start justify-between mb-4">
        <div>
          <p className={`text-xs ${textSecondary} mb-1`}>San Francisco, CA</p>
          <div className="flex items-baseline gap-2">
            <p className={`text-5xl font-light ${textPrimary}`}>72°</p>
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
          <p className={`text-sm ${textSecondary} mt-1`}>Mostly Sunny</p>
        </div>
      </div>

      {/* Weather Details */}
      {size !== 'extra-small' && size !== 'small' && (
        <div className="grid grid-cols-2 gap-3 mb-4">
          <div
            className="p-3 rounded-xl"
            style={{ backgroundColor: subtleFill }}
          >
            <div className="flex items-center gap-2 mb-1">
              <Wind className={`w-4 h-4 ${textSecondary}`} />
              <p className={`text-xs ${textSecondary}`}>Wind</p>
            </div>
            <p className={`text-lg font-semibold ${textPrimary}`}>8 mph</p>
          </div>
          <div
            className="p-3 rounded-xl"
            style={{ backgroundColor: subtleFill }}
          >
            <div className="flex items-center gap-2 mb-1">
              <Droplets className={`w-4 h-4 ${textSecondary}`} />
              <p className={`text-xs ${textSecondary}`}>Humidity</p>
            </div>
            <p className={`text-lg font-semibold ${textPrimary}`}>65%</p>
          </div>
        </div>
      )}

      {/* Forecast */}
      {displayForecast.length > 0 && (
        <>
          <p className={`text-xs font-medium ${textSecondary} mb-3`}>5-DAY FORECAST</p>
          <div className="flex-1 space-y-2">
            {displayForecast.map((day) => (
              <div key={day.day} className="flex items-center justify-between">
                <p className={`text-sm font-medium ${textPrimary} w-12`}>{day.day}</p>
                <div
                  className="w-8 h-8 rounded-lg flex items-center justify-center"
                  style={{ backgroundColor: subtleFill }}
                >
                  <WeatherIcon condition={day.condition} className="w-5 h-5" />
                </div>
                <div className="flex items-center gap-2">
                  <p className={`text-sm font-medium ${textPrimary}`}>{day.high}°</p>
                  <p className={`text-sm ${textSecondary}`}>{day.low}°</p>
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
