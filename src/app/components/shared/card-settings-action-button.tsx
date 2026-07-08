import { Settings2 } from 'lucide-react';
import type { ButtonHTMLAttributes } from 'react';
import { RoundControlButton } from '@/app/components/shared/round-control-button';
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
  return (
    <RoundControlButton
      theme={theme}
      size={size}
      variant="neutral"
      className={`${
        tone === 'muted' ? 'opacity-50' : 'hover:scale-105 active:scale-95'
      } ${className}`}
      iconClassName={tone === 'muted' ? 'text-current/60' : ''}
      {...props}
    >
      <Settings2 className={size === 'large' ? 'h-4 w-4' : 'h-3.5 w-3.5'} />
    </RoundControlButton>
  );
}
