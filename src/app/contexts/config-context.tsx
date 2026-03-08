import { createContext, type ReactNode, useCallback, useContext, useState } from 'react';
import { STORAGE_KEYS } from '../constants/storage-keys';
import {
  clearStoredSessionConfig,
  normalizeSessionConfig,
  readInitialSessionConfig,
  type SessionConfig,
  writeStoredSessionConfig,
} from '../session/session';

export type HAConfig = SessionConfig;

interface ConfigContextType {
  config: HAConfig | null;
  isConfigured: boolean;
  saveConfig: (config: HAConfig) => Promise<boolean>;
  testConnection: (url: string, token: string) => Promise<boolean>;
  clearConfig: () => void;
}

const ConfigContext = createContext<ConfigContextType | undefined>(undefined);

export function ConfigProvider({ children }: { children: ReactNode }) {
  const [config, setConfig] = useState<HAConfig | null>(() => {
    try {
      return readInitialSessionConfig(STORAGE_KEYS.haConfig);
    } catch (_error) {}
    return null;
  });

  const testConnection = useCallback(async (url: string, token: string): Promise<boolean> => {
    try {
      const cleanUrl = url.endsWith('/') ? url.slice(0, -1) : url;

      // Basic URL validation
      try {
        new URL(cleanUrl);
      } catch {
        return false;
      }

      const response = await fetch(`${cleanUrl}/api/`, {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        mode: 'cors',
      });

      return response.ok;
    } catch (_error) {
      // Return false but don't throw - let the UI handle it
      return false;
    }
  }, []);

  const saveConfig = useCallback(async (newConfig: HAConfig): Promise<boolean> => {
    try {
      const configToSave = normalizeSessionConfig(newConfig);

      // Save config directly without testing
      // (Testing will fail in development due to CORS)
      setConfig(configToSave);
      writeStoredSessionConfig(STORAGE_KEYS.haConfig, configToSave);

      return true;
    } catch (_error) {
      return false;
    }
  }, []);

  const clearConfig = useCallback(() => {
    setConfig(null);
    clearStoredSessionConfig(STORAGE_KEYS.haConfig);
  }, []);

  return (
    <ConfigContext.Provider
      value={{
        config,
        isConfigured: config !== null,
        saveConfig,
        testConnection,
        clearConfig,
      }}
    >
      {children}
    </ConfigContext.Provider>
  );
}

export function useConfig() {
  const context = useContext(ConfigContext);
  if (!context) {
    throw new Error('useConfig must be used within ConfigProvider');
  }
  return context;
}
