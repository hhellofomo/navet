import { useState, useRef, useEffect } from 'react';
import { Bell, X, Check, Trash2, AlertCircle, Info, CheckCircle, AlertTriangle } from 'lucide-react';
import { useTheme, type PrimaryColor } from '../contexts/theme-context';

interface Notification {
  id: string;
  type: 'info' | 'success' | 'warning' | 'error';
  title: string;
  message: string;
  timestamp: Date;
  read: boolean;
}

interface NotificationPanelProps {
  isOpen: boolean;
  onClose: () => void;
}

export function NotificationPanel({ isOpen, onClose }: NotificationPanelProps) {
  const panelRef = useRef<HTMLDivElement>(null);
  const { theme, primaryColor } = useTheme();

  // Mock notifications
  const [notifications, setNotifications] = useState<Notification[]>([
    {
      id: '1',
      type: 'warning',
      title: 'Front Door Left Open',
      message: 'The front door has been open for more than 5 minutes',
      timestamp: new Date(Date.now() - 5 * 60 * 1000),
      read: false,
    },
    {
      id: '2',
      type: 'success',
      title: 'Automation Triggered',
      message: 'Good Night routine completed successfully',
      timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
      read: false,
    },
    {
      id: '3',
      type: 'info',
      title: 'Device Updated',
      message: 'Living Room Thermostat firmware updated to v2.1.4',
      timestamp: new Date(Date.now() - 5 * 60 * 60 * 1000),
      read: true,
    },
    {
      id: '4',
      type: 'error',
      title: 'Connection Issue',
      message: 'Bedroom Motion Sensor is offline',
      timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000),
      read: true,
    },
  ]);

  // Get color value for inline styles
  const getColorValue = (color: PrimaryColor): string => {
    const colors: Record<PrimaryColor, string> = {
      orange: '#f97316',
      blue: '#3b82f6',
      green: '#22c55e',
      purple: '#a855f7',
      pink: '#ec4899',
      red: '#ef4444',
      yellow: '#eab308',
      teal: '#14b8a6',
    };
    return colors[color];
  };

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

  const markAsRead = (id: string) => {
    setNotifications(notifications.map(n => 
      n.id === id ? { ...n, read: true } : n
    ));
  };

  const markAllAsRead = () => {
    setNotifications(notifications.map(n => ({ ...n, read: true })));
  };

  const deleteNotification = (id: string) => {
    setNotifications(notifications.filter(n => n.id !== id));
  };

  const clearAll = () => {
    if (confirm('Are you sure you want to clear all notifications?')) {
      setNotifications([]);
    }
  };

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

  const formatTimestamp = (date: Date) => {
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    return `${diffDays}d ago`;
  };

  // Theme colors
  const textPrimary = theme === 'light' ? 'text-gray-900' : 'text-white';
  const textSecondary = theme === 'light' ? 'text-gray-600' : theme === 'contrast' ? 'text-gray-300' : 'text-gray-400';
  const textMuted = theme === 'light' ? 'text-gray-500' : 'text-gray-500';
  const cardBg = theme === 'light' ? 'bg-white/95' : theme === 'contrast' ? 'bg-gray-950/95' : 'bg-gray-900/95';
  const border = theme === 'light' ? 'border-gray-200' : theme === 'contrast' ? 'border-white/20' : 'border-white/10';
  const hoverBg = theme === 'light' ? 'hover:bg-gray-50' : theme === 'contrast' ? 'hover:bg-white/10' : 'hover:bg-white/5';
  const itemBg = theme === 'light' ? 'bg-gray-50' : theme === 'contrast' ? 'bg-black/30' : 'bg-white/5';

  const unreadCount = notifications.filter(n => !n.read).length;

  if (!isOpen) return null;

  return (
    <div
      ref={panelRef}
      className={`absolute right-0 top-full mt-2 w-[90vw] md:w-96 ${cardBg} backdrop-blur-xl border ${border} rounded-2xl shadow-2xl overflow-hidden z-50`}
    >
      {/* Header */}
      <div className={`p-4 border-b ${border} flex items-center justify-between`}>
        <div className="flex items-center gap-2">
          <Bell className={`w-4 h-4 ${textSecondary}`} />
          <h3 className={`text-sm font-semibold ${textPrimary}`}>
            Notifications
          </h3>
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
          onClick={onClose}
          className={`p-1.5 rounded-lg ${hoverBg} transition-colors`}
        >
          <X className={`w-4 h-4 ${textSecondary}`} />
        </button>
      </div>

      {/* Actions */}
      {notifications.length > 0 && (
        <div className={`p-2 border-b ${border} flex items-center gap-2`}>
          {unreadCount > 0 && (
            <button
              onClick={markAllAsRead}
              className={`flex-1 flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg ${hoverBg} transition-all`}
            >
              <Check className={`w-3.5 h-3.5 ${textSecondary}`} />
              <span className={`text-xs font-medium ${textPrimary}`}>Mark all read</span>
            </button>
          )}
          <button
            onClick={clearAll}
            className={`flex-1 flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg ${hoverBg} transition-all`}
          >
            <Trash2 className={`w-3.5 h-3.5 ${textSecondary}`} />
            <span className={`text-xs font-medium ${textPrimary}`}>Clear all</span>
          </button>
        </div>
      )}

      {/* Notifications List */}
      <div className="max-h-[60vh] overflow-y-auto">
        {notifications.length === 0 ? (
          <div className="p-8 text-center">
            <div className={`w-16 h-16 mx-auto mb-3 rounded-full ${itemBg} flex items-center justify-center`}>
              <Bell className={`w-8 h-8 ${textMuted}`} />
            </div>
            <p className={`text-sm font-medium ${textPrimary} mb-1`}>No notifications</p>
            <p className={`text-xs ${textMuted}`}>You're all caught up!</p>
          </div>
        ) : (
          <div className="divide-y divide-white/5">
            {notifications.map((notification) => (
              <div
                key={notification.id}
                className={`p-4 ${hoverBg} transition-all relative group ${
                  !notification.read ? itemBg : ''
                }`}
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
                      <h4 className={`text-sm font-medium ${textPrimary}`}>
                        {notification.title}
                      </h4>
                      <span className={`text-xs ${textMuted} flex-shrink-0`}>
                        {formatTimestamp(notification.timestamp)}
                      </span>
                    </div>
                    <p className={`text-xs ${textSecondary} mb-2 leading-relaxed`}>
                      {notification.message}
                    </p>

                    {/* Actions */}
                    <div className="flex items-center gap-2">
                      {!notification.read && (
                        <button
                          onClick={() => markAsRead(notification.id)}
                          className={`text-xs font-medium ${textMuted} hover:${textPrimary} transition-colors`}
                          style={{
                            color: getColorValue(primaryColor),
                          }}
                        >
                          Mark as read
                        </button>
                      )}
                      <button
                        onClick={() => deleteNotification(notification.id)}
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
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
