import type { PrimaryColor, ThemeType } from '@/app/hooks';
import { getNotificationSurfaceTokens } from './notification-surface-tokens';
import { getNotificationColor, getNotificationIcon } from './notification-utils';
import type { Notification } from './use-notifications';

interface NotificationItemProps {
  notification: Notification;
  onMarkAsRead: (id: string) => void;
  onDelete: (id: string) => void;
  theme: ThemeType;
  primaryColor: PrimaryColor;
  getColorValue: (color: PrimaryColor) => string;
  formatTimestamp: (date: Date) => string;
}

export function NotificationItem({
  notification,
  onMarkAsRead,
  onDelete,
  theme,
  primaryColor,
  getColorValue,
  formatTimestamp,
}: NotificationItemProps) {
  const surface = getNotificationSurfaceTokens(theme);
  const NotificationIcon = getNotificationIcon(notification.type);

  return (
    <div
      className={`group relative p-4 transition-all ${surface.hoverClassName} ${!notification.read ? surface.unreadItemClassName : ''}`}
    >
      <div className="flex gap-3">
        {/* Icon */}
        <div
          className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 text-white"
          style={{ backgroundColor: getNotificationColor(notification.type, primaryColor) }}
        >
          <NotificationIcon className="w-4 h-4" />
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2 mb-1">
            <h4 className={`text-sm font-medium ${surface.textPrimary}`}>{notification.title}</h4>
            <span className={`shrink-0 text-xs ${surface.textMuted}`}>
              {formatTimestamp(notification.timestamp)}
            </span>
          </div>
          <p className={`mb-2 text-xs leading-relaxed ${surface.textSecondary}`}>
            {notification.message}
          </p>

          {/* Actions */}
          <div className="flex items-center gap-2">
            {!notification.read && (
              <button
                type="button"
                onClick={() => onMarkAsRead(notification.id)}
                className={`text-xs font-medium ${surface.textMuted} transition-colors hover:opacity-80`}
                style={{
                  color: getColorValue(primaryColor),
                }}
              >
                Mark as read
              </button>
            )}
            <button
              type="button"
              onClick={() => onDelete(notification.id)}
              className={`text-xs font-medium text-red-500 hover:text-red-400 transition-colors`}
            >
              Delete
            </button>
          </div>
        </div>

        {/* Unread indicator */}
        {!notification.read && (
          <div
            className="absolute left-2 top-1/2 -translate-y-1/2 w-1.5 h-1.5 rounded-full"
            style={{ backgroundColor: getColorValue(primaryColor) }}
          />
        )}
      </div>
    </div>
  );
}
