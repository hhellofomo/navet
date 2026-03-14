'use client';

import * as SwitchPrimitive from '@radix-ui/react-switch';
import type * as React from 'react';
import { getThemeColorValue } from '@/app/components/shared/theme/theme-colors';
import { useTheme } from '@/app/hooks';

import { cn } from './utils';

function Switch({ className, ...props }: React.ComponentProps<typeof SwitchPrimitive.Root>) {
  const { primaryColor } = useTheme();
  const accentColor = getThemeColorValue(primaryColor);

  return (
    <SwitchPrimitive.Root
      data-slot="switch"
      className={cn(
        'peer data-[state=checked]:bg-[var(--switch-checked-bg)] data-[state=checked]:shadow-[0_0_0_1px_var(--switch-checked-bg)] data-[state=unchecked]:bg-switch-background focus-visible:ring-[3px] focus-visible:ring-[var(--switch-focus-ring)] dark:data-[state=unchecked]:bg-input/80 inline-flex h-[1.15rem] w-8 shrink-0 items-center rounded-full border border-transparent transition-all outline-none disabled:cursor-not-allowed disabled:opacity-50',
        className
      )}
      style={{
        ['--switch-checked-bg' as string]: accentColor,
        ['--switch-focus-ring' as string]: `${accentColor}33`,
      }}
      {...props}
    >
      <SwitchPrimitive.Thumb
        data-slot="switch-thumb"
        className={cn(
          'bg-card dark:data-[state=unchecked]:bg-card-foreground dark:data-[state=checked]:bg-primary-foreground pointer-events-none block size-4 rounded-full ring-0 shadow-sm transition-transform data-[state=checked]:translate-x-[calc(100%-2px)] data-[state=unchecked]:translate-x-0'
        )}
      />
    </SwitchPrimitive.Root>
  );
}

export { Switch };
