import { Download, LayoutGrid, Scale, Upload } from 'lucide-react';
import { InteractionPreviewCard } from '@/app/components/shared/interaction-preview-card';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/app/components/ui/alert-dialog';
import { useI18n } from '@/app/hooks';
import type {
  SettingsInteractionOption,
  SettingsSectionController,
} from '../hooks/use-settings-section-controller';
import { SettingsItem, SettingsSectionShell } from './settings-section-shell';

interface SettingsDashboardSectionProps {
  controller: SettingsSectionController;
}

export function SettingsDashboardSection({ controller }: SettingsDashboardSectionProps) {
  const { t } = useI18n();
  const {
    entityInteractionMode,
    handleExportDashboardConfig,
    handleImportDashboardConfig,
    handleRestartOnboarding,
    hiddenEntityIds,
    importInputRef,
    setShowRestartOnboardingConfirm,
    setShowRevealAllConfirm,
    showAllEntities,
    showRestartOnboardingConfirm,
    showRevealAllConfirm,
    styles,
    updateSettings,
  } = controller;
  const interactionOptions: SettingsInteractionOption[] = [
    { value: 'toggle-first', label: t('settings.dashboard.interaction.toggleFirst') },
    { value: 'control-first', label: t('settings.dashboard.interaction.controlFirst') },
  ];

  return (
    <SettingsSectionShell
      id="dashboard"
      icon={LayoutGrid}
      title={t('settings.dashboard.sectionTitle')}
      description={t('settings.dashboard.sectionDescription')}
      styles={styles}
    >
      <SettingsItem
        title={t('settings.dashboard.entityVisibility.title')}
        description={t('settings.dashboard.entityVisibility.description')}
        styles={styles}
      >
        <div className="flex flex-wrap gap-3">
          <button
            type="button"
            onClick={() => setShowRevealAllConfirm(true)}
            disabled={hiddenEntityIds.length === 0}
            className={`inline-flex items-center justify-center gap-2 rounded-full px-5 py-3 text-sm font-medium transition-colors ${
              hiddenEntityIds.length === 0
                ? 'cursor-not-allowed opacity-50'
                : `border ${styles.borderColor} ${styles.softBg} ${styles.hoverBg} ${styles.textColor}`
            }`}
          >
            <LayoutGrid className="h-4 w-4" />
            <span>{t('settings.dashboard.entityVisibility.revealAll')}</span>
          </button>
          <button
            type="button"
            onClick={() => setShowRestartOnboardingConfirm(true)}
            className={`inline-flex items-center justify-center gap-2 rounded-full border px-5 py-3 text-sm font-medium transition-colors ${styles.borderColor} ${styles.softBg} ${styles.hoverBg} ${styles.textColor}`}
          >
            <Scale className="h-4 w-4" />
            <span>{t('settings.dashboard.entityVisibility.restartOnboarding')}</span>
          </button>
        </div>
        <p className={`mt-3 text-xs leading-relaxed ${styles.subtleColor}`}>
          {t('settings.dashboard.entityVisibility.hiddenSummary', {
            count: hiddenEntityIds.length,
          })}
        </p>

        <AlertDialog open={showRevealAllConfirm} onOpenChange={setShowRevealAllConfirm}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>{t('settings.dashboard.confirmReveal.title')}</AlertDialogTitle>
              <AlertDialogDescription>
                {t('settings.dashboard.confirmReveal.description')}
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>{t('common.cancel')}</AlertDialogCancel>
              <AlertDialogAction
                onClick={() => {
                  showAllEntities();
                  setShowRevealAllConfirm(false);
                }}
              >
                {t('settings.dashboard.confirmReveal.action')}
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>

        <AlertDialog
          open={showRestartOnboardingConfirm}
          onOpenChange={setShowRestartOnboardingConfirm}
        >
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>{t('settings.dashboard.confirmRestart.title')}</AlertDialogTitle>
              <AlertDialogDescription>
                {t('settings.dashboard.confirmRestart.description')}
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>{t('common.cancel')}</AlertDialogCancel>
              <AlertDialogAction onClick={handleRestartOnboarding}>
                {t('common.restart')}
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </SettingsItem>

      <SettingsItem
        title={t('settings.dashboard.interaction.title')}
        description={t('settings.dashboard.interaction.description')}
        styles={styles}
      >
        <div className="grid items-start gap-5 xl:grid-cols-[minmax(0,1fr)_20rem]">
          <div
            className={`inline-flex w-fit rounded-full border p-1 ${styles.borderColor} ${styles.softBg}`}
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

          <InteractionPreviewCard
            mode={entityInteractionMode}
            accentColor={styles.accentColor}
            theme={controller.theme}
          />
        </div>
      </SettingsItem>

      <SettingsItem
        title={t('settings.dashboard.backup.title')}
        description={t('settings.dashboard.backup.description')}
        styles={styles}
      >
        <p className={`max-w-2xl text-sm leading-relaxed ${styles.subtleColor}`}>
          {t('settings.dashboard.backup.body')}
        </p>

        <div className="mt-5 flex flex-col gap-3 sm:flex-row">
          <button
            type="button"
            onClick={handleExportDashboardConfig}
            className={`inline-flex items-center justify-center gap-2 rounded-full border px-5 py-3 text-sm font-medium transition-colors ${styles.borderColor} ${styles.softBg} ${styles.hoverBg} ${styles.textColor}`}
          >
            <Download className="h-4 w-4" />
            <span>{t('settings.dashboard.backup.export')}</span>
          </button>
          <button
            type="button"
            onClick={() => importInputRef.current?.click()}
            className={`inline-flex items-center justify-center gap-2 rounded-full border px-5 py-3 text-sm font-medium transition-colors ${styles.borderColor} ${styles.softBg} ${styles.hoverBg} ${styles.textColor}`}
          >
            <Upload className="h-4 w-4" />
            <span>{t('settings.dashboard.backup.import')}</span>
          </button>
          <input
            ref={importInputRef}
            type="file"
            accept=".yaml,.yml,application/yaml,text/yaml"
            className="hidden"
            onChange={handleImportDashboardConfig}
          />
        </div>
      </SettingsItem>
    </SettingsSectionShell>
  );
}
