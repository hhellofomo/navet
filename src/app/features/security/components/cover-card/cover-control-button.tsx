import type { ReactNode } from 'react';
import { RoundControlButton } from '@/app/components/primitives/round-control-button';
import type { CardSize } from '@/app/components/shared/card-size-selector';
import type { ThemeType } from '@/app/hooks';

interface CoverControlButtonProps {
  theme: ThemeType;
  size: CardSize | 'large';
  label: string;
  onClick: () => void;
  children: ReactNode;
}

export function CoverControlButton({
  theme,
  size,
  label,
  onClick,
  children,
}: CoverControlButtonProps) {
  return (
    <RoundControlButton
      theme={theme}
      size={size}
      variant="soft"
      onClick={(event) => {
        event.stopPropagation();
        onClick();
      }}
      title={label}
    >
      {children}
    </RoundControlButton>
  );
}
