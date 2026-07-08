import { Plus, Trash2 } from 'lucide-react';
import { FieldBlock } from '@/app/components/patterns/field-block';
import { Badge } from '@/app/components/primitives/badge';
import { BaseCard } from '@/app/components/primitives/base-card';
import { Button } from '@/app/components/primitives/button';
import { Panel } from '@/app/components/primitives/panel';
import { Select } from '@/app/components/primitives/select';
import type { ThemeSurfaceTokens } from '@/app/components/shared/theme/theme-surface-tokens';
import type { TranslateFn } from '@/app/hooks';
import type { EnergySourceConfig } from '../../types/energy.types';
import { EnergyEntityPicker } from './energy-entity-picker';
import {
  ENERGY_DEVICE_CATEGORY_OPTIONS,
  getEnergyCategoryLabel,
} from './energy-setup-wizard.helpers';
import type { EnergyEntityOption } from './energy-setup-wizard.types';

interface DeviceDraft {
  entityId: string;
  name: string;
  category: EnergySourceConfig['devices'][number]['category'];
  powerEntityId?: string;
}

interface EnergyWizardDevicesStepProps {
  devices: DeviceDraft[];
  pendingDeviceEntityId: string;
  energyStatOptions: EnergyEntityOption[];
  powerOptions: EnergyEntityOption[];
  onAddDevice: () => void;
  onRemoveDevice: (entityId: string) => void;
  onDeviceCategoryChange: (entityId: string, category: string) => void;
  onDevicePowerEntityChange: (entityId: string, powerEntityId: string | undefined) => void;
  onPendingDeviceChange: (entityId: string) => void;
  surface: ThemeSurfaceTokens;
  t: TranslateFn;
}

export function EnergyWizardDevicesStep({
  devices,
  pendingDeviceEntityId,
  energyStatOptions,
  powerOptions,
  onAddDevice,
  onRemoveDevice,
  onDeviceCategoryChange,
  onDevicePowerEntityChange,
  onPendingDeviceChange,
  surface,
  t,
}: EnergyWizardDevicesStepProps) {
  const pendingDeviceOption = energyStatOptions.find(
    (option) => option.value === pendingDeviceEntityId
  );

  return (
    <div className="space-y-5">
      <Panel muted className="space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <div className={`text-sm font-semibold ${surface.textPrimary}`}>
              Track important devices
            </div>
            <p className={`mt-1 text-xs leading-5 ${surface.textMuted}`}>
              Add daily energy entities first. You can attach a live power sensor afterward if you
              want the top-consumers view to feel more alive.
            </p>
          </div>
          <Badge tone="accent">{devices.length} devices</Badge>
        </div>

        <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_auto]">
          <EnergyEntityPicker
            label="Tracked device"
            hint="Pick the cumulative energy/statistics entity that represents the device."
            placeholder="Search device energy"
            value={pendingDeviceEntityId}
            options={energyStatOptions}
            onChange={onPendingDeviceChange}
            emptyMessage="No device energy sensors match."
          />
          <div className="flex items-end">
            <Button
              variant="secondary"
              leading={<Plus className="h-4 w-4" />}
              disabled={!pendingDeviceOption}
              onClick={onAddDevice}
            >
              Add device
            </Button>
          </div>
        </div>
      </Panel>

      {devices.length > 0 ? (
        <div className="grid gap-4">
          {devices.map((device) => (
            <BaseCard key={device.entityId} size="small" surfaceVariant="muted">
              <div className="space-y-4">
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <div className={`truncate text-base font-semibold ${surface.textPrimary}`}>
                      {device.name}
                    </div>
                    <div className={`truncate text-xs ${surface.textMuted}`}>{device.entityId}</div>
                  </div>
                  <Button
                    variant="ghost"
                    size="compact"
                    iconOnly
                    label={t('energy.setup.removeDevice')}
                    onClick={() => onRemoveDevice(device.entityId)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>

                <div className="grid gap-4 lg:grid-cols-2">
                  <FieldBlock
                    label="Category"
                    hint="Choose how this device should be grouped in the energy views."
                  >
                    <Select
                      value={device.category}
                      onChange={(event) =>
                        onDeviceCategoryChange(
                          device.entityId,
                          event.target.value as EnergySourceConfig['devices'][number]['category']
                        )
                      }
                      selectClassName={`${surface.border} ${surface.inputBg} ${surface.textPrimary}`}
                    >
                      {ENERGY_DEVICE_CATEGORY_OPTIONS.map((category) => (
                        <option key={category} value={category}>
                          {getEnergyCategoryLabel(category)}
                        </option>
                      ))}
                    </Select>
                  </FieldBlock>

                  <EnergyEntityPicker
                    label="Live power sensor"
                    hint="Optional. Attach a live power sensor to improve real-time device rankings."
                    placeholder="Search power sensor"
                    value={device.powerEntityId ?? ''}
                    options={powerOptions}
                    onChange={(value) => onDevicePowerEntityChange(device.entityId, value)}
                    emptyMessage="No power sensors match."
                  />
                </div>
                {device.powerEntityId ? (
                  <div className="flex justify-end">
                    <Button
                      variant="ghost"
                      size="compact"
                      onClick={() => onDevicePowerEntityChange(device.entityId, undefined)}
                    >
                      Clear power sensor
                    </Button>
                  </div>
                ) : null}
              </div>
            </BaseCard>
          ))}
        </div>
      ) : (
        <Panel muted className={`text-sm ${surface.textMuted}`}>
          No tracked devices yet. Add one when you want per-device energy cards and rankings.
        </Panel>
      )}
    </div>
  );
}
