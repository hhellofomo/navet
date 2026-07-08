import { Bell, Search, X } from 'lucide-react';
import { memo, useEffect, useState } from 'react';
import { useSearch } from '@/app/contexts/search-context';
import { useTheme } from '@/app/contexts/theme-context';
import { NotificationPanel } from '@/app/features/notifications/components/notification-panel';
import { useDevices } from '@/app/hooks';
import { formatDateWithTime, getWeekNumber } from '@/app/utils';
import { UserDropdown } from './user-dropdown';

export const Header = memo(function Header() {
	const { theme } = useTheme();
	const [isNotificationOpen, setIsNotificationOpen] = useState(false);
	const { searchQuery, setSearchQuery, setFilteredDeviceIds, clearSearch, isSearchActive } =
		useSearch();
	const devices = useDevices();

	// Update filtered devices whenever search query changes
	useEffect(() => {
		const query = searchQuery.toLowerCase().trim();

		if (!query) {
			setFilteredDeviceIds([]);
			return;
		}

		const matchingIds: string[] = [];

		// Search through all device types
		const searchInDevices = <T extends Record<string, string | number | boolean | undefined>>(
			deviceArray: T[] | undefined,
			searchFields: (keyof T)[]
		) => {
			deviceArray?.forEach((device) => {
				const matches = searchFields.some((field) => {
					const value = device[field];
					return value && String(value).toLowerCase().includes(query);
				});
				if (matches) {
					matchingIds.push(device.id);
				}
			});
		};

		// Search all device types
		searchInDevices(devices.lights, ['name', 'room']);
		searchInDevices(devices.hvac, ['name', 'room']);
		searchInDevices(devices.switches, ['name', 'room']);
		searchInDevices(devices.covers, ['name', 'room']);
		searchInDevices(devices.locks, ['name', 'room']);
		searchInDevices(devices.media, ['name', 'room']);
		searchInDevices(devices.persons, ['name', 'location']);
		searchInDevices(devices.sensors, ['name', 'room']);
		searchInDevices(devices.vacuums, ['name', 'location']);
		searchInDevices(devices.climate, ['name']);
		searchInDevices(devices.weather, ['name', 'location']);
		searchInDevices(devices.power, ['name']);
		searchInDevices(devices.wifi, ['name', 'room']);

		setFilteredDeviceIds(matchingIds);
	}, [searchQuery, devices, setFilteredDeviceIds]);

	const textPrimary =
		theme === 'light' ? 'text-gray-900' : theme === 'contrast' ? 'text-white' : 'text-white';
	const textSecondary =
		theme === 'light' ? 'text-gray-600' : theme === 'contrast' ? 'text-gray-300' : 'text-gray-400';
	const inputBg =
		theme === 'light' ? 'bg-gray-100' : theme === 'contrast' ? 'bg-black/50' : 'bg-white/5';
	const inputBorder =
		theme === 'light'
			? 'border-gray-200'
			: theme === 'contrast'
				? 'border-white/20'
				: 'border-white/5';
	const inputFocusBorder =
		theme === 'light'
			? 'focus:border-gray-300'
			: theme === 'contrast'
				? 'focus:border-white/40'
				: 'focus:border-white/10';
	const placeholder =
		theme === 'light'
			? 'placeholder-gray-400'
			: theme === 'contrast'
				? 'placeholder-gray-400'
				: 'placeholder-gray-500';
	const hoverBg =
		theme === 'light'
			? 'hover:bg-gray-100'
			: theme === 'contrast'
				? 'hover:bg-white/10'
				: 'hover:bg-white/5';

	const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		setSearchQuery(e.target.value);
	};

	const handleClearSearch = () => {
		clearSearch();
	};

	return (
		<div className="flex flex-col md:flex-row md:items-center justify-between mb-6 md:mb-8 gap-4">
			<div className="flex items-center gap-4 md:gap-6 flex-1">
				<div>
					<h1 className={`text-2xl md:text-4xl font-bold ${textPrimary} mb-1`}>Hello, Vishal!</h1>
					<p className={`${textSecondary} text-xs md:text-sm`}>
						{formatDateWithTime(new Date())} | Week {getWeekNumber(new Date())}
					</p>
				</div>
			</div>

			<div className="flex items-center gap-2 md:gap-4">
				<div className="relative flex-1 md:flex-none">
					<Search className={`absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 ${textSecondary}`} />
					<input
						type="text"
						placeholder="Search devices"
						value={searchQuery}
						onChange={handleSearchChange}
						className={`${inputBg} border ${inputBorder} rounded-lg pl-10 pr-10 py-2 text-sm ${textPrimary} ${placeholder} focus:outline-none ${inputFocusBorder} w-full md:w-64`}
					/>
					{isSearchActive && (
						<button
							type="button"
							onClick={handleClearSearch}
							className={`absolute right-3 top-1/2 -translate-y-1/2 p-0.5 rounded ${hoverBg} transition-colors`}
						>
							<X className={`w-4 h-4 ${textSecondary}`} />
						</button>
					)}
				</div>

				<div className="relative">
					<button
						type="button"
						onClick={() => setIsNotificationOpen(!isNotificationOpen)}
						className={`relative p-2 rounded-lg ${hoverBg} transition-colors`}
					>
						<Bell className={`w-5 h-5 ${textSecondary}`} />
						<span className="absolute top-1 right-1 w-2 h-2 bg-orange-500 rounded-full"></span>
					</button>

					<NotificationPanel
						isOpen={isNotificationOpen}
						onClose={() => setIsNotificationOpen(false)}
					/>
				</div>

				<UserDropdown />
			</div>
		</div>
	);
});
