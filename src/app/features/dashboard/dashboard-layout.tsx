import { memo, type ReactNode } from 'react';
import { Header } from '@/app/components/layout/header';
import { Sidebar } from '@/app/components/layout/sidebar';
import { getThemeColorValue } from '@/app/components/shared/theme/theme-colors';
import { useTheme } from '@/app/hooks';

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
                  ? `linear-gradient(135deg, ${getThemeColorValue(primaryColor)}50, ${getThemeColorValue(primaryColor)}30, transparent 70%)`
                  : `linear-gradient(135deg, ${getThemeColorValue(primaryColor)}40, ${getThemeColorValue(primaryColor)}20, transparent 60%)`,
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
