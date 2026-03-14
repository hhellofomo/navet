import { useEffect, useRef } from 'react';
import { toast } from 'sonner';
import { useI18n } from '@/app/hooks';
import { applyPwaUpdate, dismissPwaUpdate, usePwaUpdateState } from '@/app/pwa/pwa-update-store';

export function PwaUpdatePrompt() {
  const { updateAvailable } = usePwaUpdateState();
  const { t } = useI18n();
  const toastIdRef = useRef<string | number | null>(null);

  useEffect(() => {
    if (!updateAvailable) {
      if (toastIdRef.current !== null) {
        toast.dismiss(toastIdRef.current);
        toastIdRef.current = null;
      }
      return;
    }

    toastIdRef.current = toast(t('pwa.updateAvailableTitle'), {
      description: t('pwa.updateAvailableDescription'),
      duration: Infinity,
      action: {
        label: t('pwa.reload'),
        onClick: () => {
          void applyPwaUpdate();
        },
      },
      cancel: {
        label: t('pwa.later'),
        onClick: () => {
          dismissPwaUpdate();
        },
      },
    });

    return () => {
      if (toastIdRef.current !== null) {
        toast.dismiss(toastIdRef.current);
        toastIdRef.current = null;
      }
    };
  }, [t, updateAvailable]);

  return null;
}
