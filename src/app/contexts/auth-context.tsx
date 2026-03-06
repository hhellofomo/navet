import { createContext, useContext, useState, useCallback, type ReactNode } from 'react';
import { useConfig } from './config-context';

interface AuthConfig {
  url: string;
  token: string;
}

interface AuthContextType {
  isAuthenticated: boolean;
  config: AuthConfig | null;
  login: (url: string, token: string) => Promise<boolean>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const AUTH_STORAGE_KEY = 'ha_auth_config';

export function AuthProvider({ children }: { children: ReactNode }) {
  const { saveConfig } = useConfig();
  const [config, setConfig] = useState<AuthConfig | null>(() => {
    // Load from localStorage on mount
    const stored = localStorage.getItem(AUTH_STORAGE_KEY);
    if (stored) {
      try {
        return JSON.parse(stored);
      } catch {
        return null;
      }
    }
    return null;
  });

  const isAuthenticated = config !== null;

  const login = useCallback(async (url: string, token: string) => {
    // Remove trailing slash from URL
    const cleanUrl = url.endsWith('/') ? url.slice(0, -1) : url;
    
    const authConfig: AuthConfig = {
      url: cleanUrl,
      token: token.trim()
    };
    
    setConfig(authConfig);
    localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(authConfig));
    
    // Also save to config context for Home Assistant connection
    const saved = await saveConfig(authConfig);
    return saved;
  }, [saveConfig]);

  const logout = useCallback(() => {
    setConfig(null);
    localStorage.removeItem(AUTH_STORAGE_KEY);
  }, []);

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
