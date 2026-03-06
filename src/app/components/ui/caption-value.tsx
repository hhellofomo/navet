import { memo, ReactNode } from 'react';
import { useTheme } from '../../contexts/theme-context';

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
  valueClassName = ''
}: CaptionValueProps) {
  const { theme } = useTheme();
  const justifyClass = align === 'right' ? 'justify-end' : 'justify-start';
  const defaultCaptionColor = theme === 'light' ? 'text-gray-500' : 'text-gray-400';
  const defaultValueColor = theme === 'light' ? 'text-gray-900' : 'text-white';
  
  return (
    <div className={`flex items-center gap-3 ${justifyClass}`}>
      <span className={`text-xs ${defaultCaptionColor} ${captionClassName}`}>{caption}</span>
      <span className={`text-xs ${defaultValueColor} font-medium ${valueClassName}`}>{value}</span>
    </div>
  );
});