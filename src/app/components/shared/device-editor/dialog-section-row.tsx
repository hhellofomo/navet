import { memo, type ReactNode } from 'react';
import { getThemeSurfaceTokens } from '@/app/components/shared/theme/theme-surface-tokens';
import { useTheme } from '@/app/hooks';

interface DialogSectionRowProps {
  children: ReactNode;
  className?: string;
  label?: string;
}

export const DialogSectionRow = memo(function DialogSectionRow({
  children,
  className = '',
  label,
}: DialogSectionRowProps) {
  const { theme } = useTheme();
  const surface = getThemeSurfaceTokens(theme);

  return (
    <div className={`mb-5 min-w-0 ${className}`}>
      {label ? (
        <div
          className={`mb-2 text-[11px] font-medium uppercase tracking-[0.14em] ${surface.textMuted}`}
        >
          {label}
        </div>
      ) : null}
      {children}
    </div>
  );
});
