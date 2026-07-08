// Config state is managed by useConfigStore. This file re-exports for backward compatibility.
export type { HAConfig } from '../stores/config-store';
export { useConfig } from '../stores/config-store';

// ConfigProvider is now a no-op passthrough — the store initializes itself.
export function ConfigProvider({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
