import { useEffect, useState } from 'react';
import { NetworkStatusBanner } from './components/shared/network-status-banner';
import { PwaUpdatePrompt } from './components/shared/pwa-update-prompt';
import { Toaster } from './components/ui/sonner';
import { AuthProvider, useAuth } from './contexts/auth-context';
import { ConfigProvider, useConfig } from './contexts/config-context';
import { ErrorProvider } from './contexts/error-context';
import { LoadingProvider } from './contexts/loading-context';
import { LoginPage } from './features/auth/login-page';
import { DashboardPage } from './features/dashboard';
import { useHomeAssistant } from './hooks';
import { I18nProvider } from './i18n';
import { useSettingsStore } from './stores';
import { homeAssistantSelectors } from './stores/selectors';

function AppContent() {
  const { isAuthenticated, config: authConfig } = useAuth();
  const { config: haConfig } = useConfig();
  const connected = useHomeAssistant(homeAssistantSelectors.connected);
  const connecting = useHomeAssistant(homeAssistantSelectors.connecting);
  const connect = useHomeAssistant(homeAssistantSelectors.connect);
  const disableAnimations = useSettingsStore((state) => state.disableAnimations);
  const lowPowerMode = useSettingsStore((state) => state.lowPowerMode);
  const reducedEffectsEnabled = disableAnimations || lowPowerMode;
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
    document.documentElement.dataset.noAnimation = reducedEffectsEnabled ? 'true' : 'false';
    document.documentElement.dataset.lowPower = reducedEffectsEnabled ? 'true' : 'false';

    return () => {
      delete document.documentElement.dataset.noAnimation;
      delete document.documentElement.dataset.lowPower;
    };
  }, [reducedEffectsEnabled]);

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
      <I18nProvider>
        <LoadingProvider>
          <ErrorProvider>
            <AuthProvider>
              <AppContent />
            </AuthProvider>
          </ErrorProvider>
        </LoadingProvider>
      </I18nProvider>
    </ConfigProvider>
  );
}
