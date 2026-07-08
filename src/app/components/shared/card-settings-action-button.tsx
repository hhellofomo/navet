import { Settings2 } from 'lucide-react';
import type { ButtonHTMLAttributes } from 'react';

interface CardSettingsActionButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  theme: 'light' | 'dark' | 'contrast';
  size?: 'small' | 'medium' | 'large';
  className?: string;
}

export function CardSettingsActionButton({
  theme,
  size = 'medium',
  className = '',
  ...props
}: CardSettingsActionButtonProps) {
  const buttonSize = size === 'small' ? 'h-7 w-7' : size === 'large' ? 'h-10 w-10' : 'h-8 w-8';
  const iconSize = size === 'small' ? 'h-3 w-3' : size === 'large' ? 'h-5 w-5' : 'h-3.5 w-3.5';
  const buttonBg =
    theme === 'light' ? 'bg-gray-900/15 hover:bg-gray-900/25' : 'bg-white/10 hover:bg-white/20';
  const iconColor = theme === 'light' ? 'text-gray-900' : 'text-white';

  return (
    <button
      type="button"
      className={`${buttonSize} shrink-0 rounded-full ${buttonBg} flex items-center justify-center transition-all duration-300 hover:scale-105 active:scale-95 ${className}`}
      {...props}
    >
      <Settings2 className={`${iconSize} ${iconColor}`} />
    </button>
  );
}
