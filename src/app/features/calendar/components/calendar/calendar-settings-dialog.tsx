import * as Dialog from '@radix-ui/react-dialog';
import { Check } from 'lucide-react';
import { DialogHeader } from '@/app/components/shared/device-editor';
import { getThemeSurfaceTokens } from '@/app/components/shared/theme/theme-surface-tokens';
import type { ThemeType } from '@/app/hooks/use-theme';

interface CalendarSourceOption {
  id: string;
  name: string;
  room: string;
}

interface CalendarSettingsDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  theme: ThemeType;
  title: string;
  calendars: CalendarSourceOption[];
  selectedCalendarIds: string[];
  onSelectedCalendarIdsChange: (ids: string[]) => void;
  viewMode: 'week' | 'month';
  onViewModeChange: (viewMode: 'week' | 'month') => void;
}

export function CalendarSettingsDialog({
  isOpen,
  onOpenChange,
  theme,
  title,
  calendars,
  selectedCalendarIds,
  onSelectedCalendarIdsChange,
  viewMode,
  onViewModeChange,
}: CalendarSettingsDialogProps) {
  const surface = getThemeSurfaceTokens(theme);
  const isOn = theme !== 'light';

  return (
    <Dialog.Root open={isOpen} onOpenChange={onOpenChange}>
      <Dialog.Portal>
        <Dialog.Overlay className={`fixed inset-0 z-50 ${surface.dialogBackdrop}`} />
        <Dialog.Content
          className={`fixed top-1/2 left-1/2 z-50 w-[90vw] max-w-md -translate-x-1/2 -translate-y-1/2 rounded-3xl border p-6 shadow-2xl backdrop-blur-xl ${surface.panel} ${surface.border}`}
        >
          <DialogHeader
            title="Calendar Sources"
            description={`Choose which calendars ${title} should show`}
            isOn={isOn}
          />

          <div className="mb-4">
            <div className={`mb-2 text-xs font-medium ${surface.textSecondary}`}>View</div>
            <div className="grid grid-cols-2 gap-2">
              {(['week', 'month'] as const).map((option) => {
                const isSelected = viewMode === option;

                return (
                  <button
                    type="button"
                    key={option}
                    onClick={() => onViewModeChange(option)}
                    className={`rounded-2xl border px-4 py-3 text-sm font-medium transition-colors ${
                      isSelected
                        ? 'border-white bg-white text-black'
                        : `${surface.border} ${surface.subtleBg} ${surface.textPrimary} ${surface.hoverBg}`
                    }`}
                  >
                    {option === 'week' ? 'This Week' : 'This Month'}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="space-y-2">
            {calendars.map((calendar) => {
              const isSelected = selectedCalendarIds.includes(calendar.id);

              return (
                <button
                  type="button"
                  key={calendar.id}
                  onClick={() => {
                    onSelectedCalendarIdsChange(
                      isSelected
                        ? selectedCalendarIds.filter((id) => id !== calendar.id)
                        : [...selectedCalendarIds, calendar.id]
                    );
                  }}
                  className={`flex w-full items-center justify-between rounded-2xl border px-4 py-3 text-left transition-colors ${surface.border} ${surface.subtleBg} ${surface.hoverBg}`}
                >
                  <div className="min-w-0">
                    <div className={`truncate text-sm font-medium ${surface.textPrimary}`}>
                      {calendar.name}
                    </div>
                    <div className={`mt-0.5 truncate text-xs ${surface.textSecondary}`}>
                      {calendar.room}
                    </div>
                  </div>

                  <div
                    className={`ml-4 flex h-5 w-5 items-center justify-center rounded border transition-colors ${
                      isSelected
                        ? 'border-white bg-white text-black'
                        : `${surface.border} bg-transparent`
                    }`}
                  >
                    {isSelected && <Check className="h-3.5 w-3.5" />}
                  </div>
                </button>
              );
            })}
          </div>

          <div className="mt-6 flex justify-end">
            <Dialog.Close asChild>
              <button
                type="button"
                className={`rounded-xl px-4 py-2 text-sm font-medium ${surface.textPrimary} ${surface.subtleBg} ${surface.hoverBg}`}
              >
                Done
              </button>
            </Dialog.Close>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
