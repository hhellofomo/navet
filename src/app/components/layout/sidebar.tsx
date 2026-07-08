import { Clipboard, FlaskConical, Home, Lightbulb, Lock, Settings, Tv, Video } from 'lucide-react';
import { memo, useEffect, useRef, useState } from 'react';
import { InteractivePill } from '@/app/components/shared/interactive-pill';
import { getThemeSurfaceTokens } from '@/app/components/shared/theme/theme-surface-tokens';
import { type Section, useNavigation, useTheme } from '@/app/hooks';
import { ImageWithFallback } from '../figma/ImageWithFallback';

export const Sidebar = memo(function Sidebar() {
  const { theme } = useTheme();
  const { activeSection, setActiveSection } = useNavigation();
  const surface = getThemeSurfaceTokens(theme);
  const isGlass = theme === 'glass';
  const inactiveColor = `${surface.textMuted} ${surface.hoverBg}`;
  const [isMobileNavHidden, setIsMobileNavHidden] = useState(false);
  const lastScrollYRef = useRef(0);

  useEffect(() => {
    const showThreshold = 96;
    const hideThreshold = 120;

    const handleScroll = () => {
      const currentScrollY = window.scrollY;

      if (currentScrollY <= showThreshold) {
        setIsMobileNavHidden(false);
      } else if (currentScrollY > lastScrollYRef.current && currentScrollY > hideThreshold) {
        setIsMobileNavHidden(true);
      }

      lastScrollYRef.current = currentScrollY;
    };

    lastScrollYRef.current = window.scrollY;
    handleScroll();

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

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
        className={`fixed left-0 top-0 hidden h-full w-16 ${surface.shellPanel} border-r md:flex z-50`}
      >
        <div className="flex w-full justify-center pt-8">
          <div className="flex h-10 w-10 items-center justify-center">
            <ImageWithFallback src="/logo.svg" alt="Brand Logo" className="h-10 w-10" />
          </div>
        </div>

        <div className="absolute inset-0 flex items-center justify-center">
          <div className="flex flex-col gap-4">
            {menuItems.map((item, index) => (
              <InteractivePill
                key={index}
                onClick={item.onClick}
                active={activeSection === item.section}
                className={`flex h-10 w-10 items-center justify-center rounded-xl transition-colors ${
                  activeSection === item.section ? '' : inactiveColor
                }`}
              >
                <item.icon className="h-5 w-5" />
              </InteractivePill>
            ))}
          </div>
        </div>
      </div>

      {/* Mobile Bottom Navigation */}
      <div
        className={`safe-area-bottom-offset fixed inset-x-0 z-50 px-2 pb-2 transition-transform duration-300 md:hidden ${
          isMobileNavHidden ? 'translate-y-[calc(100%+1rem)]' : 'translate-y-0'
        }`}
      >
        <div
          className={`relative overflow-hidden rounded-[28px] border ${surface.borderStrong} ${isGlass ? 'shadow-[0_-10px_40px_rgba(15,23,42,0.32)]' : 'shadow-lg'}`}
          style={
            isGlass
              ? {
                  background:
                    'linear-gradient(180deg, rgba(255,255,255,0.18), rgba(255,255,255,0.08))',
                  backdropFilter: 'blur(28px) saturate(180%)',
                  WebkitBackdropFilter: 'blur(28px) saturate(180%)',
                }
              : undefined
          }
        >
          {isGlass ? (
            <>
              <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.24),transparent_48%)]" />
              <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(180deg,rgba(15,23,42,0.12),rgba(15,23,42,0.32))]" />
              <div className="pointer-events-none absolute inset-x-6 top-0 h-px bg-white/45" />
            </>
          ) : null}

          <div
            className={`relative flex justify-around items-center px-2 py-2 ${isGlass ? 'bg-slate-950/18' : surface.shellPanel}`}
          >
            {[
              menuItems[0],
              menuItems[1],
              menuItems[4],
              menuItems[5],
              menuItems[6],
              menuItems[7],
            ].map((item, index) => (
              <InteractivePill
                key={index}
                onClick={item.onClick}
                active={activeSection === item.section}
                className={`flex min-w-0 flex-col items-center gap-1 rounded-xl px-2 py-2 transition-colors ${
                  activeSection === item.section ? '' : inactiveColor
                }`}
              >
                <item.icon className="h-5 w-5 shrink-0" />
                <span className="truncate text-[10px] font-medium">{item.label}</span>
              </InteractivePill>
            ))}
          </div>
        </div>
      </div>
    </>
  );
});
