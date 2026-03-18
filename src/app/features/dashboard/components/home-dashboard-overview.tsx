import { ChevronRight, LayoutDashboard, Plus, Shield } from 'lucide-react';
import { memo, useMemo } from 'react';
import type { CardSize } from '@/app/components/shared/card-size-selector';
import { getThemeSurfaceTokens } from '@/app/components/shared/theme/theme-surface-tokens';
import { useI18n, useTheme } from '@/app/hooks';
import type { Section } from '@/app/navigation/sections';
import type { DeviceWithType } from '@/app/types/device.types';
import type { CustomCard } from '../stores/custom-cards-store';
import { useZoneLayout } from '../zones/use-zone-layout';
import type { ZoneName } from '../zones/zone-types';
import { ZoneBand } from './zone-band';

interface HomeDashboardOverviewProps {
  deviceMap: Map<string, DeviceWithType>;
  cardSizes: Record<string, CardSize>;
  updateCardSize: (id: string, size: CardSize) => void;
  isEditMode: boolean;
  hiddenEntityCount: number;
  allCustomCards: CustomCard[];
  cardZones: Record<string, ZoneName>;
  onOpenAddEntityDialog?: () => void;
  onOpenBuilder: () => void;
  onDeleteCard?: (cardId: string) => void;
  onUpdateCard?: (cardId: string, data: Record<string, unknown>) => void;
  setActiveSection: (section: Section) => void;
}

export const HomeDashboardOverview = memo(function HomeDashboardOverview({
  deviceMap,
  cardSizes,
  updateCardSize,
  isEditMode,
  hiddenEntityCount,
  allCustomCards,
  cardZones,
  onOpenAddEntityDialog,
  onOpenBuilder,
  onDeleteCard,
  onUpdateCard,
  setActiveSection,
}: HomeDashboardOverviewProps) {
  const { t } = useI18n();
  const { theme, accentColor } = useTheme();
  const surface = getThemeSurfaceTokens(theme);

  // Only include custom cards assigned to the home screen (room === 'All')
  const homeCustomCards = useMemo(
    () => allCustomCards.filter((c) => c.room === 'All'),
    [allCustomCards]
  );

  const customCardMap = useMemo(
    () => new Map(homeCustomCards.map((c) => [c.id, c])),
    [homeCustomCards]
  );

  const zoneSections = useZoneLayout(deviceMap, homeCustomCards, cardZones);

  const totalZonedCards = zoneSections.reduce((sum, s) => sum + s.orderedIds.length, 0);
  const hasCards = totalZonedCards > 0;

  const primaryButtonStyle = {
    background: `linear-gradient(135deg, ${accentColor}, ${accentColor}cc)`,
    boxShadow: `0 20px 44px -24px ${accentColor}88`,
  };

  const summaryItems = [
    { label: t('dashboard.homeOverview.stats.visibleDevices'), value: deviceMap.size },
    { label: t('dashboard.homeOverview.stats.featuredCards'), value: totalZonedCards },
    { label: t('dashboard.homeOverview.stats.hiddenDevices'), value: hiddenEntityCount },
  ];

  return (
    <div>
      <section
        className={`rounded-[28px] border p-5 md:p-6 ${surface.border} ${surface.panel} ${surface.cardShadow}`}
      >
        <div className="flex flex-col gap-4">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
            <div>
              <div
                className={`text-[11px] font-semibold uppercase tracking-[0.2em] ${surface.textMuted}`}
              >
                {t('dashboard.homeOverview.eyebrow')}
              </div>
              <h1
                className={`mt-2 text-xl font-semibold tracking-tight md:text-2xl ${surface.textPrimary}`}
              >
                {t('dashboard.homeOverview.featuredTitle')}
              </h1>
              <p className={`mt-2 max-w-2xl text-sm leading-6 ${surface.textSecondary}`}>
                {t('dashboard.homeOverview.description')}
              </p>
            </div>

            <div className="flex flex-wrap gap-2 lg:justify-end">
              <button
                type="button"
                onClick={onOpenBuilder}
                className="inline-flex items-center gap-2 rounded-full px-4 py-2.5 text-sm font-semibold text-white transition-transform hover:scale-[1.01] active:scale-[0.99]"
                style={primaryButtonStyle}
              >
                <LayoutDashboard className="h-4 w-4" />
                {t('dashboard.homeOverview.openBuilder')}
              </button>

              {onOpenAddEntityDialog ? (
                <button
                  type="button"
                  onClick={onOpenAddEntityDialog}
                  className={`inline-flex items-center gap-2 rounded-full border px-4 py-2.5 text-sm font-medium transition-colors ${surface.border} ${surface.textPrimary} ${surface.hoverBg}`}
                >
                  <Plus className="h-4 w-4" />
                  {t('dashboard.addEntity.title')}
                </button>
              ) : null}

              <button
                type="button"
                onClick={() => setActiveSection('security')}
                className={`inline-flex items-center gap-2 rounded-full border px-4 py-2 text-sm font-medium transition-colors ${surface.border} ${surface.textPrimary} ${surface.hoverBg}`}
              >
                <Shield className="h-4 w-4" />
                {t('sidebar.security')}
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          </div>

          <div className="flex flex-wrap gap-2">
            {summaryItems.map((item) => (
              <div
                key={item.label}
                className={`inline-flex items-center gap-2 rounded-full border px-3 py-2 ${surface.border} ${surface.panelMuted}`}
              >
                <span className={`text-xs uppercase tracking-[0.16em] ${surface.textMuted}`}>
                  {item.label}
                </span>
                <span className={`text-sm font-semibold ${surface.textPrimary}`}>{item.value}</span>
              </div>
            ))}
          </div>
        </div>

        {hasCards ? (
          <div className="mt-6 flex flex-col gap-8">
            {zoneSections.map(({ zone, orderedIds }) => (
              <ZoneBand
                key={zone}
                zone={zone}
                orderedIds={orderedIds}
                deviceMap={deviceMap}
                customCardMap={customCardMap}
                cardSizes={cardSizes}
                handleSizeChange={updateCardSize}
                isEditMode={isEditMode}
                onDeleteCard={onDeleteCard}
                onUpdateCard={onUpdateCard}
              />
            ))}
          </div>
        ) : (
          <div
            className={`mt-5 rounded-[24px] border border-dashed p-8 text-center ${surface.borderStrong} ${surface.panelMuted}`}
          >
            <h3 className={`text-lg font-semibold ${surface.textPrimary}`}>
              {t('dashboard.homeOverview.emptyTitle')}
            </h3>
            <p className={`mx-auto mt-2 max-w-xl text-sm leading-6 ${surface.textSecondary}`}>
              {t('dashboard.homeOverview.emptyDescription')}
            </p>
            <div className="mt-5 flex flex-wrap justify-center gap-3">
              <button
                type="button"
                onClick={onOpenBuilder}
                className="inline-flex items-center gap-2 rounded-full px-4 py-2.5 text-sm font-semibold text-white"
                style={primaryButtonStyle}
              >
                <LayoutDashboard className="h-4 w-4" />
                {t('dashboard.homeOverview.openBuilder')}
              </button>
              {onOpenAddEntityDialog ? (
                <button
                  type="button"
                  onClick={onOpenAddEntityDialog}
                  className={`inline-flex items-center gap-2 rounded-full border px-4 py-2.5 text-sm font-medium transition-colors ${surface.border} ${surface.textPrimary} ${surface.hoverBg}`}
                >
                  <Plus className="h-4 w-4" />
                  {t('dashboard.addEntity.title')}
                </button>
              ) : null}
            </div>
          </div>
        )}
      </section>
    </div>
  );
});
