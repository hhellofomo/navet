import { memo } from 'react';
import { Header } from '@/app/components/layout/header';
import { Sidebar } from '@/app/components/layout/sidebar';
import { getThemeColorValue } from '@/app/components/shared/theme/theme-colors';
import { getThemeSurfaceTokens } from '@/app/components/shared/theme/theme-surface-tokens';
import { useTheme } from '@/app/hooks';
import { useSettingsStore } from '@/app/stores';
import type { DashboardLayoutProps } from './types';

/**
 * Dashboard Layout Component
 * Provides consistent layout structure with sidebar and header
 * Memoized to prevent unnecessary re-renders
 */
export const DashboardLayout = memo(function DashboardLayout({ children }: DashboardLayoutProps) {
  const { theme, wallpaper, primaryColor } = useTheme();
  const lowPowerMode = useSettingsStore((state) => state.lowPowerMode);
  const surface = getThemeSurfaceTokens(theme);
  const isGlass = theme === 'glass';
  const isContrast = theme === 'contrast';

  const bgColor =
    theme === 'light'
      ? 'bg-gray-50'
      : isContrast
        ? 'bg-black'
        : isGlass
          ? 'bg-slate-950'
          : 'bg-[#0a0a0a]';
  const textColor = surface.textPrimary;

  return (
    <div className={`min-h-screen ${bgColor} ${textColor} relative`}>
      {/* Background Wallpaper with Color Blend */}
      {wallpaper && !isContrast && (
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
                  ? `linear-gradient(135deg, ${getThemeColorValue(primaryColor)}${lowPowerMode ? '35' : '50'}, ${getThemeColorValue(primaryColor)}${lowPowerMode ? '18' : '30'}, transparent 70%)`
                  : isGlass
                    ? lowPowerMode
                      ? `linear-gradient(135deg, ${getThemeColorValue(primaryColor)}26, rgba(255,255,255,0.04), transparent 58%)`
                      : `radial-gradient(circle at 16% 18%, ${getThemeColorValue(primaryColor)}55 0%, transparent 34%), radial-gradient(circle at 84% 12%, rgba(255,255,255,0.18) 0%, transparent 26%), linear-gradient(135deg, rgba(255,255,255,0.12), transparent 58%)`
                    : `linear-gradient(135deg, ${getThemeColorValue(primaryColor)}40, ${getThemeColorValue(primaryColor)}20, transparent 60%)`,
              mixBlendMode: theme === 'light' ? 'multiply' : isGlass ? 'screen' : 'color',
            }}
          />

          {/* Blur and Darken Overlay for Readability */}
          <div
            className={`absolute inset-0 ${lowPowerMode ? '' : 'backdrop-blur-sm'}`}
            style={{
              backgroundColor:
                theme === 'light'
                  ? lowPowerMode
                    ? 'rgba(249, 250, 251, 0.82)'
                    : 'rgba(249, 250, 251, 0.50)'
                  : isGlass
                    ? lowPowerMode
                      ? 'rgba(7, 12, 22, 0.72)'
                      : 'rgba(7, 12, 22, 0.46)'
                    : 'rgba(10, 10, 10, 0.55)',
            }}
          />
        </div>
      )}

      {isGlass && !wallpaper && (
        <div className="fixed inset-0 z-0 overflow-hidden">
          <div
            className="absolute inset-0"
            style={{
              background: lowPowerMode
                ? 'linear-gradient(180deg, rgba(12,18,32,0.98), rgba(7,10,18,0.99))'
                : 'radial-gradient(circle at 14% 18%, rgba(255,255,255,0.14) 0%, transparent 26%), radial-gradient(circle at 82% 14%, rgba(255,255,255,0.08) 0%, transparent 24%), radial-gradient(circle at 18% 80%, rgba(59,130,246,0.18) 0%, transparent 28%), radial-gradient(circle at 78% 72%, rgba(255,255,255,0.06) 0%, transparent 22%), linear-gradient(180deg, rgba(12,18,32,0.96), rgba(7,10,18,0.98))',
            }}
          />
          {lowPowerMode ? null : <div className="absolute inset-0 backdrop-blur-[36px]" />}
        </div>
      )}

      {/* Content */}
      <div className="relative z-10">
        <Sidebar />

        <div className="safe-area-pt-8 md:ml-16 flex flex-col gap-6 md:gap-8 p-3 pb-20 md:p-6 md:pb-6 lg:p-8 lg:pb-8">
          <Header />
          {children}
        </div>
      </div>
    </div>
  );
});

export type { DashboardLayoutProps } from './types';
