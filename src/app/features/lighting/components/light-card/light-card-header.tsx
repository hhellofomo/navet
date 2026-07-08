import type { LucideIcon } from 'lucide-react';
import { type ButtonHTMLAttributes, memo } from 'react';
import type { CardSize } from '@/app/components/shared/card-size-selector';
import { EntityCardHeader } from '@/app/components/shared/entity-card-header';
import { EntityCardHeaderIcon } from '@/app/components/shared/entity-card-header-icon';

interface LightCardHeaderProps {
  name: string;
  isOn: boolean;
  IconComponent: LucideIcon;
  size: CardSize;
  onIconClick?: ButtonHTMLAttributes<HTMLButtonElement>['onClick'];
  onIconPointerDown?: ButtonHTMLAttributes<HTMLButtonElement>['onPointerDown'];
  iconAriaLabel?: string;
}

export const LightCardHeader = memo(function LightCardHeader({
  name,
  isOn,
  IconComponent,
  size,
  onIconClick,
  onIconPointerDown,
  iconAriaLabel,
}: LightCardHeaderProps) {
  return (
    <EntityCardHeader
      title={name}
      subtitle="Light"
      size={size}
      leading={
        <EntityCardHeaderIcon
          IconComponent={IconComponent}
          isActive={isOn}
          size={size}
          ariaLabel={iconAriaLabel}
          onClick={onIconClick}
          onPointerDown={onIconPointerDown}
        />
      }
    />
  );
});
