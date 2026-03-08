import { createContext, type ReactNode, useCallback, useContext, useState } from 'react';
import { STORAGE_KEYS } from '../constants/storage-keys';
import {
  clearStoredSessionConfig,
  normalizeSessionConfig,
  readInitialSessionConfig,
  type SessionConfig,
  writeStoredSessionConfig,
} from '../session/session';
import { homeAssistantStore } from '../stores/home-assistant-store';
import { useConfig } from './config-context';

type AuthConfig = SessionConfig;

interface AuthContextType {
  isAuthenticated: boolean;
  config: AuthConfig | null;
  login: (url: string, token: string) => Promise<boolean>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const { clearConfig, saveConfig } = useConfig();
  const [config, setConfig] = useState<AuthConfig | null>(() =>
    readInitialSessionConfig(STORAGE_KEYS.authConfig)
  );

  const isAuthenticated = config !== null;

  const login = useCallback(
    async (url: string, token: string) => {
      const authConfig = normalizeSessionConfig({ url, token });

      setConfig(authConfig);
      writeStoredSessionConfig(STORAGE_KEYS.authConfig, authConfig);

      // Keep the connection config in sync with the authenticated session.
      const saved = await saveConfig(authConfig);
      return saved;
    },
    [saveConfig]
  );

  const logout = useCallback(() => {
    homeAssistantStore.getState().disconnect();
    setConfig(null);
    clearStoredSessionConfig(STORAGE_KEYS.authConfig);
    clearConfig();
  }, [clearConfig]);

  return (
    <AuthContext.Provider value={{ isAuthenticated, config, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
}
