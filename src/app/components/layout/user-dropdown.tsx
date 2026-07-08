import { LogOut, Shield } from 'lucide-react';
import { memo, useEffect, useMemo, useRef, useState } from 'react';
import { getThemeDropdownSurfaceClasses } from '@/app/components/shared/theme/dropdown-surface-tokens';
import { getThemeColorValue } from '@/app/components/shared/theme/theme-colors';
import { getThemeSurfaceTokens } from '@/app/components/shared/theme/theme-surface-tokens';
import { Avatar, AvatarFallback, AvatarImage } from '@/app/components/ui/avatar';
import { useAuth } from '@/app/contexts/auth-context';
import { useHomeAssistant, useI18n, useTheme } from '@/app/hooks';

interface UserDropdownProps {
  avatarUrl?: string | null;
}

export const UserDropdown = memo(function UserDropdown({ avatarUrl }: UserDropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const { theme, primaryColor } = useTheme();
  const { t } = useI18n();
  const surface = getThemeSurfaceTokens(theme);
  const { user } = useHomeAssistant();
  const { logout } = useAuth();

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
    if (confirm(t('settings.feedback.logoutConfirm'))) {
      setIsOpen(false);
      logout();
    }
  };

  // Theme colors
  const textPrimary = surface.textPrimary;
  const textSecondary = surface.textSecondary;
  const textMuted = surface.textMuted;
  const divider = surface.border;
  const itemBg = surface.subtleBg;
  const dropdownSurfaceClass = getThemeDropdownSurfaceClasses(theme);

  const fullName = user?.name?.trim() || t('userDropdown.defaultUser');
  const initials = useMemo(() => {
    const parts = fullName.split(/\s+/).filter(Boolean);
    return parts
      .slice(0, 2)
      .map((part) => part[0]?.toUpperCase() ?? '')
      .join('');
  }, [fullName]);
  const roleLabel = user?.is_owner
    ? t('userDropdown.role.owner')
    : user?.is_admin
      ? t('userDropdown.role.administrator')
      : t('userDropdown.role.user');

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Avatar Button */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 group cursor-pointer"
        aria-label={t('userDropdown.openMenu')}
        aria-expanded={isOpen}
      >
        <Avatar
          className="w-10 h-10 transition-transform group-hover:scale-105"
          style={{ backgroundColor: getThemeColorValue(primaryColor) }}
        >
          {avatarUrl ? <AvatarImage src={avatarUrl} alt={fullName} /> : null}
          <AvatarFallback className="bg-transparent text-white text-sm font-semibold">
            {initials || t('userDropdown.defaultInitial')}
          </AvatarFallback>
        </Avatar>
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div
          className={`absolute right-0 top-full z-50 mt-2 w-72 overflow-visible ${dropdownSurfaceClass}`}
        >
          {/* User Info Section */}
          <div className={`p-4 border-b ${divider}`}>
            <div className="flex items-center gap-3 mb-3">
              <Avatar
                className="w-12 h-12"
                style={{ backgroundColor: getThemeColorValue(primaryColor) }}
              >
                {avatarUrl ? <AvatarImage src={avatarUrl} alt={fullName} /> : null}
                <AvatarFallback className="bg-transparent text-white font-semibold">
                  {initials || t('userDropdown.defaultInitial')}
                </AvatarFallback>
              </Avatar>
              <div>
                <p className={`text-sm font-semibold ${textPrimary}`}>{fullName}</p>
                <p className={`text-xs ${textMuted}`}>{t('userDropdown.connected')}</p>
              </div>
            </div>

            {/* Role Badge */}
            <div className={`flex items-center gap-2 px-3 py-2 ${itemBg} rounded-lg`}>
              <Shield className={`w-4 h-4 ${textSecondary}`} />
              <div>
                <p className={`text-xs ${textMuted}`}>{t('userDropdown.roleLabel')}</p>
                <p className={`text-sm font-medium ${textPrimary}`}>{roleLabel}</p>
              </div>
            </div>
          </div>

          {/* Logout Button */}
          <div className={`p-2 border-t ${divider}`}>
            <button
              type="button"
              onClick={handleLogout}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-red-500 hover:bg-red-500/10 transition-all`}
            >
              <LogOut className="w-4 h-4" />
              <span className="text-sm font-medium">{t('common.logout')}</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
});
