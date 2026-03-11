import { Settings2 } from 'lucide-react';
import type { ButtonHTMLAttributes } from 'react';
import { getThemeSurfaceTokens } from '@/app/components/shared/theme/theme-surface-tokens';
import type { ThemeType } from '@/app/hooks/use-theme';

interface CardSettingsActionButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  theme: ThemeType;
  size?: 'small' | 'medium' | 'large';
  className?: string;
  tone?: 'default' | 'muted';
}

export function CardSettingsActionButton({
  theme,
  size = 'medium',
  className = '',
  tone = 'default',
  ...props
}: CardSettingsActionButtonProps) {
  const buttonSize = size === 'small' ? 'h-7 w-7' : size === 'large' ? 'h-10 w-10' : 'h-8 w-8';
  const iconSize = size === 'small' ? 'h-3 w-3' : size === 'large' ? 'h-5 w-5' : 'h-3.5 w-3.5';
  const surface = getThemeSurfaceTokens(theme);
  const buttonBg =
    tone === 'muted'
      ? theme === 'light'
        ? 'bg-gray-900/10'
        : 'bg-white/15'
      : theme === 'light'
        ? 'bg-gray-900/15 hover:bg-gray-900/25'
        : `${surface.subtleBg} ${surface.hoverBg}`;
  const iconColor =
    tone === 'muted'
      ? theme === 'light'
        ? 'text-gray-500'
        : 'text-white/60'
      : theme === 'light'
        ? 'text-gray-900'
        : 'text-white';

  return (
    <button
      type="button"
      className={`${buttonSize} shrink-0 rounded-full ${buttonBg} flex items-center justify-center transition-all duration-300 ${
        tone === 'muted' ? 'opacity-50' : 'hover:scale-105 active:scale-95'
      } ${className}`}
      {...props}
    >
      <Settings2 className={`${iconSize} ${iconColor}`} />
    </button>
  );
}
