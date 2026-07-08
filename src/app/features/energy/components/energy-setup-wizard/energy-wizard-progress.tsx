import { Badge } from '@/app/components/primitives';
import { Panel } from '@/app/components/primitives/panel';
import { Stepper } from '@/app/components/primitives/stepper';
import type { ThemeSurfaceTokens } from '@/app/components/shared/theme/theme-surface-tokens';

interface EnergyWizardProgressProps {
  step: number;
  connected: boolean;
  surface: ThemeSurfaceTokens;
}

const STEP_ITEMS = [
  { id: 'essentials', label: 'Essentials' },
  { id: 'sources', label: 'Extra sources', optional: true },
  { id: 'devices', label: 'Device tracking', optional: true },
];

export function EnergyWizardProgress({ step, connected, surface }: EnergyWizardProgressProps) {
  return (
    <Panel muted className="border-b px-5 py-4 md:px-6 md:py-5" padded={false}>
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div className="min-w-0">
          <div
            className={`mb-2 text-xs font-semibold uppercase tracking-[0.18em] ${surface.textMuted}`}
          >
            Setup progress
          </div>
          <Stepper items={STEP_ITEMS} currentStep={step} />
        </div>

        <div className="flex flex-wrap items-center gap-2 lg:justify-end">
          <Badge tone="accent">
            Step {step + 1} of {STEP_ITEMS.length}
          </Badge>
          <Badge tone={connected ? 'success' : 'warning'}>
            {connected ? 'Connected' : 'Offline'}
          </Badge>
        </div>
      </div>
    </Panel>
  );
}
