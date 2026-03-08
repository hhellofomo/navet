import { AlertCircle, AlertTriangle, CheckCircle, Info } from 'lucide-react';
import type { PrimaryColor } from '@/app/hooks';
import { getThemeColorValue } from '@/app/utils/theme-colors';
import type { Notification } from './use-notifications';

export const formatTimestamp = (date: Date): string => {
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

export const getColorValue = getThemeColorValue;

export function getNotificationIcon(type: Notification['type']) {
  switch (type) {
    case 'success':
      return CheckCircle;
    case 'warning':
      return AlertTriangle;
    case 'error':
      return AlertCircle;
    default:
      return Info;
  }
}

export function getNotificationColor(
  type: Notification['type'],
  primaryColor: PrimaryColor
): string {
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
}
