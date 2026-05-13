import { Button } from '@/app/components/primitives/button';
import type { ThemeSurfaceTokens } from '@/app/components/shared/theme/theme-surface-tokens';
import type { TranslateFn } from '@/app/hooks';

interface EnergyWizardFooterProps {
  step: number;
  totalSteps: number;
  essentialsComplete: boolean;
  isSaving: boolean;
  onBack: () => void;
  onContinue: () => void;
  onSave: () => void;
  onCancel?: () => void;
  surface: ThemeSurfaceTokens;
  t: TranslateFn;
}

export function EnergyWizardFooter({
  step,
  totalSteps,
  essentialsComplete,
  isSaving,
  onBack,
  onContinue,
  onSave,
  onCancel,
  surface,
  t,
}: EnergyWizardFooterProps) {
  const onPrimaryAction = step < totalSteps - 1 ? onContinue : onSave;
  const primaryLabel = step < totalSteps - 1 ? 'Continue' : 'Save';
  const primaryDisabled = step === 0 ? !essentialsComplete : false;

  return (
    <div
      className={`sticky bottom-0 -mx-6 mt-12 border-t px-6 py-4 backdrop-blur-2xl md:-mx-10 md:px-10 ${surface.border}`}
      style={{
        paddingBottom: 'calc(1rem + env(safe-area-inset-bottom))',
        backgroundColor: 'rgba(24,24,27,0.82)',
        boxShadow: '0 -18px 40px rgba(0,0,0,0.16)',
      }}
    >
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-wrap items-center gap-2">
          {step > 0 ? (
            <Button variant="secondary" onClick={onBack}>
              Back
            </Button>
          ) : null}
          {onCancel ? (
            <Button variant="ghost" onClick={onCancel}>
              {t('common.cancel')}
            </Button>
          ) : null}
        </div>

        <Button
          variant="primary"
          disabled={primaryDisabled}
          onClick={onPrimaryAction}
          loading={isSaving}
        >
          {primaryLabel}
        </Button>
      </div>
    </div>
  );
}
