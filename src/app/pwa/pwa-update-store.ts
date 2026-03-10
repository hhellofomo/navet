import { registerSW } from 'virtual:pwa-register';
import { useSyncExternalStore } from 'react';

type PwaUpdateState = {
  offlineReady: boolean;
  updateAvailable: boolean;
};

const initialState: PwaUpdateState = {
  offlineReady: false,
  updateAvailable: false,
};

let state: PwaUpdateState = initialState;
let updateServiceWorker: ((reloadPage?: boolean) => Promise<void>) | null = null;
const listeners = new Set<() => void>();

function emit() {
  for (const listener of listeners) {
    listener();
  }
}

function setState(nextState: Partial<PwaUpdateState>) {
  state = { ...state, ...nextState };
  emit();
}

export function registerPwaServiceWorker() {
  updateServiceWorker = registerSW({
    immediate: true,
    onOfflineReady() {
      setState({ offlineReady: true });
    },
    onNeedRefresh() {
      setState({ updateAvailable: true });
    },
  });
}

export async function applyPwaUpdate() {
  if (!updateServiceWorker) {
    return;
  }

  await updateServiceWorker(true);
}

export function dismissPwaUpdate() {
  setState({ updateAvailable: false });
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

function getSnapshot() {
  return state;
}

export function usePwaUpdateState() {
  return useSyncExternalStore(subscribe, getSnapshot, getSnapshot);
}
