import { memo } from 'react';
import { useTheme } from '@/app/hooks';

interface EmptyStateProps {
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  description: string;
  actionIcon?: React.ComponentType<{ className?: string }>;
  actionLabel?: string;
  onAction?: () => void;
}

export const EmptyState = memo(function EmptyState({
  icon: Icon,
  title,
  description,
  actionIcon: ActionIcon,
  actionLabel,
  onAction,
}: EmptyStateProps) {
  const { theme } = useTheme();

  const bgColor = theme === 'light' ? 'bg-white' : 'bg-[#1c1c1e]';
  const textColor = theme === 'light' ? 'text-gray-900' : 'text-white';
  const descColor = theme === 'light' ? 'text-gray-600' : 'text-gray-300';
  const iconBg = theme === 'light' ? 'bg-gray-100' : 'bg-white/5';
  const iconColor = theme === 'light' ? 'text-gray-300' : 'text-gray-600';

  return (
    <div className="h-full flex items-center justify-center p-6">
      <div className={`${bgColor} rounded-3xl p-12 max-w-md w-full text-center backdrop-blur-xl`}>
        <div
          className={`${iconBg} w-20 h-20 rounded-2xl flex items-center justify-center mx-auto mb-6`}
        >
          <Icon className={`w-10 h-10 ${iconColor}`} />
        </div>
        <h2 className={`text-xl font-semibold ${textColor} mb-2`}>{title}</h2>
        <p className={`${descColor} text-sm leading-relaxed`}>{description}</p>
        {actionLabel && onAction && (
          <button
            type="button"
            onClick={onAction}
            className="mt-6 inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-gray-900 text-white text-sm font-medium"
          >
            {ActionIcon && <ActionIcon className="h-4 w-4" />}
            {actionLabel}
          </button>
        )}
      </div>
    </div>
  );
});
