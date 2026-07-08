import { Info, LogOut, Palette, Server, X } from 'lucide-react';
import { PRIMARY_COLOR_OPTIONS, THEME_OPTIONS } from '../../../constants/theme-options';
import { useAuth } from '../../../contexts/auth-context';
import { useTheme } from '../../../hooks';
import { getThemeColorValue } from '../../../utils/theme-colors';

interface SettingsPanelProps {
  isOpen: boolean;
  onClose: () => void;
}

export function SettingsPanel({ isOpen, onClose }: SettingsPanelProps) {
  const { theme, setTheme, primaryColor, setPrimaryColor } = useTheme();
  const { logout, config } = useAuth();

  if (!isOpen) return null;

  const handleLogout = () => {
    if (confirm('Are you sure you want to logout?')) {
      logout();
      onClose();
    }
  };

  // Theme colors
  const bgColor = theme === 'light' ? 'bg-gray-50' : 'bg-[#0a0a0a]';
  const cardBg =
    theme === 'light' ? 'bg-white' : theme === 'contrast' ? 'bg-gray-950' : 'bg-gray-900';
  const textColor = theme === 'light' ? 'text-gray-900' : 'text-white';
  const mutedColor = theme === 'light' ? 'text-gray-600' : 'text-gray-300';
  const subtleColor = theme === 'light' ? 'text-gray-500' : 'text-gray-500';
  const borderColor = theme === 'light' ? 'border-gray-200' : 'border-white/10';
  const hoverBg = theme === 'light' ? 'hover:bg-gray-50' : 'hover:bg-white/5';

  return (
    <>
      {/* Backdrop overlay */}
      <button
        type="button"
        className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40"
        onClick={onClose}
        onKeyDown={(e) => {
          if (e.key === 'Escape') {
            e.preventDefault();
            onClose();
          }
        }}
        aria-label="Close settings panel"
      />

      {/* Full-page panel */}
      <div
        className={`fixed inset-0 z-50 overflow-hidden md:inset-auto md:right-0 md:top-0 md:bottom-0 md:w-[480px]`}
      >
        <div className={`h-full ${bgColor} flex flex-col`}>
          {/* Header with frosted glass effect */}
          <div className={`${cardBg} backdrop-blur-xl border-b ${borderColor} sticky top-0 z-10`}>
            <div className="flex items-center justify-between p-4 md:p-6">
              <div>
                <h2 className={`text-xl font-semibold ${textColor}`}>Settings</h2>
                <p className={`text-sm ${subtleColor} mt-0.5`}>Customize your dashboard</p>
              </div>
              <button
                type="button"
                onClick={onClose}
                className={`w-10 h-10 rounded-xl ${theme === 'light' ? 'bg-gray-100 hover:bg-gray-200' : 'bg-white/5 hover:bg-white/10'} transition-colors flex items-center justify-center`}
              >
                <X className={`w-5 h-5 ${mutedColor}`} />
              </button>
            </div>
          </div>

          {/* Content - Scrollable */}
          <div className="flex-1 overflow-y-auto p-4 md:p-6 space-y-6">
            {/* Appearance Section */}
            <section className={`${cardBg} rounded-2xl border ${borderColor} overflow-hidden`}>
              <div className="p-4 md:p-5 border-b border-white/10">
                <div className="flex items-center gap-3">
                  <div
                    className={`w-10 h-10 rounded-xl ${theme === 'light' ? 'bg-gray-100' : 'bg-white/5'} flex items-center justify-center`}
                  >
                    <Palette className={`w-5 h-5 ${mutedColor}`} />
                  </div>
                  <div>
                    <h3 className={`text-base font-semibold ${textColor}`}>Appearance</h3>
                    <p className={`text-xs ${subtleColor}`}>Customize colors and theme</p>
                  </div>
                </div>
              </div>

              <div className="p-4 md:p-5 space-y-6">
                {/* Theme Mode */}
                <div>
                  <label
                    htmlFor="theme-mode"
                    className={`text-sm font-medium ${textColor} block mb-3`}
                  >
                    Theme Mode
                  </label>
                  <div className="space-y-2">
                    {THEME_OPTIONS.map((option) => (
                      <button
                        type="button"
                        key={option.value}
                        onClick={() => setTheme(option.value)}
                        className={`
                          w-full p-4 rounded-xl border transition-all text-left
                          ${theme === option.value ? 'border-2' : `${borderColor} ${hoverBg}`}
                        `}
                        style={
                          theme === option.value
                            ? {
                                backgroundColor: `${getThemeColorValue(primaryColor)}1a`,
                                borderColor: getThemeColorValue(primaryColor),
                              }
                            : {}
                        }
                      >
                        <div className="flex items-center justify-between mb-1">
                          <span
                            className={`font-medium text-sm ${theme === option.value ? '' : textColor}`}
                            style={
                              theme === option.value
                                ? { color: getThemeColorValue(primaryColor) }
                                : {}
                            }
                          >
                            {option.label}
                          </span>
                          {theme === option.value && (
                            <div
                              className="w-5 h-5 rounded-full flex items-center justify-center"
                              style={{ backgroundColor: getThemeColorValue(primaryColor) }}
                            >
                              <div className="w-2 h-2 rounded-full bg-white" />
                            </div>
                          )}
                        </div>
                        <p className={`text-xs ${mutedColor}`}>{option.description}</p>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Primary Color */}
                <div>
                  <label
                    htmlFor="primary-color"
                    className={`text-sm font-medium ${textColor} block mb-3`}
                  >
                    Primary Color
                  </label>
                  <p className={`text-xs ${subtleColor} mb-4`}>
                    Choose a color that will be used for active states throughout your dashboard
                  </p>
                  <div className="grid grid-cols-6 gap-3">
                    {PRIMARY_COLOR_OPTIONS.map((option) => (
                      <button
                        type="button"
                        key={option.value}
                        onClick={() => setPrimaryColor(option.value)}
                        className={`w-full aspect-square rounded-full transition-all duration-300 ${
                          primaryColor === option.value
                            ? `ring-2 ${theme === 'light' ? 'ring-black/30' : 'ring-white/40'} scale-110 shadow-lg`
                            : 'hover:scale-110'
                        }`}
                        style={{
                          backgroundColor: option.color,
                        }}
                        title={option.label}
                      />
                    ))}
                  </div>
                </div>
              </div>
            </section>

            {/* Connection Section */}
            <section className={`${cardBg} rounded-2xl border ${borderColor} overflow-hidden`}>
              <div className="p-4 md:p-5 border-b border-white/10">
                <div className="flex items-center gap-3">
                  <div
                    className={`w-10 h-10 rounded-xl ${theme === 'light' ? 'bg-gray-100' : 'bg-white/5'} flex items-center justify-center`}
                  >
                    <Server className={`w-5 h-5 ${mutedColor}`} />
                  </div>
                  <div>
                    <h3 className={`text-base font-semibold ${textColor}`}>Connection</h3>
                    <p className={`text-xs ${subtleColor}`}>Smart home instance</p>
                  </div>
                </div>
              </div>

              <div className="p-4 md:p-5">
                <div
                  className={`p-4 rounded-xl border ${borderColor} ${theme === 'light' ? 'bg-gray-50' : 'bg-white/5'}`}
                >
                  <p className={`text-xs ${subtleColor} mb-2`}>Connected to</p>
                  <p className={`text-sm ${textColor} font-mono break-all`}>
                    {config?.url || 'Not connected'}
                  </p>
                </div>
              </div>
            </section>

            {/* About Section */}
            <section className={`${cardBg} rounded-2xl border ${borderColor} overflow-hidden`}>
              <div className="p-4 md:p-5 border-b border-white/10">
                <div className="flex items-center gap-3">
                  <div
                    className={`w-10 h-10 rounded-xl ${theme === 'light' ? 'bg-gray-100' : 'bg-white/5'} flex items-center justify-center`}
                  >
                    <Info className={`w-5 h-5 ${mutedColor}`} />
                  </div>
                  <div>
                    <h3 className={`text-base font-semibold ${textColor}`}>About</h3>
                    <p className={`text-xs ${subtleColor}`}>Dashboard information</p>
                  </div>
                </div>
              </div>

              <div className="p-4 md:p-5 space-y-3">
                <div className="flex justify-between items-center">
                  <span className={`text-sm ${mutedColor}`}>Version</span>
                  <span className={`text-sm font-medium ${textColor}`}>1.0.0</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className={`text-sm ${mutedColor}`}>Build</span>
                  <span className={`text-sm font-medium ${textColor}`}>March 2026</span>
                </div>
              </div>
            </section>

            {/* Logout Section */}
            <section>
              <button
                type="button"
                onClick={handleLogout}
                className={`w-full p-5 rounded-2xl border border-red-500/20 bg-red-500/10 hover:bg-red-500/20 transition-all text-left flex items-center gap-4`}
              >
                <div className="w-10 h-10 rounded-xl bg-red-500/20 flex items-center justify-center">
                  <LogOut className="w-5 h-5 text-red-500" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-red-500">Logout</p>
                  <p className={`text-xs ${mutedColor}`}>Disconnect from your system</p>
                </div>
              </button>
            </section>
          </div>
        </div>
      </div>
    </>
  );
}
