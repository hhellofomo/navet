declare global {
  interface Window {
    __NAVET_PANEL__?: boolean;
  }
}

export function isHomeAssistantPanelMode(): boolean {
  return typeof window !== 'undefined' && window.__NAVET_PANEL__ === true;
}
