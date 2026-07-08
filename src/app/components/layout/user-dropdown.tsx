import { LogOut, Shield } from 'lucide-react';
import { memo, useEffect, useMemo, useRef, useState } from 'react';
import { getThemeColorValue } from '@/app/components/shared/theme/theme-colors';
import { Avatar, AvatarFallback, AvatarImage } from '@/app/components/ui/avatar';
import { useAuth } from '@/app/contexts/auth-context';
import { useHomeAssistant, useTheme } from '@/app/hooks';

interface UserDropdownProps {
  avatarUrl?: string | null;
}

export const UserDropdown = memo(function UserDropdown({ avatarUrl }: UserDropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const { theme, primaryColor } = useTheme();
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
    if (confirm('Are you sure you want to logout?')) {
      setIsOpen(false);
      logout();
    }
  };

  // Theme colors
  const textPrimary = theme === 'light' ? 'text-gray-900' : 'text-white';
  const textSecondary =
    theme === 'light' ? 'text-gray-600' : theme === 'contrast' ? 'text-gray-300' : 'text-gray-300';
  const textMuted =
    theme === 'light' ? 'text-gray-500' : theme === 'contrast' ? 'text-gray-300' : 'text-gray-500';
  const cardBg =
    theme === 'light' ? 'bg-white/95' : theme === 'contrast' ? 'bg-gray-950/95' : 'bg-gray-900/95';
  const border =
    theme === 'light'
      ? 'border-gray-200'
      : theme === 'contrast'
        ? 'border-white/20'
        : 'border-white/10';
  const itemBg =
    theme === 'light' ? 'bg-gray-50' : theme === 'contrast' ? 'bg-black/30' : 'bg-white/5';

  const fullName = user?.name?.trim() || 'User';
  const initials = useMemo(() => {
    const parts = fullName.split(/\s+/).filter(Boolean);
    return parts
      .slice(0, 2)
      .map((part) => part[0]?.toUpperCase() ?? '')
      .join('');
  }, [fullName]);
  const roleLabel = user?.is_owner ? 'Owner' : user?.is_admin ? 'Administrator' : 'User';

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Avatar Button */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 group cursor-pointer"
        aria-label="Open user menu"
        aria-expanded={isOpen}
      >
        <Avatar
          className="w-10 h-10 transition-transform group-hover:scale-105"
          style={{ backgroundColor: getThemeColorValue(primaryColor) }}
        >
          {avatarUrl ? <AvatarImage src={avatarUrl} alt={fullName} /> : null}
          <AvatarFallback className="bg-transparent text-white text-sm font-semibold">
            {initials || 'U'}
          </AvatarFallback>
        </Avatar>
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div
          className={`absolute right-0 top-full mt-2 w-72 ${cardBg} backdrop-blur-xl border ${border} rounded-2xl shadow-2xl overflow-visible z-50`}
        >
          {/* User Info Section */}
          <div className="p-4 border-b border-white/10">
            <div className="flex items-center gap-3 mb-3">
              <Avatar
                className="w-12 h-12"
                style={{ backgroundColor: getThemeColorValue(primaryColor) }}
              >
                {avatarUrl ? <AvatarImage src={avatarUrl} alt={fullName} /> : null}
                <AvatarFallback className="bg-transparent text-white font-semibold">
                  {initials || 'U'}
                </AvatarFallback>
              </Avatar>
              <div>
                <p className={`text-sm font-semibold ${textPrimary}`}>{fullName}</p>
                <p className={`text-xs ${textMuted}`}>Connected to Home Assistant</p>
              </div>
            </div>

            {/* Role Badge */}
            <div className={`flex items-center gap-2 px-3 py-2 ${itemBg} rounded-lg`}>
              <Shield className={`w-4 h-4 ${textSecondary}`} />
              <div>
                <p className={`text-xs ${textMuted}`}>Role</p>
                <p className={`text-sm font-medium ${textPrimary}`}>{roleLabel}</p>
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
});
