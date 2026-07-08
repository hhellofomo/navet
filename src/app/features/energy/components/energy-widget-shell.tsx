import type { ReactNode } from 'react';
import { getThemeSurfaceTokens } from '@/app/components/shared/theme/theme-surface-tokens';
import { useTheme } from '@/app/hooks';

interface EnergyWidgetShellProps {
  title: string;
  eyebrow?: string;
  action?: ReactNode;
  className?: string;
  children: ReactNode;
}

export function EnergyWidgetShell({
  title,
  eyebrow,
  action,
  className = '',
  children,
}: EnergyWidgetShellProps) {
  const { theme } = useTheme();
  const surface = getThemeSurfaceTokens(theme);

  return (
    <section
      className={`rounded-[28px] border p-5 md:p-6 ${surface.border} ${surface.panel} ${surface.cardShadow} ${className}`}
    >
      <div className="flex items-start justify-between gap-4">
        <div>
          {eyebrow ? (
            <div
              className={`text-[11px] font-semibold uppercase tracking-[0.18em] ${surface.textMuted}`}
            >
              {eyebrow}
            </div>
          ) : null}
          <h2 className={`mt-2 text-lg font-semibold tracking-tight ${surface.textPrimary}`}>
            {title}
          </h2>
        </div>
        {action}
      </div>
      <div className="mt-5">{children}</div>
    </section>
  );
}
