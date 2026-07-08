import { useEffect, useRef } from 'react';
import { useTheme } from '@/app/hooks';
import { NotificationEmptyState } from './notification-empty-state';
import { NotificationHeader } from './notification-header';
import { NotificationItem } from './notification-item';
import { getNotificationSurfaceTokens } from './notification-surface-tokens';
import { formatTimestamp, getColorValue } from './notification-utils';
import { useNotifications } from './use-notifications';

interface NotificationPanelProps {
  isOpen: boolean;
  onClose: () => void;
}

export function NotificationPanel({ isOpen, onClose }: NotificationPanelProps) {
  const panelRef = useRef<HTMLDivElement>(null);
  const { theme, primaryColor } = useTheme();
  const surface = getNotificationSurfaceTokens(theme);
  const {
    notifications,
    unreadCount,
    runPrimaryAction,
    markAllAsRead,
    deleteNotification,
    clearAll,
  } = useNotifications();

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (panelRef.current && !panelRef.current.contains(event.target as Node)) {
        onClose();
      }
    }

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 md:absolute md:inset-auto md:right-0 md:top-full md:mt-2">
      <div className="absolute inset-0 bg-black/30 backdrop-blur-[2px] md:hidden" />

      <div
        ref={panelRef}
        className={`absolute inset-x-3 top-[calc(env(safe-area-inset-top,0px)+0.75rem)] max-h-[min(78vh,42rem)] overflow-hidden rounded-3xl md:inset-auto md:right-0 md:top-0 md:w-96 md:max-h-[60vh] md:rounded-2xl ${surface.panelClassName}`}
      >
        <NotificationHeader
          onClose={onClose}
          onMarkAllAsRead={unreadCount > 0 ? markAllAsRead : undefined}
          onClearAll={clearAll}
          unreadCount={unreadCount}
          hasNotifications={notifications.length > 0}
          theme={theme}
          primaryColor={primaryColor}
          getColorValue={getColorValue}
        />

        <div className="max-h-[calc(min(78vh,42rem)-7.5rem)] overflow-y-auto md:max-h-[60vh]">
          {notifications.length === 0 ? (
            <NotificationEmptyState theme={theme} />
          ) : (
            <div className={`divide-y ${surface.dividerClassName}`}>
              {notifications.map((notification) => (
                <NotificationItem
                  key={notification.id}
                  notification={notification}
                  onPrimaryAction={runPrimaryAction}
                  onDelete={deleteNotification}
                  theme={theme}
                  primaryColor={primaryColor}
                  formatTimestamp={formatTimestamp}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
