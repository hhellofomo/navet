import { DashboardArrivalReveal } from './components/dashboard-arrival-reveal';
import { LoadingSpinner } from '@/app/components/shared/loading-spinner';
import { DashboardOverlays } from './components/dashboard-overlays';
import { DashboardSectionRouter } from './components/dashboard-section-router';
import { useDashboardController } from './hooks/use-dashboard-controller';

export function DashboardPage() {
  const controller = useDashboardController();

  if (!controller.devicesLoaded) {
    const message = controller.connecting
      ? 'Connecting to Home Assistant...'
      : 'Loading devices...';
    return <LoadingSpinner message={message} fullScreen />;
  }

  return (
    <>
      <DashboardArrivalReveal
        open={controller.showImportedDashboardReveal && controller.activeSection === 'home'}
        onComplete={controller.onDismissImportedDashboardReveal}
        variant={controller.dashboardArrivalVariant ?? 'import'}
      />
      <DashboardSectionRouter controller={controller} />
      <DashboardOverlays controller={controller} />
    </>
  );
}
