import type { ReactNode } from 'react';
import type { CardSize } from '@/app/components/shared/card-size-selector';
import { getThemeSurfaceTokens } from '@/app/components/shared/theme/theme-surface-tokens';
import { useTheme } from '@/app/hooks';

interface EntityCardHeaderProps {
  title: string;
  subtitle: string;
  size: CardSize;
  leading: ReactNode;
  titleClassName?: string;
  subtitleClassName?: string;
}

export function EntityCardHeader({
  title,
  subtitle,
  size,
  leading,
  titleClassName = '',
  subtitleClassName = '',
}: EntityCardHeaderProps) {
  const { theme } = useTheme();
  const surface = getThemeSurfaceTokens(theme);
  const textColor = surface.textPrimary;
  const isExtraSmall = size === 'extra-small';
  const isStandardCompact = size === 'small' || size === 'medium';
  const titleSize = isExtraSmall || isStandardCompact ? 'text-xs' : 'text-sm';
  const marginBottom = isExtraSmall ? 'mb-1' : isStandardCompact ? 'mb-2' : 'mb-2';
  const headerGap = isExtraSmall ? 'gap-2' : isStandardCompact ? 'gap-3' : 'gap-3';
  const subtitleMarginTop = isExtraSmall ? 'mt-0' : isStandardCompact ? 'mt-0.5' : 'mt-0.5';

  return (
    <div className={`flex items-start ${headerGap} ${marginBottom}`}>
      {leading}
      <div className="min-w-0 flex-1">
        <h3 className={`truncate font-semibold ${titleSize} ${textColor} ${titleClassName}`}>
          {title}
        </h3>
        <p
          className={`mt-0.5 truncate text-[10px] ${surface.textMuted} ${subtitleMarginTop} ${subtitleClassName}`}
        >
          {subtitle}
        </p>
      </div>
    </div>
  );
}
