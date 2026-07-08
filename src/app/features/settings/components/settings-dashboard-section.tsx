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
import type {
  SettingsInteractionOption,
  SettingsSectionController,
} from '../hooks/use-settings-section-controller';
import { SettingsItem, SettingsSectionShell } from './settings-section-shell';

const INTERACTION_OPTIONS: SettingsInteractionOption[] = [
  { value: 'toggle-first', label: 'Tap toggles' },
  { value: 'control-first', label: 'Tap opens controls' },
];

interface SettingsDashboardSectionProps {
  controller: SettingsSectionController;
}

export function SettingsDashboardSection({ controller }: SettingsDashboardSectionProps) {
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

  return (
    <SettingsSectionShell
      id="dashboard"
      icon={LayoutGrid}
      title="Dashboard"
      description="Decide what shows up on the board and how this local setup is backed up."
      styles={styles}
    >
      <SettingsItem
        title="Entity visibility"
        description="Navet now uses one visibility model. Remove entities from edit mode, then add them back later from Add Entity."
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
                : `${styles.softBg} ${styles.hoverBg} ${styles.textColor}`
            }`}
          >
            <LayoutGrid className="h-4 w-4" />
            <span>Add all removed entities</span>
          </button>
          <button
            type="button"
            onClick={() => setShowRestartOnboardingConfirm(true)}
            className={`inline-flex items-center justify-center gap-2 rounded-full px-5 py-3 text-sm font-medium transition-colors ${styles.softBg} ${styles.hoverBg} ${styles.textColor}`}
          >
            <Scale className="h-4 w-4" />
            <span>Restart onboarding</span>
          </button>
        </div>
        <p className={`mt-3 text-xs leading-relaxed ${styles.subtleColor}`}>
          Hidden right now: {hiddenEntityIds.length}. Restart onboarding if you want to choose
          between starting full or blank again.
        </p>

        <AlertDialog open={showRevealAllConfirm} onOpenChange={setShowRevealAllConfirm}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Add all removed entities back?</AlertDialogTitle>
              <AlertDialogDescription>
                This will put every currently removed entity back onto the dashboard at once.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction
                onClick={() => {
                  showAllEntities();
                  setShowRevealAllConfirm(false);
                }}
              >
                Add All
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
              <AlertDialogTitle>Restart onboarding?</AlertDialogTitle>
              <AlertDialogDescription>
                This will reopen the startup wizard so you can choose whether to begin with all
                entities, a blank dashboard, or import a config file.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction onClick={handleRestartOnboarding}>Restart</AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </SettingsItem>

      <SettingsItem
        title="Card interaction style"
        description="Choose whether tapping the card should toggle the device right away or open its controls first."
        styles={styles}
      >
        <div className={`inline-flex rounded-full p-1 ${styles.softBg}`}>
          {INTERACTION_OPTIONS.map((option) => {
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
          isLightTheme={styles.isLightTheme}
        />
      </SettingsItem>

      <SettingsItem
        title="Local config backup"
        description="Export a reusable snapshot of your dashboard layout and restore it on another device later."
        styles={styles}
      >
        <p className={`max-w-2xl text-sm leading-relaxed ${styles.subtleColor}`}>
          Includes theme, layout, room order, card order, hidden entity state, custom widgets, and
          light preset settings. Export and import both use YAML. Connection URL and token are
          intentionally left out.
        </p>

        <div className="mt-5 flex flex-col gap-3 sm:flex-row">
          <button
            type="button"
            onClick={handleExportDashboardConfig}
            className={`inline-flex items-center justify-center gap-2 rounded-full px-5 py-3 text-sm font-medium transition-colors ${styles.softBg} ${styles.hoverBg} ${styles.textColor}`}
          >
            <Download className="h-4 w-4" />
            <span>Export config</span>
          </button>
          <button
            type="button"
            onClick={() => importInputRef.current?.click()}
            className={`inline-flex items-center justify-center gap-2 rounded-full px-5 py-3 text-sm font-medium transition-colors ${styles.softBg} ${styles.hoverBg} ${styles.textColor}`}
          >
            <Upload className="h-4 w-4" />
            <span>Import config</span>
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
