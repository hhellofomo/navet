import {
  Download,
  ExternalLink,
  FileText,
  Github,
  Image as ImageIcon,
  Info,
  LayoutGrid,
  LogOut,
  type LucideIcon,
  Palette,
  Scale,
  Server,
  Settings2,
  Upload,
  X,
} from 'lucide-react';
import { type ReactNode, useRef, useState } from 'react';
import { toast } from 'sonner';
import { useAuth } from '@/app/contexts/auth-context';
import { useConfig } from '@/app/contexts/config-context';
import { type ThemeType, useTheme } from '@/app/contexts/theme-context';
import {
  type DashboardEntityMode,
  type PrimaryColor,
  useDashboardEntitiesStore,
  useSettingsStore,
} from '@/app/stores';
import { exportDashboardConfig, importDashboardConfig } from '@/app/utils/dashboard-config';

type SectionNavItem = {
  id: string;
  label: string;
  icon: LucideIcon;
};

type SettingsSectionCardProps = {
  id: string;
  icon: LucideIcon;
  title: string;
  description: string;
  textColor: string;
  mutedColor: string;
  subtleColor: string;
  borderColor: string;
  dividerColor: string;
  cardBg: string;
  iconBg: string;
  children: ReactNode;
};

type SettingsItemProps = {
  title: string;
  description: string;
  textColor: string;
  subtleColor: string;
  dividerColor?: string;
  children: ReactNode;
};

function SettingsSectionCard({
  id,
  icon: Icon,
  title,
  description,
  textColor,
  mutedColor,
  subtleColor,
  borderColor,
  dividerColor,
  cardBg,
  iconBg,
  children,
}: SettingsSectionCardProps) {
  return (
    <section id={id} className={`rounded-[32px] border ${borderColor} ${cardBg}`}>
      <div className="px-6 py-6 md:px-8 md:py-8">
        <div className="flex items-start gap-4">
          <div className={`flex h-11 w-11 items-center justify-center rounded-2xl ${iconBg}`}>
            <Icon className={`h-5 w-5 ${mutedColor}`} />
          </div>
          <div className="min-w-0">
            <h2 className={`text-xl font-semibold tracking-tight ${textColor}`}>{title}</h2>
            <p className={`mt-1 max-w-2xl text-sm leading-relaxed ${subtleColor}`}>{description}</p>
          </div>
        </div>

        <div className={`mt-8 divide-y ${dividerColor}`}>{children}</div>
      </div>
    </section>
  );
}

function SettingsItem({
  title,
  description,
  textColor,
  subtleColor,
  dividerColor,
  children,
}: SettingsItemProps) {
  return (
    <div className={`py-6 ${dividerColor || ''}`}>
      <div className="grid gap-5 lg:grid-cols-[minmax(0,280px)_minmax(0,1fr)] lg:gap-8">
        <div className="min-w-0">
          <h3 className={`text-base font-medium tracking-tight ${textColor}`}>{title}</h3>
          <p className={`mt-2 text-sm leading-relaxed ${subtleColor}`}>{description}</p>
        </div>
        <div className="min-w-0">{children}</div>
      </div>
    </div>
  );
}

