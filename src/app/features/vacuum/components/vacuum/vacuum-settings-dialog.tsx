import * as Dialog from '@radix-ui/react-dialog';
import { Home, Play } from 'lucide-react';
import { DialogHeader } from '@/app/components/shared/device-editor';
import type { ThemeType } from '@/app/hooks/use-theme';
import { getVacuumSettingsDialogSurface } from './vacuum-settings-dialog-surface';

interface VacuumSettingsDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onStartCleaning: () => void;
  onReturnHome: () => void;
  name: string;
  theme: ThemeType;
  accentColorValue: string;
}

export function VacuumSettingsDialog({
  isOpen,
  onClose,
  onStartCleaning,
  onReturnHome,
  name,
  theme,
  accentColorValue,
}: VacuumSettingsDialogProps) {
  const dialogSurface = getVacuumSettingsDialogSurface(theme);

  return (
    <Dialog.Root open={isOpen} onOpenChange={onClose}>
      <Dialog.Portal>
        <Dialog.Overlay className={`fixed inset-0 z-50 ${dialogSurface.surface.dialogBackdrop}`} />
        <Dialog.Content
          className={`fixed top-1/2 left-1/2 z-50 w-[90vw] max-w-md -translate-x-1/2 -translate-y-1/2 overflow-hidden rounded-2xl border shadow-2xl ${dialogSurface.contentClassName} ${dialogSurface.surface.border}`}
        >
          <div className="p-6 pb-0">
            <DialogHeader
              title={`${name} Settings`}
              description="Adjust cleaning behavior and quick actions."
              isOn={theme !== 'light'}
            />
          </div>

          <div className="p-6 space-y-6">
            {/* Cleaning Modes */}
            <div>
              <h3 className={`mb-3 text-sm font-semibold ${dialogSurface.headingClassName}`}>
                Cleaning Mode
              </h3>
              <div className="grid grid-cols-2 gap-2">
                {['Auto', 'Spot', 'Edge', 'Room'].map((mode) => (
                  <button
                    type="button"
                    key={mode}
                    className={`rounded-xl border-2 py-3 text-sm font-medium transition-all hover:opacity-100 ${dialogSurface.optionButtonClassName}`}
                  >
                    {mode}
                  </button>
                ))}
              </div>
            </div>

            {/* Fan Speed */}
            <div>
              <h3 className={`mb-3 text-sm font-semibold ${dialogSurface.headingClassName}`}>
                Fan Speed
              </h3>
              <div className="grid grid-cols-3 gap-2">
                {['Quiet', 'Standard', 'Max'].map((speed) => (
                  <button
                    type="button"
                    key={speed}
                    className={`rounded-xl border-2 py-3 text-sm font-medium transition-all hover:opacity-100 ${dialogSurface.optionButtonClassName}`}
                  >
                    {speed}
                  </button>
                ))}
              </div>
            </div>

            {/* Actions */}
            <div>
              <h3 className={`mb-3 text-sm font-semibold ${dialogSurface.headingClassName}`}>
                Actions
              </h3>
              <div className="space-y-2">
                <button
                  type="button"
                  onClick={onStartCleaning}
                  className="w-full py-3 rounded-xl text-white font-medium transition-colors flex items-center justify-center gap-2"
                  style={{ backgroundColor: accentColorValue }}
                >
                  <Play className="w-4 h-4" />
                  Start Cleaning
                </button>
                <button
                  type="button"
                  onClick={onReturnHome}
                  className={`flex w-full items-center justify-center gap-2 rounded-xl py-3 font-medium transition-colors ${dialogSurface.secondaryButtonClassName}`}
                >
                  <Home className="w-4 h-4" />
                  Return to Dock
                </button>
              </div>
            </div>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
