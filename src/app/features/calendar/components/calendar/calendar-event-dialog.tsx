import * as Dialog from '@radix-ui/react-dialog';
import { CalendarDays, ExternalLink, FileText, MapPin, Video } from 'lucide-react';
import { DialogHeader } from '@/app/components/shared/device-editor';
import { getThemeSurfaceTokens } from '@/app/components/shared/theme/theme-surface-tokens';
import type { ThemeType } from '@/app/hooks/use-theme';
import type { CalendarEvent } from './types';

interface CalendarEventDialogProps {
  event: CalendarEvent | null;
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  theme: ThemeType;
}

export function CalendarEventDialog({
  event,
  isOpen,
  onOpenChange,
  theme,
}: CalendarEventDialogProps) {
  const surface = getThemeSurfaceTokens(theme);
  const isOn = theme !== 'light';

  if (!event) {
    return null;
  }

  return (
    <Dialog.Root open={isOpen} onOpenChange={onOpenChange}>
      <Dialog.Portal>
        <Dialog.Overlay className={`fixed inset-0 z-50 ${surface.dialogBackdrop}`} />
        <Dialog.Content
          className={`fixed top-1/2 left-1/2 z-50 w-[90vw] max-w-md -translate-x-1/2 -translate-y-1/2 rounded-3xl border p-6 shadow-2xl backdrop-blur-xl ${surface.panel} ${surface.border}`}
        >
          <DialogHeader
            title={event.title}
            description={`${event.startTime} - ${event.endTime}`}
            isOn={isOn}
          />

          <div className="space-y-4">
            <div className={`rounded-2xl border p-4 ${surface.border} ${surface.subtleBg}`}>
              <div className={`mb-3 text-xs font-medium ${surface.textSecondary}`}>Details</div>
              <div className="space-y-3 text-sm">
                <div className={`flex items-center gap-2 ${surface.textPrimary}`}>
                  <CalendarDays className="h-4 w-4" />
                  <span>{event.sourceName ?? 'Calendar'}</span>
                </div>

                <div className={`flex items-center gap-2 ${surface.textPrimary}`}>
                  <Video className="h-4 w-4" />
                  <span className="capitalize">{event.type}</span>
                </div>

                {event.location && (
                  <div className={`flex items-start gap-2 ${surface.textPrimary}`}>
                    <MapPin className="mt-0.5 h-4 w-4 flex-shrink-0" />
                    <span>{event.location}</span>
                  </div>
                )}

                {event.description && (
                  <div className={`flex items-start gap-2 ${surface.textPrimary}`}>
                    <FileText className="mt-0.5 h-4 w-4 flex-shrink-0" />
                    <span className="whitespace-pre-wrap">{event.description}</span>
                  </div>
                )}
              </div>
            </div>

            <div className="flex justify-end gap-2">
              {event.location && (
                <button
                  type="button"
                  onClick={() => {
                    const location = event.location;
                    if (!location) {
                      return;
                    }

                    const mapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
                      location
                    )}`;
                    window.open(mapsUrl, '_blank', 'noopener,noreferrer');
                  }}
                  className={`inline-flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-medium ${surface.textPrimary} ${surface.subtleBg} ${surface.hoverBg}`}
                >
                  <ExternalLink className="h-4 w-4" />
                  Open Map
                </button>
              )}

              <Dialog.Close asChild>
                <button
                  type="button"
                  className={`rounded-xl px-4 py-2 text-sm font-medium ${surface.textPrimary} ${surface.subtleBg} ${surface.hoverBg}`}
                >
                  Done
                </button>
              </Dialog.Close>
            </div>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
