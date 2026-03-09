'use client';

import * as AlertDialogPrimitive from '@radix-ui/react-alert-dialog';
import type * as React from 'react';
import { getThemeColorValue } from '@/app/components/shared/theme/theme-colors';
import { useTheme } from '@/app/hooks';
import { cn } from './utils';

function AlertDialog({ ...props }: React.ComponentProps<typeof AlertDialogPrimitive.Root>) {
  return <AlertDialogPrimitive.Root data-slot="alert-dialog" {...props} />;
}

function AlertDialogTrigger({
  ...props
}: React.ComponentProps<typeof AlertDialogPrimitive.Trigger>) {
  return <AlertDialogPrimitive.Trigger data-slot="alert-dialog-trigger" {...props} />;
}

function AlertDialogPortal({ ...props }: React.ComponentProps<typeof AlertDialogPrimitive.Portal>) {
  return <AlertDialogPrimitive.Portal data-slot="alert-dialog-portal" {...props} />;
}

function AlertDialogOverlay({
  className,
  ...props
}: React.ComponentProps<typeof AlertDialogPrimitive.Overlay>) {
  return (
    <AlertDialogPrimitive.Overlay
      data-slot="alert-dialog-overlay"
      className={cn(
        'data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 fixed inset-0 z-50 bg-black/55 backdrop-blur-sm',
        className
      )}
      {...props}
    />
  );
}

function AlertDialogContent({
  className,
  ...props
}: React.ComponentProps<typeof AlertDialogPrimitive.Content>) {
  const { theme, primaryColor } = useTheme();
  const accentColor = getThemeColorValue(primaryColor);
  const surfaceClass =
    theme === 'light' ? 'border-gray-200/80 text-gray-900' : 'border-white/10 text-white';
  const background =
    theme === 'light'
      ? `linear-gradient(180deg, rgba(255,255,255,0.96) 0%, rgba(255,255,255,0.92) 72%, ${accentColor}10 100%)`
      : `linear-gradient(180deg, rgba(18,18,20,0.96) 0%, rgba(12,12,14,0.94) 72%, ${accentColor}14 100%)`;

  return (
    <AlertDialogPortal>
      <AlertDialogOverlay />
      <AlertDialogPrimitive.Content
        data-slot="alert-dialog-content"
        className={cn(
          'data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 fixed top-[50%] left-[50%] z-50 grid w-full max-w-[calc(100%-2rem)] translate-x-[-50%] translate-y-[-50%] gap-5 rounded-[32px] border p-6 shadow-2xl backdrop-blur-xl duration-200 sm:max-w-lg sm:p-8',
          surfaceClass,
          className
        )}
        style={{ background }}
        {...props}
      />
    </AlertDialogPortal>
  );
}

function AlertDialogHeader({ className, ...props }: React.ComponentProps<'div'>) {
  return (
    <div
      data-slot="alert-dialog-header"
      className={cn('flex flex-col gap-2 text-center sm:text-left', className)}
      {...props}
    />
  );
}

function AlertDialogFooter({ className, ...props }: React.ComponentProps<'div'>) {
  return (
    <div
      data-slot="alert-dialog-footer"
      className={cn('flex flex-col-reverse gap-2 pt-1 sm:flex-row sm:justify-end', className)}
      {...props}
    />
  );
}

function AlertDialogTitle({
  className,
  ...props
}: React.ComponentProps<typeof AlertDialogPrimitive.Title>) {
  return (
    <AlertDialogPrimitive.Title
      data-slot="alert-dialog-title"
      className={cn('text-xl font-semibold tracking-tight', className)}
      {...props}
    />
  );
}

function AlertDialogDescription({
  className,
  ...props
}: React.ComponentProps<typeof AlertDialogPrimitive.Description>) {
  const { theme } = useTheme();
  return (
    <AlertDialogPrimitive.Description
      data-slot="alert-dialog-description"
      className={cn(
        'text-sm leading-relaxed',
        theme === 'light' ? 'text-gray-600' : 'text-gray-300',
        className
      )}
      {...props}
    />
  );
}

function AlertDialogAction({
  className,
  ...props
}: React.ComponentProps<typeof AlertDialogPrimitive.Action>) {
  const { primaryColor } = useTheme();
  const accentColor = getThemeColorValue(primaryColor);
  return (
    <AlertDialogPrimitive.Action
      className={cn(
        'inline-flex h-10 items-center justify-center gap-2 rounded-full border-0 px-5 text-sm font-medium text-white shadow-sm transition-all hover:brightness-110 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-transparent',
        className
      )}
      style={{ backgroundColor: accentColor }}
      {...props}
    />
  );
}

function AlertDialogCancel({
  className,
  ...props
}: React.ComponentProps<typeof AlertDialogPrimitive.Cancel>) {
  const { theme } = useTheme();
  const cancelClass =
    theme === 'light'
      ? 'border-gray-200/80 bg-gray-100 text-gray-900 hover:bg-gray-200'
      : 'border-white/10 bg-white/5 text-white hover:bg-white/10';

  return (
    <AlertDialogPrimitive.Cancel
      className={cn(
        'inline-flex h-10 items-center justify-center gap-2 rounded-full border px-5 text-sm font-medium transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-transparent',
        cancelClass,
        className
      )}
      {...props}
    />
  );
}

export {
  AlertDialog,
  AlertDialogPortal,
  AlertDialogOverlay,
  AlertDialogTrigger,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogFooter,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogAction,
  AlertDialogCancel,
};
