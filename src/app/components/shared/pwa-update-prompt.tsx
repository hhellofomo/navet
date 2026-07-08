import { useEffect, useRef } from 'react';
import { toast } from 'sonner';
import { applyPwaUpdate, dismissPwaUpdate, usePwaUpdateState } from '@/app/pwa/pwa-update-store';

export function PwaUpdatePrompt() {
  const { updateAvailable } = usePwaUpdateState();
  const toastIdRef = useRef<string | number | null>(null);

  useEffect(() => {
    if (!updateAvailable) {
      if (toastIdRef.current !== null) {
        toast.dismiss(toastIdRef.current);
        toastIdRef.current = null;
      }
      return;
    }

    toastIdRef.current = toast('Navet update available', {
      description: 'A new version has been installed in the background.',
      duration: Infinity,
      action: {
        label: 'Reload',
        onClick: () => {
          void applyPwaUpdate();
        },
      },
      cancel: {
        label: 'Later',
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
  }, [updateAvailable]);

  return null;
}
