import { LogOut, Shield } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { useAuth } from '../contexts/auth-context';
import { type PrimaryColor, useTheme } from '../contexts/theme-context';

export function UserDropdown() {
	const [isOpen, setIsOpen] = useState(false);
	const dropdownRef = useRef<HTMLDivElement>(null);
	const { theme, primaryColor } = useTheme();
	const { logout } = useAuth();

	// Get color value for inline styles
	const getColorValue = (color: PrimaryColor): string => {
		const colors: Record<PrimaryColor, string> = {
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

	// Close dropdown when clicking outside
	useEffect(() => {
		function handleClickOutside(event: MouseEvent) {
			if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
				setIsOpen(false);
			}
		}

		if (isOpen) {
			document.addEventListener('mousedown', handleClickOutside);
			return () => document.removeEventListener('mousedown', handleClickOutside);
		}
	}, [isOpen]);

	const handleLogout = () => {
		if (confirm('Are you sure you want to logout?')) {
			logout();
		}
	};

	// Theme colors
	const textPrimary = theme === 'light' ? 'text-gray-900' : 'text-white';
	const textSecondary =
		theme === 'light' ? 'text-gray-600' : theme === 'contrast' ? 'text-gray-300' : 'text-gray-400';
	const textMuted =
		theme === 'light' ? 'text-gray-500' : theme === 'contrast' ? 'text-gray-400' : 'text-gray-500';
	const cardBg =
		theme === 'light' ? 'bg-white/95' : theme === 'contrast' ? 'bg-gray-950/95' : 'bg-gray-900/95';
	const border =
		theme === 'light'
			? 'border-gray-200'
			: theme === 'contrast'
				? 'border-white/20'
				: 'border-white/10';
	const _hoverBg =
		theme === 'light'
			? 'hover:bg-gray-100'
			: theme === 'contrast'
				? 'hover:bg-white/10'
				: 'hover:bg-white/5';
	const itemBg =
		theme === 'light' ? 'bg-gray-50' : theme === 'contrast' ? 'bg-black/30' : 'bg-white/5';

	return (
		<div className="relative" ref={dropdownRef}>
			{/* Avatar Button */}
			<button
				type="button"
				onClick={() => setIsOpen(!isOpen)}
				className="flex items-center gap-2 group cursor-pointer"
			>
				<div
					className="w-10 h-10 rounded-full flex items-center justify-center transition-transform group-hover:scale-105"
					style={{ backgroundColor: getColorValue(primaryColor) }}
				>
					<span className="text-white text-sm font-semibold">VC</span>
				</div>
			</button>

			{/* Dropdown Menu */}
			{isOpen && (
				<div
					className={`absolute right-0 top-full mt-2 w-72 ${cardBg} backdrop-blur-xl border ${border} rounded-2xl shadow-2xl overflow-visible z-50`}
				>
					{/* User Info Section */}
					<div className="p-4 border-b border-white/10">
						<div className="flex items-center gap-3 mb-3">
							<div
								className="w-12 h-12 rounded-full flex items-center justify-center"
								style={{ backgroundColor: getColorValue(primaryColor) }}
							>
								<span className="text-white font-semibold">VC</span>
							</div>
							<div>
								<p className={`text-sm font-semibold ${textPrimary}`}>Vishal Chauhan</p>
								<p className={`text-xs ${textMuted}`}>vishal@example.com</p>
							</div>
						</div>

						{/* Role Badge */}
						<div className={`flex items-center gap-2 px-3 py-2 ${itemBg} rounded-lg`}>
							<Shield className={`w-4 h-4 ${textSecondary}`} />
							<div>
								<p className={`text-xs ${textMuted}`}>Role</p>
								<p className={`text-sm font-medium ${textPrimary}`}>Administrator</p>
							</div>
						</div>
					</div>

					{/* Logout Button */}
					<div className="p-2 border-t border-white/10">
						<button
							type="button"
							onClick={handleLogout}
							className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-red-500 hover:bg-red-500/10 transition-all`}
						>
							<LogOut className="w-4 h-4" />
							<span className="text-sm font-medium">Logout</span>
						</button>
					</div>
				</div>
			)}
		</div>
	);
}
