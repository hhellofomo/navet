import { Bell, Check, Trash2, X } from 'lucide-react';
import type { PrimaryColor } from '@/app/hooks';

interface NotificationHeaderProps {
  onClose: () => void;
  onMarkAllAsRead?: () => void;
  onClearAll: () => void;
  unreadCount: number;
  hasNotifications: boolean;
  theme: 'light' | 'dark' | 'contrast';
  primaryColor: PrimaryColor;
  getColorValue: (color: PrimaryColor) => string;
}

export function NotificationHeader({
  onClose,
  onMarkAllAsRead,
  onClearAll,
  unreadCount,
  hasNotifications,
  theme,
  primaryColor,
  getColorValue,
}: NotificationHeaderProps) {
  const textPrimary = theme === 'light' ? 'text-gray-900' : 'text-white';
  const textSecondary =
    theme === 'light' ? 'text-gray-600' : theme === 'contrast' ? 'text-gray-300' : 'text-gray-300';
  const border =
    theme === 'light'
      ? 'border-gray-200'
      : theme === 'contrast'
        ? 'border-white/20'
        : 'border-white/10';
  const hoverBg =
    theme === 'light'
      ? 'hover:bg-gray-50'
      : theme === 'contrast'
        ? 'hover:bg-white/10'
        : 'hover:bg-white/5';

  return (
    <>
      {/* Header */}
      <div className={`p-4 border-b ${border} flex items-center justify-between`}>
        <div className="flex items-center gap-2">
          <Bell className={`w-4 h-4 ${textSecondary}`} />
          <h3 className={`text-sm font-semibold ${textPrimary}`}>Notifications</h3>
          {unreadCount > 0 && (
            <span
              className="text-xs font-medium px-2 py-0.5 rounded-full text-white"
              style={{ backgroundColor: getColorValue(primaryColor) }}
            >
              {unreadCount}
            </span>
          )}
        </div>
        <button
          type="button"
          onClick={onClose}
          className={`p-1.5 rounded-lg ${hoverBg} transition-colors`}
        >
          <X className={`w-4 h-4 ${textSecondary}`} />
        </button>
      </div>

      {/* Actions */}
      {hasNotifications && (
        <div className={`p-2 border-b ${border} flex items-center gap-2`}>
          {unreadCount > 0 && onMarkAllAsRead && (
            <button
              type="button"
              onClick={onMarkAllAsRead}
              className={`flex-1 flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg ${hoverBg} transition-all`}
            >
              <Check className={`w-3.5 h-3.5 ${textSecondary}`} />
              <span className={`text-xs font-medium ${textPrimary}`}>Mark all read</span>
            </button>
          )}
          <button
            type="button"
            onClick={onClearAll}
            className={`flex-1 flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg ${hoverBg} transition-all`}
          >
            <Trash2 className={`w-3.5 h-3.5 ${textSecondary}`} />
            <span className={`text-xs font-medium ${textPrimary}`}>Clear all</span>
          </button>
        </div>
      )}
    </>
  );
}
