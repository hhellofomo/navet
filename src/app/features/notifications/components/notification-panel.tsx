import { useEffect, useRef } from 'react';
import { useTheme } from '@/app/contexts/theme-context';
import { NotificationEmptyState } from './notifications/notification-empty-state';
import { NotificationHeader } from './notifications/notification-header';
import { NotificationItem } from './notifications/notification-item';
import { formatTimestamp, getColorValue } from './notifications/notification-utils';
import { useNotifications } from './notifications/use-notifications';

interface NotificationPanelProps {
  isOpen: boolean;
  onClose: () => void;
}

export function NotificationPanel({ isOpen, onClose }: NotificationPanelProps) {
  const panelRef = useRef<HTMLDivElement>(null);
  const { theme, primaryColor } = useTheme();
  const { notifications, unreadCount, markAsRead, markAllAsRead, deleteNotification, clearAll } =
    useNotifications();

  // Close panel when clicking outside
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

  // Theme colors
  const cardBg =
    theme === 'light' ? 'bg-white/95' : theme === 'contrast' ? 'bg-gray-950/95' : 'bg-gray-900/95';
  const border =
    theme === 'light'
      ? 'border-gray-200'
      : theme === 'contrast'
        ? 'border-white/20'
        : 'border-white/10';

  if (!isOpen) return null;

  return (
    <div
      ref={panelRef}
      className={`absolute right-0 top-full mt-2 w-[90vw] md:w-96 ${cardBg} backdrop-blur-xl border ${border} rounded-2xl shadow-2xl overflow-hidden z-50`}
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

      {/* Notifications List */}
      <div className="max-h-[60vh] overflow-y-auto">
        {notifications.length === 0 ? (
          <NotificationEmptyState theme={theme} />
        ) : (
          <div className="divide-y divide-white/5">
            {notifications.map((notification) => (
              <NotificationItem
                key={notification.id}
                notification={notification}
                onMarkAsRead={markAsRead}
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
