import { Zap } from 'lucide-react';
import type { ThemeSurfaceTokens } from '@/app/components/shared/theme/theme-surface-tokens';

interface EnergyWizardHeroProps {
  accentColor: string;
  surface: ThemeSurfaceTokens;
}

export function EnergyWizardHero({ accentColor, surface }: EnergyWizardHeroProps) {
  return (
    <div className="space-y-4">
      <div
        className="flex h-12 w-12 items-center justify-center rounded-2xl"
        style={{ backgroundColor: `${accentColor}20`, color: accentColor }}
      >
        <Zap className="h-5 w-5" />
      </div>
      <div>
        <div className={`text-xs font-semibold uppercase tracking-[0.18em] ${surface.textMuted}`}>
          Energy
        </div>
        <h2
          className={`mt-3 text-3xl font-semibold tracking-tight md:text-4xl ${surface.textPrimary}`}
        >
          Set up energy with less noise.
        </h2>
        <p className={`mt-4 max-w-2xl text-sm leading-6 md:text-base ${surface.textSecondary}`}>
          Start with the three signals that make the dashboard useful, then add richer sources and
          tracked devices only if you want them.
        </p>
      </div>
    </div>
  );
}
