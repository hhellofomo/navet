import { ExternalLink, Server, Settings2 } from 'lucide-react';
import { useI18n } from '@/app/hooks';
import type { SettingsSectionController } from '../hooks/use-settings-section-controller';
import { SettingsItem, SettingsSectionShell } from './settings-section-shell';

interface SettingsSystemSectionProps {
  controller: SettingsSectionController;
}

export function SettingsSystemSection({ controller }: SettingsSystemSectionProps) {
  const { t } = useI18n();
  const { config, disableAnimations, handleResetConnection, lowPowerMode, styles, updateSettings } =
    controller;
  const reducedEffectsEnabled = disableAnimations || lowPowerMode;

  return (
    <SettingsSectionShell
      id="system"
      icon={Server}
      title={t('settings.system.sectionTitle')}
      description={t('settings.system.sectionDescription')}
      styles={styles}
    >
      <SettingsItem
        title={t('settings.system.lowPowerMode.title')}
        description={t('settings.system.lowPowerMode.description')}
        styles={styles}
      >
        <div
          className={`inline-flex rounded-full border p-1 ${styles.borderColor} ${styles.softBg}`}
        >
          {[
            { value: false, label: t('common.off') },
            { value: true, label: t('common.on') },
          ].map((option) => {
            const isActive = reducedEffectsEnabled === option.value;
            return (
              <button
                type="button"
                key={option.label}
                onClick={() =>
                  updateSettings({
                    disableAnimations: option.value,
                    lowPowerMode: option.value,
                  })
                }
                style={
                  isActive
                    ? {
                        backgroundColor: styles.accentColor,
                        color: '#ffffff',
                      }
                    : {
                        color: undefined,
                      }
                }
                className={`rounded-full px-5 py-2 text-sm font-medium transition-all ${
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
        title={t('settings.system.connection.title')}
        description={t('settings.system.connection.description')}
        styles={styles}
      >
        <div className={`rounded-[24px] border px-5 py-4 ${styles.borderColor} ${styles.softBg}`}>
          <p className={`text-[11px] uppercase tracking-[0.18em] ${styles.subtleColor}`}>
            {t('settings.system.connection.connectedTo')}
          </p>
          <p className={`mt-2 break-all font-mono text-sm ${styles.textColor}`}>
            {config?.url || t('settings.system.connection.notConnected')}
          </p>
        </div>

        {config?.url ? (
          <div className="mt-4 flex flex-col gap-3 sm:flex-row">
            <a
              href={config.url}
              target="_blank"
              rel="noopener noreferrer"
              className={`inline-flex items-center justify-center gap-2 rounded-full border px-5 py-3 text-sm font-medium transition-colors ${styles.borderColor} ${styles.softBg} ${styles.hoverBg} ${styles.textColor}`}
            >
              <ExternalLink className="h-4 w-4" />
              <span>{t('settings.system.connection.openHomeAssistant')}</span>
            </a>

            <button
              type="button"
              onClick={handleResetConnection}
              className={`inline-flex items-center justify-center gap-2 rounded-full border px-5 py-3 text-sm font-medium transition-colors ${styles.borderColor} ${styles.softBg} ${styles.hoverBg} ${styles.textColor}`}
            >
              <Settings2 className="h-4 w-4" />
              <span>{t('settings.system.connection.reset')}</span>
            </button>
          </div>
        ) : null}
      </SettingsItem>
    </SettingsSectionShell>
  );
}
