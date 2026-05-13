import { useMemo, useState } from 'react';
import { Panel } from '@/app/components/primitives/panel';
import { getThemeSurfaceTokens } from '@/app/components/shared/theme/theme-surface-tokens';
import { useHomeAssistant, useI18n, useTheme } from '@/app/hooks';
import { homeAssistantService } from '@/app/services/home-assistant.service';
import { homeAssistantSelectors } from '@/app/stores/selectors';
import { useEnergyEntityOptions } from '../../hooks/use-energy-entity-options';
import { getEnergyPrefs, mapPrefsToConfig } from '../../services/energy-ha-service';
import type { EnergySourceConfig } from '../../types/energy.types';
import {
  buildConfigFromDraft,
  createEnergySetupDraft,
  hasCompleteEssentials,
  mergeDetectedConfigIntoDraft,
  scoreEnergySetupDraft,
} from './energy-setup-wizard.helpers';
import { EnergyWizardDevicesStep } from './energy-wizard-devices-step';
import { EnergyWizardEssentialsStep } from './energy-wizard-essentials-step';
import { EnergyWizardFooter } from './energy-wizard-footer';
import { EnergyWizardHero } from './energy-wizard-hero';
import { EnergyWizardProgress } from './energy-wizard-progress';
import { EnergyWizardQualityCard } from './energy-wizard-quality-card';
import { EnergyWizardSourcesStep } from './energy-wizard-sources-step';

interface EnergySetupWizardProps {
  initialConfig?: EnergySourceConfig;
  onSave: (config: EnergySourceConfig) => void;
  onCancel?: () => void;
}

const TOTAL_STEPS = 3;