export function SettingsSection() {
  const { theme, setTheme, primaryColor, setPrimaryColor, wallpaper, setWallpaper } = useTheme();
  const { logout, config } = useAuth();
  const { clearConfig } = useConfig();
  const disableAnimations = useSettingsStore((state) => state.disableAnimations);
  const updateSettings = useSettingsStore((state) => state.updateSettings);
  const dashboardMode = useDashboardEntitiesStore((state) => state.mode);
  const setDashboardMode = useDashboardEntitiesStore((state) => state.setMode);
  const [showLicense, setShowLicense] = useState(false);
  const [showTerms, setShowTerms] = useState(false);
  const importInputRef = useRef<HTMLInputElement | null>(null);

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

  const themeOptions: Array<{ value: ThemeType; label: string; description: string }> = [
    {
      value: 'dark',
      label: 'Dark',
      description: 'Subtle gradients with muted colors',
    },
    {
      value: 'light',
      label: 'Light',
      description: 'Bright pastels with soft accents',
    },
    {
      value: 'contrast',
      label: 'High Contrast',
      description: 'Vibrant colors for better visibility',
    },
  ];

  const colorOptions: Array<{ value: PrimaryColor; label: string; color: string }> = [
    { value: 'orange', label: 'Orange', color: '#f97316' },
    { value: 'blue', label: 'Blue', color: '#3b82f6' },
    { value: 'green', label: 'Green', color: '#22c55e' },
    { value: 'purple', label: 'Purple', color: '#a855f7' },
    { value: 'pink', label: 'Pink', color: '#ec4899' },
    { value: 'red', label: 'Red', color: '#ef4444' },
    { value: 'yellow', label: 'Yellow', color: '#eab308' },
    { value: 'teal', label: 'Teal', color: '#14b8a6' },
  ];

  const navItems: SectionNavItem[] = [
    { id: 'appearance', label: 'Appearance', icon: Palette },
    { id: 'dashboard', label: 'Dashboard', icon: LayoutGrid },
    { id: 'system', label: 'System', icon: Server },
    { id: 'project', label: 'Project', icon: Info },
  ];

  const handleLogout = () => {
    if (confirm('Are you sure you want to logout?')) {
      logout();
      toast.success('Logged out successfully');
    }
  };

  const handleResetConnection = () => {
    if (
      confirm(
        'Are you sure you want to reset your smart home connection? You will need to reconnect.'
      )
    ) {
      clearConfig();
      logout();
      toast.info('Connection reset. Please reconnect to your system.');
    }
  };

  const handleWallpaperUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      alert('Please upload an image file');
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      alert('Image size should be less than 5MB');
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      const result = e.target?.result as string;
      setWallpaper(result);
    };
    reader.readAsDataURL(file);
  };

  const handleRemoveWallpaper = () => {
    setWallpaper(null);
  };

  const handleExportDashboardConfig = () => {
    const payload = exportDashboardConfig();
    const blob = new Blob([JSON.stringify(payload, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    const dateStamp = new Date().toISOString().slice(0, 10);

    link.href = url;
    link.download = `navet-dashboard-config-${dateStamp}.json`;
    link.click();

    URL.revokeObjectURL(url);
    toast.success('Dashboard config exported');
  };

  const handleImportDashboardConfig = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      const content = await file.text();
      const parsed = JSON.parse(content);
      importDashboardConfig(parsed);
      toast.success('Dashboard config imported. Reloading...');
      window.setTimeout(() => {
        window.location.reload();
      }, 600);
    } catch {
      toast.error('Failed to import dashboard config');
    } finally {
      event.target.value = '';
    }
  };

  const accentColor = getColorValue(primaryColor);
  const cardBg =
    theme === 'light' ? 'bg-white/92' : theme === 'contrast' ? 'bg-gray-950' : 'bg-gray-900/88';
  const softBg = theme === 'light' ? 'bg-gray-50/90' : 'bg-white/[0.04]';
  const insetBg = theme === 'light' ? 'bg-white' : 'bg-black/20';
  const textColor = theme === 'light' ? 'text-gray-900' : 'text-white';
  const mutedColor = theme === 'light' ? 'text-gray-700' : 'text-gray-300';
  const subtleColor = theme === 'light' ? 'text-gray-500' : 'text-gray-400';
  const borderColor = theme === 'light' ? 'border-gray-200/80' : 'border-white/10';
  const dividerColor = theme === 'light' ? 'divide-gray-200/80' : 'divide-white/10';
  const lineColor = theme === 'light' ? 'border-gray-200/80' : 'border-white/10';
  const hoverBg = theme === 'light' ? 'hover:bg-gray-100/90' : 'hover:bg-white/7';
  const chipBg =
    theme === 'light' ? 'bg-gray-100' : theme === 'contrast' ? 'bg-black/50' : 'bg-white/5';
  const chipHoverBg =
    theme === 'light'
      ? 'hover:bg-gray-200'
      : theme === 'contrast'
        ? 'hover:bg-white/20'
        : 'hover:bg-white/10';
  const iconBg = theme === 'light' ? 'bg-gray-100' : 'bg-white/6';

  return (
    <div className="h-full overflow-y-auto px-4 py-4 md:px-6 md:py-6">
      <div className="mx-auto max-w-6xl space-y-8">
        <section
          className={`relative overflow-hidden rounded-[36px] border ${borderColor} px-6 py-8 md:px-8 md:py-10`}
          style={{
            background:
              theme === 'light'
                ? `linear-gradient(180deg, rgba(255,255,255,0.96) 0%, rgba(255,255,255,0.9) 72%, ${accentColor}0f 100%)`
                : `linear-gradient(180deg, rgba(18,18,20,0.96) 0%, rgba(12,12,14,0.92) 72%, ${accentColor}12 100%)`,
          }}
        >
          <div
            className="absolute right-[-40px] top-[-40px] h-44 w-44 rounded-full blur-3xl"
            style={{ backgroundColor: `${accentColor}22` }}
          />

          <div className="relative">
            <p className={`text-[11px] font-semibold uppercase tracking-[0.24em] ${subtleColor}`}>
              Settings
            </p>
            <h1
              className={`mt-4 max-w-3xl text-3xl font-semibold tracking-tight md:text-5xl ${textColor}`}
            >
              A calmer place to tune Navet.
            </h1>
            <p className={`mt-4 max-w-2xl text-sm leading-7 md:text-base ${subtleColor}`}>
              Large type, fewer boxes, and one clear action path per setting. The page stays
              scalable, but it should now read more like a product settings experience than a dense
              control panel.
            </p>

            <div className="mt-8 flex flex-wrap gap-2">
              {navItems.map(({ id, label, icon: Icon }) => (
                <a
                  key={id}
                  href={`#${id}`}
                  className={`flex items-center gap-2 rounded-full px-4 py-2 text-xs font-medium transition-colors ${chipBg} ${chipHoverBg} ${mutedColor}`}
                >
                  <Icon className="h-3.5 w-3.5" />
                  <span>{label}</span>
                </a>
              ))}
            </div>
          </div>
        </section>

        <SettingsSectionCard
          id="appearance"
          icon={Palette}
          title="Appearance"
          description="Visual decisions that define the overall feel of the dashboard."
          textColor={textColor}
          mutedColor={mutedColor}
          subtleColor={subtleColor}
          borderColor={borderColor}
          dividerColor={dividerColor}
          cardBg={cardBg}
          iconBg={iconBg}
        >
          <SettingsItem
            title="Theme mode"
            description="Choose the overall visual tone before adjusting accent details."
            textColor={textColor}
            subtleColor={subtleColor}
          >
            <div className={`rounded-[28px] p-2 ${softBg}`}>
              <div className="grid gap-2 md:grid-cols-3">
                {themeOptions.map((option) => {
                  const isActive = theme === option.value;
                  return (
                    <button
                      type="button"
                      key={option.value}
                      onClick={() => setTheme(option.value)}
                      className={`rounded-[22px] px-4 py-4 text-left transition-all ${
                        isActive ? 'shadow-sm' : hoverBg
                      }`}
                      style={
                        isActive
                          ? {
                              backgroundColor: insetBg === 'bg-white' ? '#ffffff' : undefined,
                              border: `1px solid ${accentColor}`,
                              boxShadow:
                                theme === 'light'
                                  ? '0 10px 30px rgba(15, 23, 42, 0.06)'
                                  : '0 10px 30px rgba(0, 0, 0, 0.18)',
                            }
                          : undefined
                      }
                    >
                      <p
                        className={`text-sm font-semibold ${isActive ? '' : textColor}`}
                        style={isActive ? { color: accentColor } : undefined}
                      >
                        {option.label}
                      </p>
                      <p className={`mt-1 text-xs leading-relaxed ${subtleColor}`}>
                        {option.description}
                      </p>
                    </button>
                  );
                })}
              </div>
            </div>
          </SettingsItem>

          <SettingsItem
            title="Accent color"
            description="Used for active states, selected controls, and the most important UI highlights."
            textColor={textColor}
            subtleColor={subtleColor}
          >
            <div className="flex flex-wrap items-center gap-3">
              {colorOptions.map((option) => {
                const isActive = primaryColor === option.value;
                return (
                  <button
                    type="button"
                    key={option.value}
                    onClick={() => setPrimaryColor(option.value)}
                    className={`h-11 w-11 rounded-full transition-all duration-300 ${
                      isActive
                        ? `ring-2 ${theme === 'light' ? 'ring-black/30' : 'ring-white/40'} ring-offset-2 ${theme === 'light' ? 'ring-offset-white' : 'ring-offset-gray-900'}`
                        : 'hover:scale-110'
                    }`}
                    style={{ backgroundColor: option.color }}
                    title={option.label}
                  />
                );
              })}
            </div>
          </SettingsItem>

          <SettingsItem
            title="Wallpaper"
            description="Add a background image that blends with the active accent and theme."
            textColor={textColor}
            subtleColor={subtleColor}
          >
            {wallpaper ? (
              <div className="relative max-w-2xl">
                <div
                  className="relative h-36 overflow-hidden rounded-[24px] border"
                  style={{ borderColor: `${accentColor}40` }}
                >
                  <img
                    src={wallpaper}
                    alt="Wallpaper preview"
                    className="h-full w-full object-cover"
                  />
                  <div
                    className="absolute inset-0"
                    style={{
                      background: `linear-gradient(135deg, ${accentColor}55, ${accentColor}10)`,
                      mixBlendMode: theme === 'light' ? 'multiply' : 'screen',
                    }}
                  />
                </div>

                <button
                  type="button"
                  onClick={handleRemoveWallpaper}
                  className={`absolute -right-2 -top-2 flex h-7 w-7 items-center justify-center rounded-full ${
                    theme === 'light' ? 'bg-gray-900 text-white' : 'bg-white text-gray-900'
                  } shadow-lg transition-all hover:scale-110`}
                >
                  <X className="h-3.5 w-3.5" />
                </button>

                <label
                  className={`mt-4 flex h-16 cursor-pointer items-center justify-center gap-3 rounded-[20px] border-2 border-dashed ${lineColor} transition-colors ${hoverBg}`}
                >
                  <Upload className={`h-4 w-4 ${mutedColor}`} />
                  <div className="text-center">
                    <p className={`text-sm font-medium ${textColor}`}>Replace wallpaper</p>
                    <p className={`text-[11px] ${subtleColor}`}>PNG, JPG up to 5MB</p>
                  </div>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleWallpaperUpload}
                    className="hidden"
                  />
                </label>
              </div>
            ) : (
              <label
                className={`flex h-36 max-w-2xl cursor-pointer flex-col items-center justify-center rounded-[24px] border-2 border-dashed ${lineColor} text-center transition-colors ${hoverBg}`}
              >
                <ImageIcon className={`mb-3 h-9 w-9 ${mutedColor}`} />
                <span className={`text-sm font-medium ${textColor}`}>Upload wallpaper</span>
                <span className={`mt-1 text-[11px] ${subtleColor}`}>PNG, JPG up to 5MB</span>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleWallpaperUpload}
                  className="hidden"
                />
              </label>
            )}
          </SettingsItem>
        </SettingsSectionCard>

        <SettingsSectionCard
          id="dashboard"
          icon={LayoutGrid}
          title="Dashboard"
          description="Decide what shows up on the board and how this local setup is backed up."
          textColor={textColor}
          mutedColor={mutedColor}
          subtleColor={subtleColor}
          borderColor={borderColor}
          dividerColor={dividerColor}
          cardBg={cardBg}
          iconBg={iconBg}
        >
          <SettingsItem
            title="Entity visibility mode"
            description="Either let Navet discover device cards automatically or curate the dashboard manually."
            textColor={textColor}
            subtleColor={subtleColor}
          >
            <div className={`inline-flex rounded-full p-1 ${softBg}`}>
              {(
                [
                  { value: 'auto', label: 'Auto' },
                  { value: 'manual', label: 'Manual' },
                ] as Array<{ value: DashboardEntityMode; label: string }>
              ).map((option) => {
                const isActive = dashboardMode === option.value;
                return (
                  <button
                    type="button"
                    key={option.value}
                    onClick={() => setDashboardMode(option.value)}
                    className={`rounded-full px-5 py-2 text-sm font-medium transition-all ${
                      isActive ? 'shadow-sm' : ''
                    }`}
                    style={
                      isActive
                        ? {
                            backgroundColor: accentColor,
                            color: '#ffffff',
                          }
                        : {
                            color: theme === 'light' ? '#4b5563' : '#d1d5db',
                          }
                    }
                  >
                    {option.label}
                  </button>
                );
              })}
            </div>
            <p className={`mt-3 text-xs leading-relaxed ${subtleColor}`}>
              Auto keeps discovery hands-off. Manual only shows entities you explicitly add.
            </p>
          </SettingsItem>

          <SettingsItem
            title="Local config backup"
            description="Export a reusable snapshot of your dashboard layout and restore it on another device later."
            textColor={textColor}
            subtleColor={subtleColor}
          >
            <p className={`max-w-2xl text-sm leading-relaxed ${subtleColor}`}>
              Includes theme, layout, room order, card order, manual entity selection, custom
              widgets, and light preset settings. Connection URL and token are intentionally left
              out.
            </p>

            <div className="mt-5 flex flex-col gap-3 sm:flex-row">
              <button
                type="button"
                onClick={handleExportDashboardConfig}
                className={`inline-flex items-center justify-center gap-2 rounded-full px-5 py-3 text-sm font-medium transition-colors ${softBg} ${hoverBg} ${textColor}`}
              >
                <Download className="h-4 w-4" />
                <span>Export config</span>
              </button>
              <button
                type="button"
                onClick={() => importInputRef.current?.click()}
                className={`inline-flex items-center justify-center gap-2 rounded-full px-5 py-3 text-sm font-medium transition-colors ${softBg} ${hoverBg} ${textColor}`}
              >
                <Upload className="h-4 w-4" />
                <span>Import config</span>
              </button>
              <input
                ref={importInputRef}
                type="file"
                accept="application/json"
                className="hidden"
                onChange={handleImportDashboardConfig}
              />
            </div>
          </SettingsItem>
        </SettingsSectionCard>

        <SettingsSectionCard
          id="system"
          icon={Server}
          title="System"
          description="Performance controls and connection details for the current Home Assistant target."
          textColor={textColor}
          mutedColor={mutedColor}
          subtleColor={subtleColor}
          borderColor={borderColor}
          dividerColor={dividerColor}
          cardBg={cardBg}
          iconBg={iconBg}
        >
          <SettingsItem
            title="Disable animations"
            description="Useful for slower devices like Raspberry Pis. Turns off transitions and animated effects across the app."
            textColor={textColor}
            subtleColor={subtleColor}
          >
            <div className={`inline-flex rounded-full p-1 ${softBg}`}>
              {[
                { value: false, label: 'Off' },
                { value: true, label: 'On' },
              ].map((option) => {
                const isActive = disableAnimations === option.value;
                return (
                  <button
                    type="button"
                    key={option.label}
                    onClick={() => updateSettings({ disableAnimations: option.value })}
                    className={`rounded-full px-5 py-2 text-sm font-medium transition-all ${
                      isActive ? 'shadow-sm' : ''
                    }`}
                    style={
                      isActive
                        ? {
                            backgroundColor: accentColor,
                            color: '#ffffff',
                          }
                        : {
                            color: theme === 'light' ? '#4b5563' : '#d1d5db',
                          }
                    }
                    aria-pressed={isActive}
                  >
                    {option.label}
                  </button>
                );
              })}
            </div>
          </SettingsItem>

          <SettingsItem
            title="Connection"
            description="Review the current server target, open Home Assistant, or reset the saved connection."
            textColor={textColor}
            subtleColor={subtleColor}
          >
            <div className={`rounded-[24px] border px-5 py-4 ${borderColor} ${softBg}`}>
              <p className={`text-[11px] uppercase tracking-[0.18em] ${subtleColor}`}>
                Connected to
              </p>
              <p className={`mt-2 break-all font-mono text-sm ${textColor}`}>
                {config?.url || 'Not connected'}
              </p>
            </div>

            {config?.url ? (
              <div className="mt-4 flex flex-col gap-3 sm:flex-row">
                <a
                  href={config.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`inline-flex items-center justify-center gap-2 rounded-full px-5 py-3 text-sm font-medium transition-colors ${softBg} ${hoverBg} ${textColor}`}
                >
                  <ExternalLink className="h-4 w-4" />
                  <span>Open Homeassistant</span>
                </a>

                <button
                  type="button"
                  onClick={handleResetConnection}
                  className={`inline-flex items-center justify-center gap-2 rounded-full px-5 py-3 text-sm font-medium transition-colors ${softBg} ${hoverBg} ${textColor}`}
                >
                  <Settings2 className="h-4 w-4" />
                  <span>Reset connection</span>
                </button>
              </div>
            ) : null}
          </SettingsItem>
        </SettingsSectionCard>

        <SettingsSectionCard
          id="project"
          icon={Info}
          title="Project"
          description="Version details, maintainer links, and the legal basics for using Navet."
          textColor={textColor}
          mutedColor={mutedColor}
          subtleColor={subtleColor}
          borderColor={borderColor}
          dividerColor={dividerColor}
          cardBg={cardBg}
          iconBg={iconBg}
        >
          <SettingsItem
            title="About"
            description="Quick project information."
            textColor={textColor}
            subtleColor={subtleColor}
          >
            <div className={`grid gap-3 sm:grid-cols-2`}>
              <div className={`rounded-[24px] border px-5 py-4 ${borderColor} ${softBg}`}>
                <p className={`text-[11px] uppercase tracking-[0.18em] ${subtleColor}`}>Version</p>
                <p className={`mt-2 text-lg font-semibold ${textColor}`}>1.0.0</p>
              </div>
              <div className={`rounded-[24px] border px-5 py-4 ${borderColor} ${softBg}`}>
                <p className={`text-[11px] uppercase tracking-[0.18em] ${subtleColor}`}>Build</p>
                <p className={`mt-2 text-lg font-semibold ${textColor}`}>March 2026</p>
              </div>
            </div>
          </SettingsItem>

          <SettingsItem
            title="Credits"
            description="Project maintainer and the stack behind the app."
            textColor={textColor}
            subtleColor={subtleColor}
          >
            <a
              href="https://github.com/awesomestvi/"
              target="_blank"
              rel="noopener noreferrer"
              className={`inline-flex items-center gap-3 rounded-full px-4 py-3 text-sm font-medium transition-colors ${softBg} ${hoverBg} ${textColor}`}
            >
              <Github className="h-4 w-4" />
              <span>awesomestvi</span>
              <ExternalLink className={`h-3.5 w-3.5 ${subtleColor}`} />
            </a>

            <div className={`mt-4 space-y-1 text-sm leading-relaxed ${subtleColor}`}>
              <p>React & TypeScript</p>
              <p>Tailwind CSS v4</p>
              <p>Radix UI</p>
              <p>Home Assistant community feedback</p>
            </div>
          </SettingsItem>

          <SettingsItem
            title="License"
            description="CC BY-NC-SA 4.0. Free for personal, educational, and non-profit use."
            textColor={textColor}
            subtleColor={subtleColor}
          >
            <button
              type="button"
              onClick={() => setShowLicense(!showLicense)}
              className={`inline-flex items-center gap-2 rounded-full px-5 py-3 text-sm font-medium transition-colors ${softBg} ${hoverBg} ${textColor}`}
            >
              <Scale className="h-4 w-4" />
              <span>{showLicense ? 'Hide full license' : 'View full license'}</span>
            </button>

            {showLicense ? (
              <div className={`mt-4 rounded-[24px] border p-5 ${borderColor} ${softBg}`}>
                <div className={`space-y-3 text-sm leading-relaxed ${textColor}`}>
                  <div>
                    <p className="font-semibold">You are free to:</p>
                    <ul className="mt-2 ml-4 list-disc space-y-1">
                      <li>Share and redistribute the material.</li>
                      <li>Adapt, remix, transform, and build upon it.</li>
                    </ul>
                  </div>
                  <div>
                    <p className="font-semibold">Under these terms:</p>
                    <ul className="mt-2 ml-4 list-disc space-y-1">
                      <li>Attribution is required.</li>
                      <li>Commercial use is not allowed.</li>
                      <li>Derivative work must keep the same license.</li>
                    </ul>
                  </div>
                  <a
                    href="https://creativecommons.org/licenses/by-nc-sa/4.0/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 text-blue-500 hover:underline"
                  >
                    <span>Read the full legal code</span>
                    <ExternalLink className="h-3.5 w-3.5" />
                  </a>
                </div>
              </div>
            ) : null}
          </SettingsItem>

          <SettingsItem
            title="Terms of use"
            description="Permitted and prohibited use, plus the standard warranty disclaimer."
            textColor={textColor}
            subtleColor={subtleColor}
          >
            <button
              type="button"
              onClick={() => setShowTerms(!showTerms)}
              className={`inline-flex items-center gap-2 rounded-full px-5 py-3 text-sm font-medium transition-colors ${softBg} ${hoverBg} ${textColor}`}
            >
              <FileText className="h-4 w-4" />
              <span>{showTerms ? 'Hide terms of use' : 'View terms of use'}</span>
            </button>

            {showTerms ? (
              <div className={`mt-4 rounded-[24px] border p-5 ${borderColor} ${softBg}`}>
                <div className={`space-y-3 text-sm leading-relaxed ${textColor}`}>
                  <div>
                    <p className="font-semibold">Permitted use</p>
                    <ul className="mt-2 ml-4 list-disc space-y-1">
                      <li>Personal use on your home devices.</li>
                      <li>Educational and learning purposes.</li>
                      <li>Non-profit organizations.</li>
                      <li>Open-source contributions to the project.</li>
                    </ul>
                  </div>
                  <div>
                    <p className="font-semibold">Prohibited use</p>
                    <ul className="mt-2 ml-4 list-disc space-y-1">
                      <li>Commercial use or revenue generation.</li>
                      <li>Corporate deployment for business purposes.</li>
                      <li>Offering the software as a paid service.</li>
                      <li>White-labeling or reselling it.</li>
                    </ul>
                  </div>
                  <p className={subtleColor}>
                    THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND. The author is
                    not responsible for security breaches or damages resulting from use of this
                    software.
                  </p>
                </div>
              </div>
            ) : null}
          </SettingsItem>

          <div className="pt-6">
            <button
              type="button"
              onClick={handleLogout}
              className="inline-flex items-center gap-2 rounded-full bg-red-500/10 px-5 py-3 text-sm font-medium text-red-500 transition-colors hover:bg-red-500/15"
            >
              <LogOut className="h-4 w-4" />
              <span>Logout</span>
            </button>
          </div>
        </SettingsSectionCard>
      </div>
    </div>
  );
}
