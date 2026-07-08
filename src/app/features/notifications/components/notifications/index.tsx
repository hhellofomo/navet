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
    <div
      ref={panelRef}
      className={`absolute right-0 top-full z-50 mt-2 w-[90vw] overflow-hidden md:w-96 ${surface.panelClassName}`}
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

      <div className="max-h-[60vh] overflow-y-auto">
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
                getColorValue={getColorValue}
                formatTimestamp={formatTimestamp}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
