import { ExternalLink, Server, Settings2 } from 'lucide-react';
import type { SettingsSectionController } from '../hooks/use-settings-section-controller';
import { SettingsItem, SettingsSectionShell } from './settings-section-shell';

interface SettingsSystemSectionProps {
  controller: SettingsSectionController;
}

export function SettingsSystemSection({ controller }: SettingsSystemSectionProps) {
  const { config, disableAnimations, handleResetConnection, styles, updateSettings } = controller;

  return (
    <SettingsSectionShell
      id="system"
      icon={Server}
      title="System"
      description="Performance controls and connection details for the current Home Assistant target."
      styles={styles}
    >
      <SettingsItem
        title="Disable animations"
        description="Useful for slower devices like Raspberry Pis. Turns off transitions and animated effects across the app."
        styles={styles}
      >
        <div className={`inline-flex rounded-full p-1 ${styles.softBg}`}>
          {[
            { value: false, label: 'Off' },
            { value: true, label: 'On' },
          ].map((option) => {
            const isActive = disableAnimations === option.value;
            return (
              <button
                type="button"
                key={option.label}
                onClick={() => updateSettings({ disableAnimations: option.value })}
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
        title="Connection"
        description="Review the current server target, open Home Assistant, or reset the saved connection."
        styles={styles}
      >
        <div className={`rounded-[24px] border px-5 py-4 ${styles.borderColor} ${styles.softBg}`}>
          <p className={`text-[11px] uppercase tracking-[0.18em] ${styles.subtleColor}`}>
            Connected to
          </p>
          <p className={`mt-2 break-all font-mono text-sm ${styles.textColor}`}>
            {config?.url || 'Not connected'}
          </p>
        </div>

        {config?.url ? (
          <div className="mt-4 flex flex-col gap-3 sm:flex-row">
            <a
              href={config.url}
              target="_blank"
              rel="noopener noreferrer"
              className={`inline-flex items-center justify-center gap-2 rounded-full px-5 py-3 text-sm font-medium transition-colors ${styles.softBg} ${styles.hoverBg} ${styles.textColor}`}
            >
              <ExternalLink className="h-4 w-4" />
              <span>Open Homeassistant</span>
            </a>

            <button
              type="button"
              onClick={handleResetConnection}
              className={`inline-flex items-center justify-center gap-2 rounded-full px-5 py-3 text-sm font-medium transition-colors ${styles.softBg} ${styles.hoverBg} ${styles.textColor}`}
            >
              <Settings2 className="h-4 w-4" />
              <span>Reset connection</span>
            </button>
          </div>
        ) : null}
      </SettingsItem>
    </SettingsSectionShell>
  );
}
