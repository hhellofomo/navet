import { Languages } from 'lucide-react';
import { useI18n } from '@/app/hooks';
import type { SettingsSectionController } from '../hooks/use-settings-section-controller';
import { SettingsItem, SettingsSectionShell } from './settings-section-shell';

interface SettingsLocalizationSectionProps {
  controller: SettingsSectionController;
}

export function SettingsLocalizationSection({ controller }: SettingsLocalizationSectionProps) {
  const { t } = useI18n();
  const { language, languageOptions, styles, updateSettings, use24HourTime, temperatureUnit } =
    controller;

  return (
    <SettingsSectionShell
      id="localization"
      icon={Languages}
      title={t('settings.localization.sectionTitle')}
      description={t('settings.localization.sectionDescription')}
      styles={styles}
    >
      <SettingsItem
        title={t('settings.localization.language.title')}
        description={t('settings.localization.language.description')}
        styles={styles}
      >
        <div className="flex flex-wrap gap-2.5 md:gap-3">
          {languageOptions.map((option) => {
            const isActive = language === option.value;
            return (
              <button
                type="button"
                key={option.value}
                onClick={() => updateSettings({ language: option.value })}
                style={
                  isActive
                    ? {
                        backgroundColor: styles.accentColor,
                        color: '#ffffff',
                      }
                    : undefined
                }
                className={`rounded-full border px-4 py-2.5 text-sm font-medium transition-all md:px-5 md:py-3 ${styles.borderColor} ${
                  isActive
                    ? 'shadow-sm'
                    : `${styles.softBg} ${styles.chipTextColor} ${styles.hoverBg}`
                }`}
                aria-pressed={isActive}
              >
                {option.label}
              </button>
            );
          })}
        </div>
      </SettingsItem>

      <SettingsItem
        title={t('settings.localization.timeFormat.title')}
        description={t('settings.localization.timeFormat.description')}
        styles={styles}
      >
        <div
          className={`inline-flex flex-wrap rounded-full border p-1 ${styles.borderColor} ${styles.softBg}`}
        >
          {[
            { value: false, label: t('settings.localization.timeFormat.twelveHour') },
            { value: true, label: t('settings.localization.timeFormat.twentyFourHour') },
          ].map((option) => {
            const isActive = use24HourTime === option.value;
            return (
              <button
                type="button"
                key={option.label}
                onClick={() => updateSettings({ use24HourTime: option.value })}
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
      </SettingsItem>

      <SettingsItem
        title={t('settings.localization.temperatureUnit.title')}
        description={t('settings.localization.temperatureUnit.description')}
        styles={styles}
      >
        <div
          className={`inline-flex flex-wrap rounded-full border p-1 ${styles.borderColor} ${styles.softBg}`}
        >
          {[
            {
              value: 'fahrenheit' as const,
              label: t('settings.localization.temperatureUnit.fahrenheit'),
            },
            {
              value: 'celsius' as const,
              label: t('settings.localization.temperatureUnit.celsius'),
            },
          ].map((option) => {
            const isActive = temperatureUnit === option.value;
            return (
              <button
                type="button"
                key={option.value}
                onClick={() => updateSettings({ temperatureUnit: option.value })}
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
      </SettingsItem>
    </SettingsSectionShell>
  );
}
