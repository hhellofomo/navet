import { InteractivePill } from '@/app/components/shared/interactive-pill';
import type { PrimaryColor, ThemeType } from '@/app/hooks';
import { getNotificationSurfaceTokens } from './notification-surface-tokens';
import { getNotificationColor, getNotificationIcon } from './notification-utils';
import type { Notification } from './use-notifications';

interface NotificationItemProps {
  notification: Notification;
  onPrimaryAction: (id: string) => Promise<void>;
  onDelete: (id: string) => Promise<void>;
  theme: ThemeType;
  primaryColor: PrimaryColor;
  getColorValue: (color: PrimaryColor) => string;
  formatTimestamp: (date: Date) => string;
}

export function NotificationItem({
  notification,
  onPrimaryAction,
  onDelete,
  theme,
  primaryColor,
  getColorValue,
  formatTimestamp,
}: NotificationItemProps) {
  const surface = getNotificationSurfaceTokens(theme);
  const NotificationIcon = getNotificationIcon(notification.type);
  const primaryActionLabel =
    notification.source === 'update'
      ? notification.requiresRestart
        ? 'Restart'
        : 'Update'
      : 'Mark as read';
  const secondaryActionLabel = notification.source === 'update' ? 'Hide' : 'Delete';
  const accentColor = getNotificationColor(notification.type, primaryColor);
  const iconShellClassName =
    theme === 'light'
      ? 'border border-gray-200 bg-white/90'
      : theme === 'glass'
        ? 'border border-white/14 bg-white/10 backdrop-blur-xl'
        : theme === 'contrast'
          ? 'border border-white/20 bg-black'
          : 'border border-white/10 bg-white/6';

  return (
    <div
      className={`group relative p-4 transition-all ${surface.hoverClassName} ${!notification.read ? surface.unreadItemClassName : ''}`}
    >
      <div className="flex gap-3">
        {/* Icon */}
        <div
          className={`h-8 w-8 rounded-2xl flex items-center justify-center flex-shrink-0 ${iconShellClassName}`}
        >
          <NotificationIcon
            className="w-4 h-4"
            style={{ color: getNotificationColor(notification.type, primaryColor) }}
          />
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

          {notification.source === 'update' &&
          notification.isBusy &&
          !notification.requiresRestart ? (
            <div className="mt-2 space-y-2">
              <div className={`text-[11px] font-medium ${surface.textSecondary}`}>
                {notification.statusLabel}
              </div>
              <div className="h-1.5 w-full overflow-hidden rounded-full bg-white/8">
                <div
                  className="h-full rounded-full transition-all duration-300"
                  style={{
                    width: `${notification.progress ?? 12}%`,
                    backgroundColor: accentColor,
                  }}
                />
              </div>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              {notification.source === 'update' && notification.statusLabel && (
                <span className={`mr-1 text-[11px] font-medium ${surface.textSecondary}`}>
                  {notification.statusLabel}
                </span>
              )}
              {(notification.source === 'update' || !notification.read) && (
                <InteractivePill
                  onClick={() => void onPrimaryAction(notification.id)}
                  active={notification.source === 'update'}
                  intent="action"
                  className="h-7 rounded-full px-2.5 text-[11px] font-medium"
                  style={
                    notification.source === 'update'
                      ? undefined
                      : { color: getColorValue(primaryColor) }
                  }
                >
                  {primaryActionLabel}
                </InteractivePill>
              )}
              <InteractivePill
                onClick={() => void onDelete(notification.id)}
                intent="action"
                className="h-7 rounded-full px-2.5 text-[11px] font-medium"
              >
                {secondaryActionLabel}
              </InteractivePill>
            </div>
          )}
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
