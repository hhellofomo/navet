import { Camera, RefreshCw, Settings2, Video, X } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import { DialogShell } from '@/app/components/primitives';
import { getThemeSurfaceTokens } from '@/app/components/shared/theme/theme-surface-tokens';
import { useI18n, useTheme } from '@/app/hooks';

interface CameraLiveViewerProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  name: string;
  room: string;
  snapshotUrl: string | undefined;
  streamPreviewUrl: string | undefined;
  isUnavailable: boolean;
  isRunning: boolean;
  isStreamCapable: boolean;
  frontendStreamTypes: string[];
  onRefresh: () => void;
  onOpenSettings: () => void;
}

export function CameraLiveViewer({
  isOpen,
  onOpenChange,
  name,
  room,
  snapshotUrl,
  streamPreviewUrl,
  isUnavailable,
  isRunning,
  isStreamCapable,
  frontendStreamTypes,
  onRefresh,
  onOpenSettings,
}: CameraLiveViewerProps) {
  const { t } = useI18n();
  const { theme } = useTheme();
  const surface = getThemeSurfaceTokens(theme);
  const [streamFailed, setStreamFailed] = useState(false);
  const sourceUrl = streamFailed ? snapshotUrl : (streamPreviewUrl ?? snapshotUrl);
  const streamTypeLabel = useMemo(() => {
    if (frontendStreamTypes.length > 0) {
      return frontendStreamTypes.join(' / ').toUpperCase();
    }

    return isStreamCapable ? t('camera.viewer.streamCapable') : t('camera.viewer.snapshotOnly');
  }, [frontendStreamTypes, isStreamCapable, t]);

  useEffect(() => {
    if (!isOpen && !streamPreviewUrl && !snapshotUrl) {
      return;
    }
    setStreamFailed(false);
  }, [isOpen, streamPreviewUrl, snapshotUrl]);

  return (
    <DialogShell
      isOpen={isOpen}
      onOpenChange={onOpenChange}
      disableOpenAutoFocus
      mobileCoverSheet={false}
      overlayClassName={`animate-in fade-in ${surface.dialogBackdrop}`}
      contentTitle={name}
      contentDescription={t('camera.viewer.description')}
      contentClassName="fixed inset-3 z-50 overflow-hidden rounded-[28px] border border-white/10 bg-black shadow-2xl outline-none animate-in fade-in zoom-in-95 duration-200 md:inset-8"
      bodyClassName="h-full"
    >
      <div className="relative flex h-full min-h-0 flex-col bg-black text-white">
        <div className="absolute inset-0">
          {sourceUrl && !isUnavailable ? (
            <img
              src={sourceUrl}
              alt={name}
              className="h-full w-full object-contain"
              draggable={false}
              onError={() => setStreamFailed(true)}
            />
          ) : (
            <div className="flex h-full flex-col items-center justify-center gap-3 bg-zinc-950">
              <Camera className="h-12 w-12 text-white/35" />
              <span className="text-sm text-white/58">
                {isUnavailable ? t('camera.status.unavailable') : t('camera.status.noSignal')}
              </span>
            </div>
          )}
        </div>

        <div className="pointer-events-none absolute inset-x-0 top-0 bg-gradient-to-b from-black/85 via-black/45 to-transparent p-4 md:p-5">
          <div className="pointer-events-auto flex items-start justify-between gap-3">
            <div className="min-w-0">
              <div className="flex flex-wrap items-center gap-2 text-xs font-medium text-white/76">
                <span>{room}</span>
                <span className="h-1 w-1 rounded-full bg-white/35" />
                <span>{streamTypeLabel}</span>
              </div>
              <h2 className="mt-1 truncate text-lg font-semibold tracking-tight md:text-2xl">
                {name}
              </h2>
            </div>

            <div className="flex shrink-0 items-center gap-2">
              <button
                type="button"
                onClick={onRefresh}
                className="flex h-10 w-10 items-center justify-center rounded-full border border-white/12 bg-black/45 text-white backdrop-blur-xl transition-colors hover:bg-white/12"
                aria-label={t('camera.actions.refreshSnapshot')}
              >
                <RefreshCw className="h-4 w-4" />
              </button>
              <button
                type="button"
                onClick={onOpenSettings}
                className="flex h-10 w-10 items-center justify-center rounded-full border border-white/12 bg-black/45 text-white backdrop-blur-xl transition-colors hover:bg-white/12"
                aria-label={t('camera.actions.openSettings')}
              >
                <Settings2 className="h-4 w-4" />
              </button>
              <button
                type="button"
                onClick={() => onOpenChange(false)}
                className="flex h-10 w-10 items-center justify-center rounded-full border border-white/12 bg-black/45 text-white backdrop-blur-xl transition-colors hover:bg-white/12"
                aria-label={t('common.close')}
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>

        <div className="pointer-events-none absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/85 via-black/45 to-transparent p-4 md:p-5">
          <div className="inline-flex items-center gap-2 rounded-full border border-white/12 bg-black/45 px-3 py-1.5 text-xs font-medium text-white backdrop-blur-xl">
            <span
              className={`h-2 w-2 rounded-full ${
                isRunning ? 'bg-red-500 shadow-[0_0_10px_rgba(239,68,68,0.7)]' : 'bg-white/45'
              }`}
            />
            <Video className="h-3.5 w-3.5 text-white/72" />
            <span>{isRunning ? t('camera.status.live') : t('common.off')}</span>
            {streamFailed && streamPreviewUrl ? (
              <span className="text-white/58">{t('camera.viewer.snapshotFallback')}</span>
            ) : null}
          </div>
        </div>
      </div>
    </DialogShell>
  );
}
