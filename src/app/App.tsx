import { useEffect } from 'react';
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

  return (
    <>
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
