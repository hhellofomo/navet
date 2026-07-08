// Auth state is managed by useAuthStore. This file re-exports for backward compatibility.
export { useAuth } from '../stores/auth-store';

// AuthProvider is now a no-op passthrough — the store initializes itself.
export function AuthProvider({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
