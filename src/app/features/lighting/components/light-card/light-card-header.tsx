import type { LucideIcon } from 'lucide-react';
import { memo } from 'react';
import { useTheme } from '@/app/contexts/theme-context';

interface LightCardHeaderProps {
	name: string;
	isOn: boolean;
	IconComponent: LucideIcon;
	size: 'small' | 'medium' | 'large';
}

export const LightCardHeader = memo(function LightCardHeader({
	name,
	isOn,
	IconComponent,
	size,
}: LightCardHeaderProps) {
	const { theme } = useTheme();
	const textColor = theme === 'light' ? 'text-gray-900' : 'text-white';
	const iconBgColor =
		theme === 'light' ? (isOn ? 'bg-amber-400/50' : 'bg-gray-200/60') : 'bg-orange-500/20';
	const iconColor =
		theme === 'light'
			? isOn
				? 'text-amber-600'
				: 'text-gray-400'
			: isOn
				? 'text-orange-400'
				: 'text-gray-500';
	const titleSize = size === 'small' ? 'text-xs' : 'text-sm';
	const badgeSize = size === 'small' ? 'w-8 h-8' : 'w-10 h-10';
	const iconSize = size === 'small' ? 'w-4 h-4' : 'w-5 h-5';
	const marginBottom = size === 'small' ? 'mb-2' : 'mb-2';

	return (
		<div className={`flex items-start justify-between ${marginBottom}`}>
			<div className="min-w-0 flex-1">
				<h3 className={`font-semibold ${titleSize} ${textColor} truncate`}>{name}</h3>
			</div>
			<div
				className={`${badgeSize} rounded-full ${iconBgColor} flex items-center justify-center flex-shrink-0 transition-all duration-500`}
			>
				<IconComponent
					aria-hidden="true"
					className={`${iconSize} ${iconColor} transition-colors duration-500`}
				/>
			</div>
		</div>
	);
});
