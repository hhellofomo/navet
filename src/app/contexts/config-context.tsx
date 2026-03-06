import { createContext, useContext, useState, useCallback, type ReactNode } from 'react';

export interface HAConfig {
  url: string;
  token: string;
}

interface ConfigContextType {
  config: HAConfig | null;
  isConfigured: boolean;
  saveConfig: (config: HAConfig) => Promise<boolean>;
  testConnection: (url: string, token: string) => Promise<boolean>;
  clearConfig: () => void;
}

const ConfigContext = createContext<ConfigContextType | undefined>(undefined);

const CONFIG_STORAGE_KEY = 'ha-dashboard-config';

export function ConfigProvider({ children }: { children: ReactNode }) {
  const [config, setConfig] = useState<HAConfig | null>(() => {
    try {
      if (typeof window !== 'undefined' && window.localStorage) {
        const stored = localStorage.getItem(CONFIG_STORAGE_KEY);
        if (stored) {
          return JSON.parse(stored);
        }
      }
    } catch (error) {
      console.error('Failed to load config from localStorage:', error);
    }
    return null;
  });

  const testConnection = useCallback(async (url: string, token: string): Promise<boolean> => {
    try {
      const cleanUrl = url.endsWith('/') ? url.slice(0, -1) : url;
      
      // Basic URL validation
      try {
        new URL(cleanUrl);
      } catch {
        console.error('Invalid URL format');
        return false;
      }

      const response = await fetch(`${cleanUrl}/api/`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        mode: 'cors',
      });

      return response.ok;
    } catch (error) {
      console.error('Connection test failed:', error);
      // Return false but don't throw - let the UI handle it
      return false;
    }
  }, []);

  const saveConfig = useCallback(async (newConfig: HAConfig): Promise<boolean> => {
    try {
      const cleanUrl = newConfig.url.endsWith('/') ? newConfig.url.slice(0, -1) : newConfig.url;
      const configToSave = { ...newConfig, url: cleanUrl };
      
      // Save config directly without testing
      // (Testing will fail in development due to CORS)
      setConfig(configToSave);
      
      if (typeof window !== 'undefined' && window.localStorage) {
        localStorage.setItem(CONFIG_STORAGE_KEY, JSON.stringify(configToSave));
      }
      
      return true;
    } catch (error) {
      console.error('Failed to save config:', error);
      return false;
    }
  }, []);

  const clearConfig = useCallback(() => {
    setConfig(null);
    
    if (typeof window !== 'undefined' && window.localStorage) {
      localStorage.removeItem(CONFIG_STORAGE_KEY);
    }
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
