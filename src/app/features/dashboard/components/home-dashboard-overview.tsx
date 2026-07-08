import { ChevronRight, LayoutDashboard, Plus, Shield } from 'lucide-react';
import { memo, useMemo } from 'react';
import { type CardSize, getCardSpanClass } from '@/app/components/shared/card-size-selector';
import { getThemeSurfaceTokens } from '@/app/components/shared/theme/theme-surface-tokens';
import { useI18n, useTheme } from '@/app/hooks';
import type { Section } from '@/app/navigation/sections';
import type { DeviceWithType } from '@/app/types/device.types';
import { DashboardCardItem } from './dashboard-card-item';

interface HomeDashboardOverviewProps {
  deviceMap: Map<string, DeviceWithType>;
  cardSizes: Record<string, CardSize>;
  updateCardSize: (id: string, size: CardSize) => void;
  isEditMode: boolean;
  hiddenEntityCount: number;
  onOpenAddEntityDialog?: () => void;
  onOpenBuilder: () => void;
  setActiveSection: (section: Section) => void;
}

type FeaturedCard = {
  device: DeviceWithType;
  size: CardSize;
};

export const HomeDashboardOverview = memo(function HomeDashboardOverview({
  deviceMap,
  cardSizes,
  updateCardSize,
  isEditMode,
  hiddenEntityCount,
  onOpenAddEntityDialog,
  onOpenBuilder,
  setActiveSection,
}: HomeDashboardOverviewProps) {
  const { t } = useI18n();
  const { theme, accentColor } = useTheme();
  const surface = getThemeSurfaceTokens(theme);

  const featuredCards = useMemo<FeaturedCard[]>(() => {
    const devices = Array.from(deviceMap.values());
    const usedIds = new Set<string>();

    const pick = (types: string[], size: CardSize, count = 1): FeaturedCard[] => {
      const matches = devices.filter(
        (device) => types.includes(device.type) && !usedIds.has(device.id)
      );

      return matches.slice(0, count).map((device) => {
        usedIds.add(device.id);
        return { device, size };
      });
    };

    return [
      ...pick(['weather'], 'large'),
      ...pick(['calendars'], 'large'),
      ...pick(['media', 'climate', 'lights'], 'medium', 2),
      ...pick(['power', 'grouped-sensors', 'sensors', 'switches'], 'medium', 2),
      ...pick(['persons'], 'small', 2),
      ...pick(['locks'], 'small', 2),
      ...pick(['covers', 'vacuums'], 'medium', 2),
    ];
  }, [deviceMap]);

  const visibleDeviceCount = deviceMap.size;
  const hasFeaturedCards = featuredCards.length > 0;

  const primaryButtonStyle = {
    background: `linear-gradient(135deg, ${accentColor}, ${accentColor}cc)`,
    boxShadow: `0 20px 44px -24px ${accentColor}88`,
  };

  const summaryItems = [
    { label: t('dashboard.homeOverview.stats.visibleDevices'), value: visibleDeviceCount },
    { label: t('dashboard.homeOverview.stats.featuredCards'), value: featuredCards.length },
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

          <div className="flex flex-col gap-2 md:flex-row md:items-end md:justify-between">
            <div>
              <h2 className={`text-lg font-semibold ${surface.textPrimary}`}>
                {t('dashboard.homeOverview.featuredTitle')}
              </h2>
              <p className={`mt-1 text-sm ${surface.textSecondary}`}>
                {t('dashboard.homeOverview.featuredDescription')}
              </p>
            </div>
          </div>
        </div>

        {hasFeaturedCards ? (
          <div className="mt-5 grid w-full auto-rows-[87px] grid-flow-row-dense grid-cols-2 gap-2 md:grid-cols-4 md:gap-3 lg:gap-4 xl:grid-cols-6 2xl:grid-cols-8">
            {featuredCards.map(({ device, size }) => (
              <DashboardCardItem
                key={device.id}
                id={device.id}
                device={device}
                size={cardSizes[device.id] || size}
                isEditMode={isEditMode}
                handleSizeChange={updateCardSize}
              />
            ))}

            <div
              className={`relative h-full rounded-3xl border p-5 ${surface.borderStrong} ${surface.panelMuted} ${getCardSpanClass('medium')}`}
            >
              <div
                className="flex h-11 w-11 items-center justify-center rounded-2xl"
                style={{ backgroundColor: `${accentColor}18`, color: accentColor }}
              >
                <Shield className="h-5 w-5" />
              </div>
              <h3 className={`mt-4 text-base font-semibold ${surface.textPrimary}`}>
                {t('dashboard.homeOverview.securityTitle')}
              </h3>
              <p className={`mt-2 text-sm leading-6 ${surface.textSecondary}`}>
                {t('dashboard.homeOverview.securityDescription')}
              </p>
              <button
                type="button"
                onClick={() => setActiveSection('security')}
                className={`mt-5 inline-flex items-center gap-2 rounded-full border px-3.5 py-2 text-sm font-medium transition-colors ${surface.border} ${surface.textPrimary} ${surface.hoverBg}`}
              >
                {t('sidebar.security')}
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>
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
