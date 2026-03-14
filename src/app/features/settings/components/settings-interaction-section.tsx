import { Hand } from 'lucide-react';
import { InteractionPreviewCard } from '@/app/components/shared/interaction-preview-card';
import { useI18n } from '@/app/hooks';
import type {
  SettingsInteractionOption,
  SettingsSectionController,
} from '../hooks/use-settings-section-controller';
import { SettingsItem, SettingsSectionShell } from './settings-section-shell';

interface SettingsInteractionSectionProps {
  controller: SettingsSectionController;
}

export function SettingsInteractionSection({ controller }: SettingsInteractionSectionProps) {
  const { t } = useI18n();
  const { entityInteractionMode, styles, theme, updateSettings } = controller;
  const interactionOptions: SettingsInteractionOption[] = [
    { value: 'toggle-first', label: t('settings.dashboard.interaction.toggleFirst') },
    { value: 'control-first', label: t('settings.dashboard.interaction.controlFirst') },
  ];

  return (
    <SettingsSectionShell
      id="interaction"
      icon={Hand}
      title={t('settings.interaction.sectionTitle')}
      description={t('settings.interaction.sectionDescription')}
      styles={styles}
    >
      <SettingsItem
        title={t('settings.interaction.cardBehavior.title')}
        description={t('settings.interaction.cardBehavior.description')}
        styles={styles}
      >
        <div className="grid items-start gap-4 md:gap-5 xl:grid-cols-[minmax(0,1fr)_20rem]">
          <div
            className={`inline-flex w-fit flex-wrap rounded-full border p-1 ${styles.borderColor} ${styles.softBg}`}
          >
            {interactionOptions.map((option) => {
              const isActive = entityInteractionMode === option.value;
              return (
                <button
                  type="button"
                  key={option.value}
                  onClick={() => updateSettings({ entityInteractionMode: option.value })}
                  style={
                    isActive
                      ? {
                          backgroundColor: styles.accentColor,
                          color: '#ffffff',
                        }
                      : undefined
                  }
                  className={`rounded-full px-4 py-2 text-sm font-medium transition-all md:px-5 ${
                    isActive ? 'shadow-sm' : styles.chipTextColor
                  }`}
                  aria-pressed={isActive}
                >
                  {option.label}
                </button>
              );
            })}
          </div>

          <div className="hidden md:block">
            <InteractionPreviewCard
              mode={entityInteractionMode}
              accentColor={styles.accentColor}
              theme={theme}
            />
          </div>
        </div>
      </SettingsItem>
    </SettingsSectionShell>
  );
}
