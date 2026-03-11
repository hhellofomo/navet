import { Bell, CalendarDays, Clock3, Search, X } from 'lucide-react';
import { memo, useEffect, useMemo, useState } from 'react';
import { getThemeColorValue } from '@/app/components/shared/theme/theme-colors';
import { getThemeSurfaceTokens } from '@/app/components/shared/theme/theme-surface-tokens';
import { useAuth } from '@/app/contexts/auth-context';
import { NotificationPanel } from '@/app/features/notifications';
import { useDevices, useHomeAssistant, useSearch, useTheme } from '@/app/hooks';
import { UserDropdown } from './user-dropdown';

export const Header = memo(function Header() {
  const { theme, primaryColor } = useTheme();
  const surface = getThemeSurfaceTokens(theme);
  const { config: authConfig } = useAuth();
  const { entities, user } = useHomeAssistant();
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [currentDateTime, setCurrentDateTime] = useState(() => new Date());
  const { searchQuery, setSearchQuery, setFilteredDeviceIds, clearSearch, isSearchActive } =
    useSearch();
  const devices = useDevices();

  useEffect(() => {
    const intervalId = window.setInterval(() => {
      setCurrentDateTime(new Date());
    }, 1000 * 30);

    return () => {
      window.clearInterval(intervalId);
    };
  }, []);

  // Update filtered devices whenever search query changes
  useEffect(() => {
    const query = searchQuery.toLowerCase().trim();

    if (!query) {
      setFilteredDeviceIds([]);
      return;
    }

    const matchingIds: string[] = [];

    const searchInDevices = <T extends { id: string }>(
      deviceArray: T[] | undefined,
      searchFields: (keyof T)[]
    ) => {
      deviceArray?.forEach((device) => {
        const matches = searchFields.some((field) => {
          const value = device[field];
          return (
            value !== undefined && value !== null && String(value).toLowerCase().includes(query)
          );
        });
        if (matches) {
          matchingIds.push(device.id);
        }
      });
    };

    const searchActions = [
      () => searchInDevices(devices.lights, ['name', 'room']),
      () => searchInDevices(devices.hvac, ['name', 'room']),
      () => searchInDevices(devices.switches, ['name', 'room']),
      () => searchInDevices(devices.covers, ['name', 'room']),
      () => searchInDevices(devices.locks, ['name', 'room']),
      () => searchInDevices(devices.media, ['name', 'room']),
      () => searchInDevices(devices.persons, ['name', 'location']),
      () => searchInDevices(devices.sensors, ['name', 'room']),
      () => searchInDevices(devices.vacuums, ['name', 'room']),
      () => searchInDevices(devices.climate, ['name']),
      () => searchInDevices(devices.weather, ['name', 'location']),
      () => searchInDevices(devices.power, ['name']),
      () => searchInDevices(devices.wifi, ['name', 'room']),
    ];

    searchActions.forEach((searchAction) => {
      searchAction();
    });

    setFilteredDeviceIds(matchingIds);
  }, [searchQuery, devices, setFilteredDeviceIds]);

  const textPrimary = surface.textPrimary;
  const textSecondary = surface.textSecondary;
  const inputBg = surface.inputBg;
  const placeholder = surface.placeholder;
  const hoverBg = surface.hoverBg;
  const dividerColor = surface.textMuted;
  const activeColorValue = getThemeColorValue(primaryColor);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  const handleClearSearch = () => {
    clearSearch();
  };

  const firstName = useMemo(() => {
    const fullName = user?.name?.trim();
    if (!fullName) {
      return 'there';
    }

    return fullName.split(/\s+/)[0];
  }, [user?.name]);

  const avatarUrl = useMemo(() => {
    const entityPicture = Object.values(entities ?? {}).find((entity) => {
      if (!entity.entity_id.startsWith('person.')) {
        return false;
      }

      const friendlyName = entity.attributes?.friendly_name;
      return (
        typeof friendlyName === 'string' &&
        typeof user?.name === 'string' &&
        friendlyName.trim().toLowerCase() === user.name.trim().toLowerCase()
      );
    })?.attributes?.entity_picture;

    if (typeof entityPicture !== 'string' || !entityPicture) {
      return null;
    }

    if (entityPicture.startsWith('http://') || entityPicture.startsWith('https://')) {
      return entityPicture;
    }

    return authConfig ? `${authConfig.url}${entityPicture}` : entityPicture;
  }, [authConfig, entities, user?.name]);

  const formattedDate = useMemo(
    () =>
      new Intl.DateTimeFormat(undefined, {
        weekday: 'short',
        month: 'long',
        day: 'numeric',
      }).format(currentDateTime),
    [currentDateTime]
  );

  const formattedTime = useMemo(
    () =>
      new Intl.DateTimeFormat(undefined, {
        hour: '2-digit',
        minute: '2-digit',
        hour12: false,
      }).format(currentDateTime),
    [currentDateTime]
  );

  return (
    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
      <div className="flex items-center gap-4 md:gap-6 flex-1">
        <div>
          <h1 className={`text-2xl md:text-4xl font-bold ${textPrimary} mb-1`}>
            Hello, {firstName}!
          </h1>
          <div className={`${textSecondary} flex flex-wrap items-center gap-3 text-xs md:text-sm`}>
            <div className="flex items-center gap-1.5">
              <Clock3 className="h-3.5 w-3.5" />
              <span>{formattedDate}</span>
              <span aria-hidden="true" className={dividerColor}>
                |
              </span>
              <span>{formattedTime}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <CalendarDays className="h-3.5 w-3.5" />
              <span>Week 11</span>
            </div>
          </div>
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
            onFocus={() => setIsSearchFocused(true)}
            onBlur={() => setIsSearchFocused(false)}
            className={`${inputBg} border rounded-lg pl-10 pr-10 py-2 text-sm ${textPrimary} ${placeholder} focus:outline-none w-full md:w-64`}
            style={{
              borderColor: isSearchFocused ? activeColorValue : undefined,
              boxShadow: isSearchFocused ? `0 0 0 2px ${activeColorValue}22` : undefined,
              caretColor: activeColorValue,
            }}
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
            <span
              className="absolute top-1 right-1 w-2 h-2 rounded-full"
              style={{ backgroundColor: activeColorValue }}
            ></span>
          </button>

          <NotificationPanel
            isOpen={isNotificationOpen}
            onClose={() => setIsNotificationOpen(false)}
          />
        </div>

        <UserDropdown avatarUrl={avatarUrl} />
      </div>
    </div>
  );
});
