import type { LucideIcon } from 'lucide-react';
import { type ButtonHTMLAttributes, memo } from 'react';
import type { CardSize } from '@/app/components/shared/card-size-selector';
import { useTheme } from '@/app/contexts/theme-context';

interface EntityCardHeaderIconProps {
  IconComponent: LucideIcon;
  isActive: boolean;
  size: CardSize;
  ariaLabel?: string;
  onClick?: ButtonHTMLAttributes<HTMLButtonElement>['onClick'];
  onPointerDown?: ButtonHTMLAttributes<HTMLButtonElement>['onPointerDown'];
}

export const EntityCardHeaderIcon = memo(function EntityCardHeaderIcon({
  IconComponent,
  isActive,
  size,
  ariaLabel,
  onClick,
  onPointerDown,
}: EntityCardHeaderIconProps) {
  const { theme, primaryColor } = useTheme();
  const isCompact = size === 'extra-small' || size === 'small';
  const badgeSize = isCompact ? 'h-8 w-8' : 'h-10 w-10';
  const iconSize = isCompact ? 'h-4 w-4' : 'h-5 w-5';
  const colorMap = {
    orange: { bg: 'rgba(249, 115, 22, 0.24)', text: '#c2410c' },
    blue: { bg: 'rgba(59, 130, 246, 0.24)', text: '#1d4ed8' },
    green: { bg: 'rgba(34, 197, 94, 0.24)', text: '#15803d' },
    purple: { bg: 'rgba(168, 85, 247, 0.24)', text: '#7e22ce' },
    pink: { bg: 'rgba(236, 72, 153, 0.24)', text: '#be185d' },
    red: { bg: 'rgba(239, 68, 68, 0.24)', text: '#b91c1c' },
    yellow: { bg: 'rgba(234, 179, 8, 0.24)', text: '#a16207' },
    teal: { bg: 'rgba(20, 184, 166, 0.24)', text: '#0f766e' },
  } as const;
  const activeColor = colorMap[primaryColor];
  const interactiveClass = onClick
    ? 'cursor-pointer hover:scale-105 active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2'
    : 'pointer-events-none';
  const focusRingClass =
    theme === 'light'
      ? 'focus-visible:ring-gray-900/25 focus-visible:ring-offset-white'
      : 'focus-visible:ring-white/35 focus-visible:ring-offset-gray-950';
  const badgeClass = isActive
    ? ''
    : theme === 'light'
      ? 'bg-gray-200 border border-gray-300/80'
      : 'bg-white/5 border border-white/10';
  const badgeStyle = isActive
    ? {
        backgroundColor: theme === 'light' ? '#ffffff' : `${activeColor.text}cc`,
        borderColor: `${activeColor.text}55`,
        boxShadow:
          theme === 'light'
            ? `0 0 0 2px ${activeColor.text}22, 0 10px 28px ${activeColor.text}40`
            : `0 0 0 2px ${activeColor.text}22, 0 12px 30px ${activeColor.text}45`,
      }
    : undefined;

  return (
    <button
      type="button"
      aria-label={ariaLabel}
      onClick={onClick}
      onPointerDown={onPointerDown}
      className={`${badgeSize} rounded-full flex items-center justify-center flex-shrink-0 transition-all duration-500 ${interactiveClass} ${focusRingClass} ${badgeClass}`}
      style={badgeStyle}
    >
      <IconComponent
        aria-hidden="true"
        className={`${iconSize} transition-colors duration-500 ${
          !isActive && theme === 'light' ? 'text-gray-600' : !isActive ? 'text-gray-500' : ''
        }`}
        style={
          isActive
            ? {
                color: theme === 'light' ? activeColor.text : '#ffffff',
                filter:
                  theme === 'light' ? undefined : 'drop-shadow(0 1px 6px rgba(0, 0, 0, 0.35))',
              }
            : undefined
        }
      />
    </button>
  );
});
