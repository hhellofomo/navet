import { Video } from 'lucide-react';
import { DashboardEmptyState } from '@/app/components/patterns';
import { getThemeSurfaceTokens } from '@/app/components/shared/theme/theme-surface-tokens';
import { SecurityCameraDashboard } from '@/app/features/security/components/security-camera-dashboard';
import { buildSecurityCameraDashboardModel } from '@/app/features/security/utils/security-camera-dashboard-model';
import {
  useCardState,
  useDevices,
  useEditMode,
  useHomeAssistant,
  useI18n,
  useTheme,
} from '@/app/hooks';
import { homeAssistantSelectors } from '@/app/stores/selectors';
import { SectionCustomizeShell } from './section-customize-shell';

export function SecuritySection() {
  const { t } = useI18n();
  const { theme } = useTheme();
  const surface = getThemeSurfaceTokens(theme);
  const devices = useDevices();
  const entities = useHomeAssistant(homeAssistantSelectors.entities);
  const { isEditMode, toggleEditMode } = useEditMode();
  const { cardSizes, updateCardSize } = useCardState(devices);
  const model = buildSecurityCameraDashboardModel(devices, entities);

  if (model.summary.totalCameras === 0) {
    return (
      <div className="flex h-full items-center justify-center p-6">
        <DashboardEmptyState
          icon={Video}
          title={t('sections.security.emptyTitle')}
          description={t('sections.security.emptyDescription')}
          className="w-full max-w-md"
        />
      </div>
    );
  }

  return (
    <SectionCustomizeShell isEditMode={isEditMode} onToggle={toggleEditMode} className="relative">
      <SecurityCameraDashboard
        model={model}
        isEditMode={isEditMode}
        cardSizes={cardSizes}
        updateCardSize={updateCardSize}
        surface={surface}
        labels={{
          primaryTitle: t('security.dashboard.primaryTitle'),
          stillTitle: t('security.dashboard.stillTitle'),
          stillDescription: t('security.dashboard.stillDescription'),
          noPrimaryTitle: t('security.dashboard.noPrimaryTitle'),
          noPrimaryDescription: t('security.dashboard.noPrimaryDescription'),
        }}
      />
    </SectionCustomizeShell>
  );
}
