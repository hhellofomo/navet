import { Clipboard, FlaskConical, Home, Lightbulb, Lock, Settings, Tv, Video } from 'lucide-react';
import { memo } from 'react';
import { getThemeColorValue } from '@/app/components/shared/theme/theme-colors';
import { getThemeSurfaceTokens } from '@/app/components/shared/theme/theme-surface-tokens';
import { type Section, useNavigation, useTheme } from '@/app/hooks';
import { ImageWithFallback } from '../figma/ImageWithFallback';

export const Sidebar = memo(function Sidebar() {
  const { theme, primaryColor } = useTheme();
  const { activeSection, setActiveSection } = useNavigation();
  const surface = getThemeSurfaceTokens(theme);
  const inactiveColor = `${surface.textMuted} ${surface.hoverBg}`;
  const activeColorValue = getThemeColorValue(primaryColor);

  const menuItems = [
    {
      icon: Home,
      label: 'Home',
      section: 'home' as Section,
      onClick: () => setActiveSection('home'),
    },
    {
      icon: Video,
      label: 'Security',
      section: 'security' as Section,
      onClick: () => setActiveSection('security'),
    },
    {
      icon: Clipboard,
      label: 'Tasks',
      section: 'tasks' as Section,
      onClick: () => setActiveSection('tasks'),
    },
    {
      icon: Lock,
      label: 'Locks',
      section: 'locks' as Section,
      onClick: () => setActiveSection('locks'),
    },
    {
      icon: Lightbulb,
      label: 'Lights',
      section: 'lights' as Section,
      onClick: () => setActiveSection('lights'),
    },
    {
      icon: Tv,
      label: 'Media',
      section: 'media' as Section,
      onClick: () => setActiveSection('media'),
    },
    {
      icon: FlaskConical,
      label: 'Mock',
      section: 'mock' as Section,
      onClick: () => setActiveSection('mock'),
    },
    {
      icon: Settings,
      label: 'Settings',
      section: 'settings' as Section,
      onClick: () => setActiveSection('settings'),
    },
  ];

  return (
    <>
      {/* Desktop Sidebar */}
      <div
        className={`fixed left-0 top-0 h-full w-16 ${surface.shellPanel} border-r flex-col items-center pt-8 pb-6 gap-[38px] hidden md:flex z-50`}
      >
        <div className="w-10 h-10 rounded-xl bg-orange-500 flex items-center justify-center mb-4">
          <ImageWithFallback src="/logo.svg" alt="Brand Logo" className="w-10 h-10" />
        </div>

        <div className="flex flex-col gap-4">
          {menuItems.map((item, index) => (
            <button
              type="button"
              key={index}
              onClick={item.onClick}
              className={`w-10 h-10 rounded-xl flex items-center justify-center transition-colors ${
                activeSection === item.section ? '' : inactiveColor
              }`}
              style={
                activeSection === item.section
                  ? {
                      backgroundColor: `${activeColorValue}20`,
                      color: activeColorValue,
                    }
                  : undefined
              }
            >
              <item.icon className="w-5 h-5" />
            </button>
          ))}
        </div>
      </div>

      {/* Mobile Bottom Navigation */}
      <div
        className={`fixed bottom-0 left-0 right-0 ${surface.shellPanel} border-t flex md:hidden justify-around items-center px-2 py-2 z-50 safe-area-pb`}
      >
        {[menuItems[0], menuItems[1], menuItems[4], menuItems[5], menuItems[6], menuItems[7]].map(
          (item, index) => (
            <button
              type="button"
              key={index}
              onClick={item.onClick}
              className={`flex flex-col items-center gap-1 py-2 px-2 rounded-lg transition-colors ${
                activeSection === item.section ? '' : inactiveColor
              }`}
              style={
                activeSection === item.section
                  ? {
                      backgroundColor: `${activeColorValue}20`,
                      color: activeColorValue,
                    }
                  : undefined
              }
            >
              <item.icon className="w-5 h-5" />
              <span className="text-[10px] font-medium">{item.label}</span>
            </button>
          )
        )}
      </div>
    </>
  );
});
