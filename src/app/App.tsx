import { useEffect, useState } from 'react';
import { NetworkStatusBanner } from './components/shared/network-status-banner';
import { PwaUpdatePrompt } from './components/shared/pwa-update-prompt';
import { Toaster } from './components/ui/sonner';
import { AuthProvider, useAuth } from './contexts/auth-context';
import { ConfigProvider, useConfig } from './contexts/config-context';
import { ErrorProvider } from './contexts/error-context';
import { LoadingProvider } from './contexts/loading-context';
import { LoginPage } from './features/auth/login-page';
import { DashboardPage } from './features/dashboard/dashboard-page';
import { useHomeAssistant } from './hooks';
import { useSettingsStore } from './stores';

function AppContent() {
  const { isAuthenticated, config: authConfig } = useAuth();
  const { config: haConfig } = useConfig();
  const { connected, connecting, connect } = useHomeAssistant();
  const disableAnimations = useSettingsStore((state) => state.disableAnimations);
  const [isOnline, setIsOnline] = useState(() =>
    typeof navigator === 'undefined' ? true : navigator.onLine
  );

  useEffect(() => {
    const configToUse = authConfig || haConfig;

    if (isAuthenticated && configToUse && !connected && !connecting) {
      connect({
        hassUrl: configToUse.url,
        token: configToUse.token,
      }).catch((_err) => {});
    }
  }, [isAuthenticated, authConfig, haConfig, connected, connecting, connect]);

  useEffect(() => {
    document.documentElement.dataset.noAnimation = disableAnimations ? 'true' : 'false';

    return () => {
      delete document.documentElement.dataset.noAnimation;
    };
  }, [disableAnimations]);

  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  return (
    <>
      <PwaUpdatePrompt />
      <NetworkStatusBanner connected={connected} connecting={connecting} isOnline={isOnline} />
      <Toaster />
      {!isAuthenticated ? <LoginPage /> : <DashboardPage />}
    </>
  );
}

export default function App() {
  return (
    <ConfigProvider>
      <LoadingProvider>
        <ErrorProvider>
          <AuthProvider>
            <AppContent />
          </AuthProvider>
        </ErrorProvider>
      </LoadingProvider>
    </ConfigProvider>
  );
}
