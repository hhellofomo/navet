import { AlertCircle } from 'lucide-react';
import { Badge } from '@/app/components/primitives/badge';
import { Button } from '@/app/components/primitives/button';
import { Panel } from '@/app/components/primitives/panel';
import type { ThemeSurfaceTokens } from '@/app/components/shared/theme/theme-surface-tokens';
import type { TranslateFn } from '@/app/hooks';
import { EnergyEntityPicker } from './energy-entity-picker';
import type { EnergyEntityOption } from './energy-setup-wizard.types';

interface EnergyWizardEssentialsStepProps {
  connected: boolean;
  detecting: boolean;
  detectSuccess: boolean;
  detectError: string | null;
  homeLoadPowerEntityId: string;
  gridImportPowerEntityId: string;
  gridImportEnergyEntityId: string;
  powerOptions: EnergyEntityOption[];
  energyStatOptions: EnergyEntityOption[];
  onAutoDetect: () => void;
  onFieldChange: (
    field: 'homeLoadPowerEntityId' | 'gridImportPowerEntityId' | 'gridImportEnergyEntityId',
    value: string
  ) => void;
  surface: ThemeSurfaceTokens;
  t: TranslateFn;
}

export function EnergyWizardEssentialsStep({
  connected,
  detecting,
  detectSuccess,
  detectError,
  homeLoadPowerEntityId,
  gridImportPowerEntityId,
  gridImportEnergyEntityId,
  powerOptions,
  energyStatOptions,
  onAutoDetect,
  onFieldChange,
  surface,
  t,
}: EnergyWizardEssentialsStepProps) {
  return (
    <div className="space-y-8">
      <Panel className="space-y-4 px-5 py-5 md:px-6 md:py-6">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div className="max-w-2xl">
            <div className={`text-lg font-semibold ${surface.textPrimary}`}>
              Auto-detect from Home Assistant
            </div>
            <p className={`mt-2 text-sm leading-6 ${surface.textSecondary}`}>
              Pull in Home Assistant Energy preferences first, then review anything that still needs
              manual attention.
            </p>
          </div>
          <Button
            variant="primary"
            loading={detecting}
            disabled={!connected}
            onClick={onAutoDetect}
            className="lg:self-center"
          >
            Auto-detect
          </Button>
        </div>

        {detectSuccess ? <Badge tone="success">Filled from Home Assistant</Badge> : null}
        {detectError ? (
          <div className="flex items-start gap-2 text-sm text-rose-400">
            <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
            <span>{detectError}</span>
          </div>
        ) : null}
      </Panel>

      <section className="space-y-8">
        <div className="space-y-3">
          <div className={`text-xl font-semibold tracking-tight ${surface.textPrimary}`}>
            Essentials
          </div>
          <p className={`max-w-2xl text-sm leading-6 ${surface.textSecondary}`}>
            These three signals establish a reliable baseline for the energy dashboard and keep the
            first step calm.
          </p>
        </div>

        <div className="grid gap-4 lg:grid-cols-3">
          <EnergyEntityPicker
            label={t('energy.setup.fields.homeLoadPower.label')}
            hint={t('energy.setup.fields.homeLoadPower.description')}
            placeholder="Search current power"
            value={homeLoadPowerEntityId}
            options={powerOptions}
            onChange={(value) => onFieldChange('homeLoadPowerEntityId', value)}
            emptyMessage="No power sensors match."
          />
          <EnergyEntityPicker
            label={t('energy.setup.fields.gridImportPower.label')}
            hint={t('energy.setup.fields.gridImportPower.description')}
            placeholder="Search grid import"
            value={gridImportPowerEntityId}
            options={powerOptions}
            onChange={(value) => onFieldChange('gridImportPowerEntityId', value)}
            emptyMessage="No grid import sensors match."
          />
          <EnergyEntityPicker
            label={t('energy.setup.fields.gridImportEnergy.label')}
            hint={t('energy.setup.fields.gridImportEnergy.description')}
            placeholder="Search total consumed today"
            value={gridImportEnergyEntityId}
            options={energyStatOptions}
            onChange={(value) => onFieldChange('gridImportEnergyEntityId', value)}
            emptyMessage="No energy statistics sensors match."
          />
        </div>
      </section>
    </div>
  );
}
