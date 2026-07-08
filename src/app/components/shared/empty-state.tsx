import { memo } from 'react';
import { getThemeSurfaceTokens } from '@/app/components/shared/theme/theme-surface-tokens';
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
  const surface = getThemeSurfaceTokens(theme);
  const shouldBlur = theme === 'glass' || theme === 'light';

  const panelClass = `${surface.panel} ${surface.borderStrong} ${surface.cardShadow} ${shouldBlur ? (theme === 'glass' ? 'backdrop-blur-2xl' : 'backdrop-blur-xl') : ''}`;
  const iconColor = surface.textMuted;
  const actionClass =
    theme === 'light'
      ? 'bg-gray-900 text-white hover:bg-gray-800'
      : `${surface.iconBg} ${surface.hoverBg} ${surface.textPrimary}`;

  return (
    <div className="flex h-full items-center justify-center p-6">
      <div className={`max-w-md w-full rounded-3xl border p-12 text-center ${panelClass}`}>
        <div
          className={`${surface.iconBg} mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-2xl`}
        >
          <Icon className={`h-10 w-10 ${iconColor}`} />
        </div>
        <h2 className={`mb-2 text-xl font-semibold ${surface.textPrimary}`}>{title}</h2>
        <p className={`text-sm leading-relaxed ${surface.textSecondary}`}>{description}</p>
        {actionLabel && onAction && (
          <button
            type="button"
            onClick={onAction}
            className={`mt-6 inline-flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-medium transition-colors ${actionClass}`}
          >
            {ActionIcon && <ActionIcon className="h-4 w-4" />}
            {actionLabel}
          </button>
        )}
      </div>
    </div>
  );
});
