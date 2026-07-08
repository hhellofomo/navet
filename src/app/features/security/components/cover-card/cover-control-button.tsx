import type { ReactNode } from 'react';
import { RoundControlButton } from '@/app/components/primitives/round-control-button';
import type { CardSize } from '@/app/components/shared/card-size-selector';
import type { ThemeType } from '@/app/hooks';

interface CoverControlButtonProps {
  theme: ThemeType;
  size: CardSize | 'large';
  label: string;
  onClick: () => void;
  disabled?: boolean;
  children: ReactNode;
}

export function CoverControlButton({
  theme,
  size,
  label,
  onClick,
  disabled = false,
  children,
}: CoverControlButtonProps) {
  return (
    <RoundControlButton
      theme={theme}
      size={size}
      variant="soft"
      disabled={disabled}
      onClick={(event) => {
        event.stopPropagation();
        if (disabled) {
          return;
        }
        onClick();
      }}
      title={label}
      className={disabled ? 'cursor-not-allowed opacity-45' : ''}
    >
      {children}
    </RoundControlButton>
  );
}
