import * as Dialog from '@radix-ui/react-dialog';
import { Home, Play } from 'lucide-react';
import { DialogHeader } from '@/app/components/shared/dialog-header';
import { getThemeSurfaceTokens } from '@/app/components/shared/theme/theme-surface-tokens';
import type { ThemeType } from '@/app/hooks/use-theme';

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
  const surface = getThemeSurfaceTokens(theme);
  const isGlass = theme === 'glass';
  const textColor = surface.textPrimary;
  const secondaryButton = `${surface.subtleBg} ${surface.hoverBg} ${surface.textPrimary}`;
  const optionButton = `${surface.inputBg} border ${surface.border} ${surface.textSecondary}`;

  return (
    <Dialog.Root open={isOpen} onOpenChange={onClose}>
      <Dialog.Portal>
        <Dialog.Overlay className={`fixed inset-0 z-50 ${surface.dialogBackdrop}`} />
        <Dialog.Content
          className={`fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[90vw] max-w-md rounded-2xl border shadow-2xl z-50 overflow-hidden ${
            theme === 'light'
              ? 'bg-white'
              : isGlass
                ? 'bg-white/10 backdrop-blur-2xl'
                : 'bg-gray-900'
          } ${surface.border}`}
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
              <h3 className={`text-sm font-semibold ${textColor} mb-3`}>Cleaning Mode</h3>
              <div className="grid grid-cols-2 gap-2">
                {['Auto', 'Spot', 'Edge', 'Room'].map((mode) => (
                  <button
                    type="button"
                    key={mode}
                    className={`py-3 rounded-xl text-sm font-medium transition-all border-2 hover:opacity-100 ${optionButton}`}
                  >
                    {mode}
                  </button>
                ))}
              </div>
            </div>

            {/* Fan Speed */}
            <div>
              <h3 className={`text-sm font-semibold ${textColor} mb-3`}>Fan Speed</h3>
              <div className="grid grid-cols-3 gap-2">
                {['Quiet', 'Standard', 'Max'].map((speed) => (
                  <button
                    type="button"
                    key={speed}
                    className={`py-3 rounded-xl text-sm font-medium transition-all border-2 hover:opacity-100 ${optionButton}`}
                  >
                    {speed}
                  </button>
                ))}
              </div>
            </div>

            {/* Actions */}
            <div>
              <h3 className={`text-sm font-semibold ${textColor} mb-3`}>Actions</h3>
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
                  className={`w-full py-3 rounded-xl font-medium transition-colors flex items-center justify-center gap-2 ${secondaryButton}`}
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
