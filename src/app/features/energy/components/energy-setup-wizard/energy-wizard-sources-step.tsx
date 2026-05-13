import type { ReactNode } from 'react';
import { Badge } from '@/app/components/primitives/badge';
import { BaseCard } from '@/app/components/primitives/base-card';
import { Switch } from '@/app/components/primitives/switch';
import type { ThemeSurfaceTokens } from '@/app/components/shared/theme/theme-surface-tokens';
import type { TranslateFn } from '@/app/hooks';
import { EnergyEntityPicker } from './energy-entity-picker';
import type { EnergyEntityOption } from './energy-setup-wizard.types';

interface EnergyWizardSourcesStepProps {
  solarEnabled: boolean;
  batteryEnabled: boolean;
  solarPowerEntityId: string;
  solarEnergyEntityId: string;
  batterySocEntityId: string;
  batteryPowerEntityId: string;
  powerOptions: EnergyEntityOption[];
  energyStatOptions: EnergyEntityOption[];
  batteryOptions: EnergyEntityOption[];
  onSolarEnabledChange: (enabled: boolean) => void;
  onBatteryEnabledChange: (enabled: boolean) => void;
  onFieldChange: (
    field:
      | 'solarPowerEntityId'
      | 'solarEnergyEntityId'
      | 'batterySocEntityId'
      | 'batteryPowerEntityId',
    value: string
  ) => void;
  surface: ThemeSurfaceTokens;
  t: TranslateFn;
}

function SourceCard({
  title,
  description,
  checked,
  onCheckedChange,
  fields,
  surface,
}: {
  title: string;
  description: string;
  checked: boolean;
  onCheckedChange: (nextValue: boolean) => void;
  fields: ReactNode;
  surface: ThemeSurfaceTokens;
}) {
  return (
    <BaseCard size="small" surfaceVariant="muted" className="h-full">
      <div className="space-y-4">
        <div className="flex items-start justify-between gap-3">
          <div>
            <div className={`text-base font-semibold ${surface.textPrimary}`}>{title}</div>
            <p className={`mt-1 text-sm leading-6 ${surface.textMuted}`}>{description}</p>
          </div>
          <Switch
            checked={checked}
            onCheckedChange={onCheckedChange}
            aria-label={`Enable ${title}`}
          />
        </div>
        {checked ? fields : <Badge tone="neutral">Not enabled</Badge>}
      </div>
    </BaseCard>
  );
}

export function EnergyWizardSourcesStep({
  solarEnabled,
  batteryEnabled,
  solarPowerEntityId,
  solarEnergyEntityId,
  batterySocEntityId,
  batteryPowerEntityId,
  powerOptions,
  energyStatOptions,
  batteryOptions,
  onSolarEnabledChange,
  onBatteryEnabledChange,
  onFieldChange,
  surface,
  t,
}: EnergyWizardSourcesStepProps) {
  return (
    <div className="grid gap-4 xl:grid-cols-2">
      <SourceCard
        title="Solar"
        description="Add production and solar-today readings so the flow map and trend views can see generation clearly."
        checked={solarEnabled}
        onCheckedChange={onSolarEnabledChange}
        surface={surface}
        fields={
          <div className="space-y-4">
            <EnergyEntityPicker
              label={t('energy.setup.fields.solarPower.label')}
              hint={t('energy.setup.fields.solarPower.description')}
              placeholder="Search solar power"
              value={solarPowerEntityId}
              options={powerOptions}
              onChange={(value) => onFieldChange('solarPowerEntityId', value)}
              emptyMessage="No solar power sensors match."
            />
            <EnergyEntityPicker
              label={t('energy.setup.fields.solarEnergy.label')}
              hint={t('energy.setup.fields.solarEnergy.description')}
              placeholder="Search solar energy"
              value={solarEnergyEntityId}
              options={energyStatOptions}
              onChange={(value) => onFieldChange('solarEnergyEntityId', value)}
              emptyMessage="No solar energy statistics sensors match."
            />
          </div>
        }
      />

      <SourceCard
        title="Battery"
        description="Add battery state of charge and power to unlock storage context without forcing it into the essentials step."
        checked={batteryEnabled}
        onCheckedChange={onBatteryEnabledChange}
        surface={surface}
        fields={
          <div className="space-y-4">
            <EnergyEntityPicker
              label={t('energy.setup.fields.batterySoc.label')}
              hint={t('energy.setup.fields.batterySoc.description')}
              placeholder="Search battery charge"
              value={batterySocEntityId}
              options={batteryOptions}
              onChange={(value) => onFieldChange('batterySocEntityId', value)}
              emptyMessage="No battery charge sensors match."
            />
            <EnergyEntityPicker
              label={t('energy.setup.fields.batteryPower.label')}
              hint={t('energy.setup.fields.batteryPower.description')}
              placeholder="Search battery power"
              value={batteryPowerEntityId}
              options={powerOptions}
              onChange={(value) => onFieldChange('batteryPowerEntityId', value)}
              emptyMessage="No battery power sensors match."
            />
          </div>
        }
      />
    </div>
  );
}
