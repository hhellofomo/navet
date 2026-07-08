import { memo, type ReactNode } from 'react';
import { getThemeSurfaceTokens } from '@/app/components/shared/theme/theme-surface-tokens';
import { useTheme } from '@/app/hooks';

interface CaptionValueProps {
  caption: string;
  value: string | number | ReactNode;
  align?: 'left' | 'right';
  captionClassName?: string;
  valueClassName?: string;
}

/**
 * CaptionValue Component
 * Canonical pattern for displaying label/value data pairs
 * Uses design system typography: text-xs for both, font-medium for values
 */
export const CaptionValue = memo(function CaptionValue({
  caption,
  value,
  align = 'left',
  captionClassName = '',
  valueClassName = '',
}: CaptionValueProps) {
  const { theme } = useTheme();
  const surface = getThemeSurfaceTokens(theme);
  const justifyClass = align === 'right' ? 'justify-end' : 'justify-start';
  const defaultCaptionColor = surface.textSubtle;
  const defaultValueColor = surface.textPrimary;

  return (
    <div className={`flex items-center gap-3 ${justifyClass}`}>
      <span className={`text-xs ${defaultCaptionColor} ${captionClassName}`}>{caption}</span>
      <span className={`text-xs ${defaultValueColor} font-medium ${valueClassName}`}>{value}</span>
    </div>
  );
});
