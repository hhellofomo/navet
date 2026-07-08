import type * as React from 'react';
import { DropdownMenuContent, DropdownMenuSubContent } from '@/app/components/ui/dropdown-menu';
import { cn } from '@/app/components/ui/utils';
import type { ThemeType } from '@/app/hooks/use-theme';
import { getThemeDropdownSurfaceClasses } from './theme/dropdown-surface-tokens';

interface ThemeDropdownContentProps extends React.ComponentProps<typeof DropdownMenuContent> {
  theme: ThemeType;
}

export function ThemeDropdownContent({
  theme,
  className,
  sideOffset = 8,
  ...props
}: ThemeDropdownContentProps) {
  return (
    <DropdownMenuContent
      sideOffset={sideOffset}
      className={cn(getThemeDropdownSurfaceClasses(theme), 'overflow-visible p-2', className)}
      {...props}
    />
  );
}

interface ThemeDropdownSubContentProps extends React.ComponentProps<typeof DropdownMenuSubContent> {
  theme: ThemeType;
}

export function ThemeDropdownSubContent({
  theme,
  className,
  ...props
}: ThemeDropdownSubContentProps) {
  return (
    <DropdownMenuSubContent
      className={cn(getThemeDropdownSurfaceClasses(theme), 'overflow-visible p-2', className)}
      {...props}
    />
  );
}
