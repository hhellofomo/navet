import { Sparkles } from 'lucide-react';
import { Badge } from '@/app/components/primitives/badge';
import { Panel } from '@/app/components/primitives/panel';
import type { ThemeSurfaceTokens } from '@/app/components/shared/theme/theme-surface-tokens';
import { EnergyQualityBar } from '../charts/energy-quality-bar';

interface EnergyWizardQualityCardProps {
  qualityScore: number;
  qualityLabel: string;
  qualityTone: 'success' | 'warning' | 'danger' | 'neutral' | 'accent';
  accentColor: string;
  surface: ThemeSurfaceTokens;
  className?: string;
}

export function EnergyWizardQualityCard({
  qualityScore,
  qualityLabel,
  qualityTone,
  accentColor,
  surface,
  className = '',
}: EnergyWizardQualityCardProps) {
  return (
    <Panel muted className={`space-y-4 ${className}`}>
      <div className="flex items-start justify-between gap-3">
        <div>
          <div className={`text-lg font-semibold ${surface.textPrimary}`}>
            Configuration quality
          </div>
          <div className={`mt-1 text-sm ${surface.textSecondary}`}>{qualityScore}% confidence</div>
        </div>
        <Sparkles className={`mt-1 h-4 w-4 ${surface.textMuted}`} />
      </div>
      <Badge tone={qualityTone}>{qualityLabel}</Badge>
      <EnergyQualityBar value={qualityScore} accentColor={accentColor} label="quality score" />
    </Panel>
  );
}
