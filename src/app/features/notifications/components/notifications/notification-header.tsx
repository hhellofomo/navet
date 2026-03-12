import { Bell, Check, Trash2, X } from 'lucide-react';
import type { PrimaryColor, ThemeType } from '@/app/hooks';
import { getNotificationSurfaceTokens } from './notification-surface-tokens';

interface NotificationHeaderProps {
  onClose: () => void;
  onMarkAllAsRead?: () => void;
  onClearAll: () => void;
  unreadCount: number;
  hasNotifications: boolean;
  theme: ThemeType;
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
  const surface = getNotificationSurfaceTokens(theme);

  return (
    <>
      {/* Header */}
      <div className={`flex items-center justify-between border-b p-4 ${surface.borderClassName}`}>
        <div className="flex items-center gap-2">
          <Bell className={`h-4 w-4 ${surface.textSecondary}`} />
          <h3 className={`text-sm font-semibold ${surface.textPrimary}`}>Notifications</h3>
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
          className={`rounded-lg p-1.5 transition-colors ${surface.hoverClassName}`}
        >
          <X className={`h-4 w-4 ${surface.textSecondary}`} />
        </button>
      </div>

      {/* Actions */}
      {hasNotifications && (
        <div className={`flex items-center gap-2 border-b p-2 ${surface.borderClassName}`}>
          {unreadCount > 0 && onMarkAllAsRead && (
            <button
              type="button"
              onClick={onMarkAllAsRead}
              className={`flex flex-1 items-center justify-center gap-1.5 rounded-lg px-3 py-2 transition-all ${surface.hoverClassName}`}
            >
              <Check className={`h-3.5 w-3.5 ${surface.textSecondary}`} />
              <span className={`text-xs font-medium ${surface.textPrimary}`}>Mark all read</span>
            </button>
          )}
          <button
            type="button"
            onClick={onClearAll}
            className={`flex flex-1 items-center justify-center gap-1.5 rounded-lg px-3 py-2 transition-all ${surface.hoverClassName}`}
          >
            <Trash2 className={`h-3.5 w-3.5 ${surface.textSecondary}`} />
            <span className={`text-xs font-medium ${surface.textPrimary}`}>Clear all</span>
          </button>
        </div>
      )}
    </>
  );
}