export function EnergySetupWizard({ initialConfig, onSave, onCancel }: EnergySetupWizardProps) {
  const { t } = useI18n();
  const { theme, accentColor } = useTheme();
  const surface = getThemeSurfaceTokens(theme);
  const connected = useHomeAssistant(homeAssistantSelectors.connected);
  const { powerOptions, energyStatOptions, batteryOptions } = useEnergyEntityOptions();

  const [step, setStep] = useState(0);
  const [draft, setDraft] = useState(() => createEnergySetupDraft(initialConfig));
  const [detecting, setDetecting] = useState(false);
  const [detectError, setDetectError] = useState<string | null>(null);
  const [detectSuccess, setDetectSuccess] = useState(false);
  const [pendingDeviceEntityId, setPendingDeviceEntityId] = useState('');

  const quality = useMemo(() => scoreEnergySetupDraft(draft), [draft]);
  const essentialsComplete = useMemo(() => hasCompleteEssentials(draft), [draft]);

  const setField = (key: keyof typeof draft.fields, value: string) => {
    setDraft((previousDraft) => ({
      ...previousDraft,
      fields: {
        ...previousDraft.fields,
        [key]: value,
      },
    }));
  };

  const setDeviceField = (
    entityId: string,
    key: 'category' | 'powerEntityId',
    value: string | undefined
  ) => {
    setDraft((previousDraft) => ({
      ...previousDraft,
      devices: previousDraft.devices.map((device) =>
        device.entityId === entityId ? { ...device, [key]: value } : device
      ),
    }));
  };

  const removeDevice = (entityId: string) => {
    setDraft((previousDraft) => ({
      ...previousDraft,
      devices: previousDraft.devices.filter((device) => device.entityId !== entityId),
    }));
  };

  const addDevice = () => {
    const pendingDeviceOption = energyStatOptions.find(
      (option) => option.value === pendingDeviceEntityId
    );
    if (!pendingDeviceOption) {
      return;
    }

    setDraft((previousDraft) => {
      if (previousDraft.devices.some((device) => device.entityId === pendingDeviceOption.value)) {
        return previousDraft;
      }

      return {
        ...previousDraft,
        devices: [
          ...previousDraft.devices,
          {
            entityId: pendingDeviceOption.value,
            name: pendingDeviceOption.label,
            category: 'other',
          },
        ],
      };
    });
    setPendingDeviceEntityId('');
  };

  const handleAutoDetect = async () => {
    const liveConnection = homeAssistantService.getConnection();
    if (!liveConnection) {
      setDetectError(t('energy.setup.errors.notConnected'));
      setDetectSuccess(false);
      return;
    }

    setDetecting(true);
    setDetectError(null);
    setDetectSuccess(false);

    try {
      const prefs = await getEnergyPrefs(liveConnection);
      const mapped = mapPrefsToConfig(prefs);
      setDraft((previousDraft) => mergeDetectedConfigIntoDraft(previousDraft, mapped));
      setDetectSuccess(true);
    } catch (error) {
      const detail =
        error instanceof Error && error.message.trim().length > 0 ? error.message : String(error);
      setDetectError(t('energy.setup.errors.autoDetectFailed', { detail }));
    } finally {
      setDetecting(false);
    }
  };

  const handleSave = () => {
    onSave(buildConfigFromDraft(draft));
  };

  const handleContinue = () => {
    setStep((previousStep) => previousStep + 1);
  };

  const handleBack = () => {
    setStep((previousStep) => previousStep - 1);
  };

  return (
    <section className="mx-auto w-full max-w-7xl space-y-8">
      <EnergyWizardProgress step={step} connected={connected} surface={surface} />

      <div className="grid gap-8 xl:grid-cols-[minmax(0,1fr)_20rem] xl:items-start">
        <Panel
          as="article"
          className={`mx-auto w-full max-w-5xl shadow-[0_24px_70px_rgba(0,0,0,0.16)]`}
          padded={false}
        >
          <div className="space-y-12 px-6 py-8 md:px-10 md:py-10">
            <EnergyWizardHero accentColor={accentColor} surface={surface} />

            <div className="xl:hidden">
              <EnergyWizardQualityCard
                qualityScore={quality.score}
                qualityLabel={quality.label}
                qualityTone={quality.tone}
                accentColor={accentColor}
                surface={surface}
              />
            </div>

            <div className="space-y-12">
              {step === 0 ? (
                <EnergyWizardEssentialsStep
                  connected={connected}
                  detecting={detecting}
                  detectSuccess={detectSuccess}
                  detectError={detectError}
                  homeLoadPowerEntityId={draft.fields.homeLoadPowerEntityId ?? ''}
                  gridImportPowerEntityId={draft.fields.gridImportPowerEntityId ?? ''}
                  gridImportEnergyEntityId={draft.fields.gridImportEnergyEntityId ?? ''}
                  powerOptions={powerOptions}
                  energyStatOptions={energyStatOptions}
                  onAutoDetect={handleAutoDetect}
                  onFieldChange={setField}
                  surface={surface}
                  t={t}
                />
              ) : step === 1 ? (
                <EnergyWizardSourcesStep
                  solarEnabled={draft.solarEnabled}
                  batteryEnabled={draft.batteryEnabled}
                  solarPowerEntityId={draft.fields.solarPowerEntityId ?? ''}
                  solarEnergyEntityId={draft.fields.solarEnergyEntityId ?? ''}
                  batterySocEntityId={draft.fields.batterySocEntityId ?? ''}
                  batteryPowerEntityId={draft.fields.batteryPowerEntityId ?? ''}
                  powerOptions={powerOptions}
                  energyStatOptions={energyStatOptions}
                  batteryOptions={batteryOptions}
                  onSolarEnabledChange={(enabled) =>
                    setDraft((previousDraft) => ({ ...previousDraft, solarEnabled: enabled }))
                  }
                  onBatteryEnabledChange={(enabled) =>
                    setDraft((previousDraft) => ({ ...previousDraft, batteryEnabled: enabled }))
                  }
                  onFieldChange={setField}
                  surface={surface}
                  t={t}
                />
              ) : (
                <EnergyWizardDevicesStep
                  devices={draft.devices}
                  pendingDeviceEntityId={pendingDeviceEntityId}
                  energyStatOptions={energyStatOptions}
                  powerOptions={powerOptions}
                  onAddDevice={addDevice}
                  onRemoveDevice={removeDevice}
                  onDeviceCategoryChange={(entityId, category) =>
                    setDeviceField(entityId, 'category', category)
                  }
                  onDevicePowerEntityChange={(entityId, powerEntityId) =>
                    setDeviceField(entityId, 'powerEntityId', powerEntityId)
                  }
                  onPendingDeviceChange={setPendingDeviceEntityId}
                  surface={surface}
                  t={t}
                />
              )}
            </div>
          </div>

          <EnergyWizardFooter
            step={step}
            totalSteps={TOTAL_STEPS}
            essentialsComplete={essentialsComplete}
            isSaving={false}
            onBack={handleBack}
            onContinue={handleContinue}
            onSave={handleSave}
            onCancel={onCancel}
            surface={surface}
            t={t}
          />
        </Panel>

        <aside className="hidden xl:block xl:pt-24">
          <div className="sticky top-6">
            <EnergyWizardQualityCard
              qualityScore={quality.score}
              qualityLabel={quality.label}
              qualityTone={quality.tone}
              accentColor={accentColor}
              surface={surface}
            />
          </div>
        </aside>
      </div>
    </section>
  );
}
