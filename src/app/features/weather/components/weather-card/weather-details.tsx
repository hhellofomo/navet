import type { CSSProperties } from 'react';
import { CaptionValue } from '@/app/components/ui/caption-value';
import { useI18n } from '@/app/hooks';

interface WeatherDetailsProps {
  temperature: number;
  highTemp: number;
  lowTemp: number;
  rainForecast?: string;
  precipitation: number;
  precipitationUnit: string;
  humidity: number;
  windSpeed: number;
  textPrimary: string;
  textSecondary: string;
  textShadow?: string;
  titleStyle: CSSProperties;
  subtitleStyle: CSSProperties;
}

export function WeatherDetails({
  temperature,
  highTemp,
  lowTemp,
  rainForecast,
  precipitation,
  precipitationUnit,
  humidity,
  windSpeed,
  textPrimary,
  textSecondary,
  textShadow,
  titleStyle,
  subtitleStyle,
}: WeatherDetailsProps) {
  const { t } = useI18n();
  const precipitationValue = `${precipitation}${precipitationUnit ? ` ${precipitationUnit}` : ''}`;

  return (
    <div className="shrink-0">
      <div className="mb-1 text-3xl font-bold leading-none" style={titleStyle}>
        {temperature}°C
      </div>
      <div className="mb-0.5 text-sm" style={subtitleStyle}>
        H:{highTemp}° L:{lowTemp}°
      </div>
      {rainForecast ? (
        <div className="text-sm" style={subtitleStyle}>
          {rainForecast}
        </div>
      ) : null}

      <div className="shrink-0 space-y-0.5">
        <CaptionValue
          caption={t('weather.precipitation')}
          value={precipitationValue}
          align="right"
          captionStyle={{
            color: textSecondary,
            textShadow,
          }}
          valueStyle={{
            color: textPrimary,
            textShadow,
          }}
        />
        <CaptionValue
          caption={t('weather.humidity')}
          value={`${humidity}%`}
          align="right"
          captionStyle={{
            color: textSecondary,
            textShadow,
          }}
          valueStyle={titleStyle}
        />
        <CaptionValue
          caption={t('weather.wind')}
          value={`${windSpeed} km/h`}
          align="right"
          captionStyle={subtitleStyle}
          valueStyle={titleStyle}
        />
      </div>
    </div>
  );
}
