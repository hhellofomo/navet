import { Sunrise, Sunset } from 'lucide-react';
import { memo } from 'react';
import { type CardSize, CardSizeSelector } from '@/app/components/shared/card-size-selector';
import { CaptionValue } from '@/app/components/ui/caption-value';
import { CardWrapper } from '@/app/components/ui/card-wrapper';
import { useTheme } from '@/app/contexts/theme-context';
import { type WeatherCondition, WeatherIcon } from './weather-icon';

// Re-export types
export type { WeatherCondition };
export type ForecastDay = {
	day: string;
	condition: string;
	high: number;
	low: number;
};

interface WeatherCardProps {
	id: string;
	location: string;
	temperature: number;
	condition: WeatherCondition | string;
	humidity: number;
	windSpeed: number;
	precipitation: number;
	sunrise: string;
	sunset: string;
	daylight: string;
	rainForecast: string;
	forecast: ForecastDay[];
	highTemp: number;
	lowTemp: number;
	size: CardSize;
	onSizeChange: (id: string, size: CardSize) => void;
	isEditMode: boolean;
}

/**
 * Premium Weather Card Component
 * High-quality design inspired by modern weather apps
 */
export const WeatherCard = memo(function WeatherCard({
	id,
	location,
	temperature,
	condition,
	humidity,
	windSpeed,
	precipitation,
	sunrise,
	sunset,
	daylight,
	rainForecast,
	forecast,
	highTemp,
	lowTemp,
	size,
	onSizeChange,
	isEditMode,
}: WeatherCardProps) {
	const { theme } = useTheme();
	const isSmall = size === 'small';
	const _isMedium = size === 'medium';
	const isLarge = size === 'large';

	// Get current date and time
	const now = new Date();
	const dayName = now.toLocaleDateString('en-US', { weekday: 'long' });
	const time = now.toLocaleTimeString('en-US', {
		hour: 'numeric',
		minute: '2-digit',
		hour12: true,
	});
	const dateTime = `${dayName}, ${time}`;

	// Theme-aware colors
	const cardBg =
		theme === 'light'
			? 'bg-gradient-to-br from-white to-slate-50/80 border-gray-200/80'
			: 'bg-gradient-to-br from-slate-900/95 to-slate-800/95 border-slate-700/30';
	const textPrimary = theme === 'light' ? 'text-gray-900' : 'text-white';
	const textSecondary = theme === 'light' ? 'text-gray-500' : 'text-gray-400';
	const iconBg = theme === 'light' ? 'bg-blue-100' : 'bg-blue-500/20';
	const glowOverlay =
		theme === 'light'
			? 'from-blue-50/30 via-transparent to-cyan-50/30'
			: 'from-blue-500/5 via-transparent to-cyan-500/5';
	const dashedBorder = theme === 'light' ? 'border-gray-300' : 'border-slate-600';

	return (
		<CardWrapper className={`${cardBg} p-5`}>
			{isEditMode && (
				<CardSizeSelector
					currentSize={size}
					onSizeChange={(newSize) => onSizeChange(id, newSize)}
				/>
			)}

			{/* Subtle gradient overlay */}
			<div className={`absolute inset-0 bg-gradient-to-br ${glowOverlay}`} />

			<div className="relative z-[2] h-full flex flex-col">
				{/* Header: Location + Icon */}
				<div className="flex items-start justify-between mb-2">
					<div className="min-w-0 flex-1">
						<h3
							className={`font-semibold ${textPrimary} truncate ${isSmall ? 'text-xs' : 'text-sm'}`}
						>
							{location}
						</h3>
						{!isSmall && <p className={`text-xs ${textSecondary}`}>{dateTime}</p>}
					</div>
					<div
						className={`${isSmall ? 'w-8 h-8' : 'w-10 h-10'} rounded-full flex items-center justify-center flex-shrink-0 ${iconBg}`}
					>
						<WeatherIcon condition={condition} className={`${isSmall ? 'w-4 h-4' : 'w-5 h-5'}`} />
					</div>
				</div>

				{isSmall ? (
					// SMALL: Compact view - Just temp and condition
					<div className="flex-1 flex flex-col justify-center">
						<div className={`text-3xl font-bold ${textPrimary} mb-1`}>{temperature}°C</div>
						<div className={`text-xs ${textSecondary}`}>{condition}</div>
						<div className={`text-xs ${textSecondary} mt-0.5`}>
							H:{highTemp}° L:{lowTemp}°
						</div>
					</div>
				) : (
					<div className="mt-auto">
						{/* Main Section: Temperature + Details */}
						<div className="flex items-end justify-between mb-3">
							{/* Temperature with rain forecast below */}
							<div className="flex-shrink-0">
								<div className={`text-3xl font-bold ${textPrimary} leading-none mb-1`}>
									{temperature}°C
								</div>
								<div className={`text-xs ${textSecondary} mb-0.5`}>
									H:{highTemp}° L:{lowTemp}°
								</div>
								{rainForecast && <div className={`text-xs ${textSecondary}`}>{rainForecast}</div>}
							</div>

							{/* Weather Details - Right Aligned */}
							<div className="space-y-0.5 flex-shrink-0">
								<CaptionValue caption="Precipitation" value={`${precipitation}%`} align="right" />
								<CaptionValue caption="Humidity" value={`${humidity}%`} align="right" />
								<CaptionValue caption="Wind" value={`${windSpeed} km/h`} align="right" />
							</div>
						</div>

						{/* Sun Times */}
						<div className="flex items-center justify-between my-8 px-1">
							<div className="flex items-center gap-2">
								<Sunrise className="w-4 h-4 text-orange-400" />
								<span className={`text-xs ${textPrimary} font-medium`}>{sunrise}</span>
							</div>
							<div className="flex-1 mx-4 flex items-center">
								<div className={`flex-1 border-t border-dashed ${dashedBorder}`} />
							</div>
							<div className={`text-xs ${textSecondary} mx-2`}>{daylight}</div>
							<div className="flex-1 mx-4 flex items-center">
								<div className={`flex-1 border-t border-dashed ${dashedBorder}`} />
							</div>
							<div className="flex items-center gap-2">
								<Sunset className="w-4 h-4 text-orange-400" />
								<span className={`text-xs ${textPrimary} font-medium`}>{sunset}</span>
							</div>
						</div>

						{/* Weekly Forecast - Only show on large cards */}
						{isLarge && (
							<div className="flex justify-between gap-3">
								{forecast.map((day, index) => (
									<div key={index} className="flex-1 text-center min-w-0">
										<div className={`text-xs ${textSecondary} mb-2`}>{day.day}</div>
										<WeatherIcon condition={day.condition} className="w-8 h-8 mx-auto mb-2" />
										<div className={`text-xs font-medium ${textPrimary} mb-1`}>{day.high}°</div>
										<div
											className={`text-xs ${theme === 'light' ? 'text-gray-400' : 'text-gray-500'}`}
										>
											{day.low}°
										</div>
									</div>
								))}
							</div>
						)}
					</div>
				)}
			</div>
		</CardWrapper>
	);
});
