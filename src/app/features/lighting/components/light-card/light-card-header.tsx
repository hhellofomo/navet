import type { LucideIcon } from 'lucide-react';
import { type ButtonHTMLAttributes, memo } from 'react';
import type { CardSize } from '@/app/components/shared/card-size-selector';
import { EntityCardHeaderIcon } from '@/app/components/shared/entity-card-header-icon';
import { useTheme } from '@/app/hooks';

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
  const { theme } = useTheme();
  const textColor = theme === 'light' ? 'text-gray-900' : 'text-white';
  const isCompact = size === 'extra-small' || size === 'small';
  const titleSize = isCompact ? 'text-xs' : 'text-sm';
  const marginBottom = 'mb-2';

  return (
    <div className={`flex items-start gap-3 ${marginBottom}`}>
      <EntityCardHeaderIcon
        IconComponent={IconComponent}
        isActive={isOn}
        size={size}
        ariaLabel={iconAriaLabel}
        onClick={onIconClick}
        onPointerDown={onIconPointerDown}
      />
      <div className="min-w-0 flex-1">
        <h3 className={`font-semibold ${titleSize} ${textColor} truncate`}>{name}</h3>
        <p className="text-[10px] text-gray-300 truncate mt-0.5">Light</p>
      </div>
    </div>
  );
});
