import { AlertCircle, AlertTriangle, CheckCircle, Info } from 'lucide-react';
import type { PrimaryColor } from '../../contexts/theme-context';
import type { Notification } from './use-notifications';

interface NotificationItemProps {
  notification: Notification;
  onMarkAsRead: (id: string) => void;
  onDelete: (id: string) => void;
  theme: 'light' | 'dark' | 'contrast';
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
  const getNotificationIcon = (type: Notification['type']) => {
    switch (type) {
      case 'success':
        return <CheckCircle className="w-4 h-4" />;
      case 'warning':
        return <AlertTriangle className="w-4 h-4" />;
      case 'error':
        return <AlertCircle className="w-4 h-4" />;
      default:
        return <Info className="w-4 h-4" />;
    }
  };

  const getNotificationColor = (type: Notification['type']) => {
    switch (type) {
      case 'success':
        return '#22c55e';
      case 'warning':
        return '#eab308';
      case 'error':
        return '#ef4444';
      default:
        return getColorValue(primaryColor);
    }
  };

  const textPrimary = theme === 'light' ? 'text-gray-900' : 'text-white';
  const textSecondary =
    theme === 'light' ? 'text-gray-600' : theme === 'contrast' ? 'text-gray-300' : 'text-gray-400';
  const textMuted = theme === 'light' ? 'text-gray-500' : 'text-gray-500';
  const hoverBg =
    theme === 'light'
      ? 'hover:bg-gray-50'
      : theme === 'contrast'
        ? 'hover:bg-white/10'
        : 'hover:bg-white/5';
  const itemBg =
    theme === 'light' ? 'bg-gray-50' : theme === 'contrast' ? 'bg-black/30' : 'bg-white/5';

  return (
    <div
      className={`p-4 ${hoverBg} transition-all relative group ${!notification.read ? itemBg : ''}`}
    >
      <div className="flex gap-3">
        {/* Icon */}
        <div
          className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 text-white"
          style={{ backgroundColor: getNotificationColor(notification.type) }}
        >
          {getNotificationIcon(notification.type)}
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2 mb-1">
            <h4 className={`text-sm font-medium ${textPrimary}`}>{notification.title}</h4>
            <span className={`text-xs ${textMuted} flex-shrink-0`}>
              {formatTimestamp(notification.timestamp)}
            </span>
          </div>
          <p className={`text-xs ${textSecondary} mb-2 leading-relaxed`}>{notification.message}</p>

          {/* Actions */}
          <div className="flex items-center gap-2">
            {!notification.read && (
              <button
                type="button"
                onClick={() => onMarkAsRead(notification.id)}
                className={`text-xs font-medium ${textMuted} hover:${textPrimary} transition-colors`}
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
