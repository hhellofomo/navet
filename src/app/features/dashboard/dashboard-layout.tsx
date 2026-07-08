import { Sidebar } from 'lucide-react';
import { memo, type ReactNode } from 'react';
import { Header } from '@/app/components/layout/header';
import { useTheme } from '../../contexts/theme-context';

interface DashboardLayoutProps {
	children: ReactNode;
}

/**
 * Dashboard Layout Component
 * Provides consistent layout structure with sidebar and header
 * Memoized to prevent unnecessary re-renders
 */
export const DashboardLayout = memo(function DashboardLayout({ children }: DashboardLayoutProps) {
	const { theme, wallpaper, primaryColor } = useTheme();

	const bgColor = theme === 'light' ? 'bg-gray-50' : 'bg-[#0a0a0a]';
	const textColor = theme === 'light' ? 'text-gray-900' : 'text-white';

	// Get primary color value for wallpaper blend
	const getColorValue = (color: typeof primaryColor): string => {
		const colors = {
			orange: '#f97316',
			blue: '#3b82f6',
			green: '#22c55e',
			purple: '#a855f7',
			pink: '#ec4899',
			red: '#ef4444',
			yellow: '#eab308',
			teal: '#14b8a6',
		};
		return colors[color];
	};

	return (
		<div className={`min-h-screen ${bgColor} ${textColor} relative`}>
			{/* Background Wallpaper with Color Blend */}
			{wallpaper && (
				<div className="fixed inset-0 z-0">
					{/* Wallpaper Image */}
					<div
						className="absolute inset-0"
						style={{
							backgroundImage: `url(${wallpaper})`,
							backgroundSize: 'cover',
							backgroundPosition: 'center',
							backgroundRepeat: 'no-repeat',
						}}
					/>

					{/* Color Blend Overlay */}
					<div
						className="absolute inset-0"
						style={{
							background:
								theme === 'light'
									? `linear-gradient(135deg, ${getColorValue(primaryColor)}50, ${getColorValue(primaryColor)}30, transparent 70%)`
									: `linear-gradient(135deg, ${getColorValue(primaryColor)}40, ${getColorValue(primaryColor)}20, transparent 60%)`,
							mixBlendMode: theme === 'light' ? 'multiply' : 'color',
						}}
					/>

					{/* Blur and Darken Overlay for Readability */}
					<div
						className="absolute inset-0 backdrop-blur-sm"
						style={{
							backgroundColor:
								theme === 'light'
									? 'rgba(249, 250, 251, 0.50)'
									: theme === 'contrast'
										? 'rgba(3, 7, 18, 0.70)'
										: 'rgba(10, 10, 10, 0.55)',
						}}
					/>
				</div>
			)}

			{/* Content */}
			<div className="relative z-10">
				<Sidebar />

				<div className="md:ml-16 p-3 md:p-6 lg:p-8 pb-20 md:pb-6 lg:pb-8">
					<Header />
					{children}
				</div>
			</div>
		</div>
	);
});
