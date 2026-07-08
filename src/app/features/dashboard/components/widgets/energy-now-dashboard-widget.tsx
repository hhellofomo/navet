import { memo, useMemo, useState } from 'react';
import type { CardSize } from '@/app/components/shared/card-size-selector';
import { HOME_WIDGET_ROOM } from '@/app/features/dashboard/stores/custom-cards-store';
import { useEnergyUsageSensorOptions } from '@/app/features/energy';
import { useEnergyDashboard } from '@/app/features/energy/hooks/use-energy-dashboard';
import { useEnergyLoadHistory } from '@/app/features/energy/hooks/use-energy-load-history';
import { useAreaRooms, useI18n, useTheme } from '@/app/hooks';
import { EnergyNowCardView } from './energy-now-card-view';
import { EnergyNowSettingsDialog, type EnergySourceOption } from './energy-now-settings-dialog';
import { EnergyNowStatusWidget } from './energy-now-status-widget';

interface EnergyNowDashboardWidgetProps {
  size?: CardSize;
  data?: EnergyNowWidgetData;
  onUpdate?: (data: EnergyNowWidgetData) => void;
  isEditMode?: boolean;
  room?: string;
  onRoomChange?: (room: string) => void;
}

export interface EnergyNowWidgetData {
  selectedSourceId?: string;
  tintColor?: string;
}

function getSelectedSourceId(value: unknown): string | undefined {
  return typeof value === 'string' ? value : undefined;
}

export const EnergyNowDashboardWidget = memo(function EnergyNowDashboardWidget({
  size = 'medium',
  data,
  onUpdate,
  room,
  onRoomChange,
}: EnergyNowDashboardWidgetProps) {
  const { theme, accentColor } = useTheme();
  const { t } = useI18n();
  const rooms = useAreaRooms();
  const extraUsageSensorOptions = useEnergyUsageSensorOptions();
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const {
    overview,
    sourceConfig,
    currentLoadStatisticId,
    todayTotalUsageKWh,
    isConnected,
    isConfigured,
  } = useEnergyDashboard();
  const selectedSourceId = getSelectedSourceId(data?.selectedSourceId);
  const tintColor = typeof data?.tintColor === 'string' ? data.tintColor : undefined;
  const roomValue = room === 'All' || !room ? HOME_WIDGET_ROOM : room;
  const roomLabel = roomValue === HOME_WIDGET_ROOM ? t('dashboard.roomNav.all') : roomValue;
  const roomOptions = [
    { label: t('dashboard.roomNav.all'), value: HOME_WIDGET_ROOM },
    ...rooms.map((entry) => ({ label: entry, value: entry })),
  ];

  const sourceOptions = useMemo(() => {
    const options: EnergySourceOption[] = [
      {
        id: 'home-load',
        name: t('widgets.energyNow.settings.home'),
        currentPowerW: overview.totals.currentLoadW,
        todayUsageKWh: todayTotalUsageKWh,
        trendEntityId: currentLoadStatisticId,
        group: 'home',
      },
    ];

    if (!sourceConfig) {
      return options;
    }

    if (sourceConfig.solarPowerEntityId) {
      options.push({
        id: 'solar',
        name: t('energy.setup.fields.solarPower.label'),
        currentPowerW: overview.totals.solarW,
        todayUsageKWh: overview.totals.solarTodayKWh,
        trendEntityId: sourceConfig.solarPowerEntityId,
        group: 'sources',
      });
    }

    if (sourceConfig.gridImportPowerEntityId) {
      options.push({
        id: 'grid-import',
        name: t('energy.stats.gridImport'),
        currentPowerW: overview.totals.importW,
        todayUsageKWh: overview.totals.importTodayKWh,
        trendEntityId: sourceConfig.gridImportPowerEntityId,
        group: 'sources',
      });
    }

    const consumersById = new Map(overview.topConsumers.map((consumer) => [consumer.id, consumer]));
    for (const device of sourceConfig.devices) {
      if (!device.powerEntityId) {
        continue;
      }

      const consumer = consumersById.get(device.entityId);
      options.push({
        id: `device:${device.entityId}`,
        name: device.name,
        currentPowerW: consumer?.powerW ?? 0,
        todayUsageKWh: consumer?.energyKWh ?? 0,
        trendEntityId: device.powerEntityId,
        group: 'devices',
      });
    }

    const usedTrendEntityIds = new Set(
      options.map((option) => option.trendEntityId).filter(Boolean)
    );
    options.push(
      ...extraUsageSensorOptions
        .filter(
          (option) =>
            !usedTrendEntityIds.has(option.trendEntityId) &&
            (option.todayUsageKWh > 0 || option.currentPowerW > 0)
        )
        .map((option) => ({
          ...option,
          group: 'devices' as const,
        }))
    );

    return options;
  }, [
    currentLoadStatisticId,
    extraUsageSensorOptions,
    overview,
    sourceConfig,
    t,
    todayTotalUsageKWh,
  ]);

  const selectedOption =
    sourceOptions.find((option) => option.id === selectedSourceId) ?? sourceOptions[0] ?? null;
  const selectedTrend = useEnergyLoadHistory(
    selectedOption?.trendEntityId,
    selectedOption?.currentPowerW ?? overview.totals.currentLoadW
  );

  if (!isConnected) {
    return <EnergyNowStatusWidget message={t('network.disconnectedDescription')} />;
  }

  if (!isConfigured) {
    return <EnergyNowStatusWidget message={t('energy.setup.panelDescription')} />;
  }

  return (
    <>
      {onUpdate ? (
        <button
          type="button"
          className="h-full w-full cursor-pointer text-left"
          onClick={() => setIsSettingsOpen(true)}
        >
          <EnergyNowCardView
            title={selectedOption?.name ?? t('widgets.energyNow.settings.home')}
            currentLoadW={selectedOption?.currentPowerW ?? overview.totals.currentLoadW}
            todayUsageKWh={selectedOption?.todayUsageKWh ?? todayTotalUsageKWh}
            trend={selectedTrend}
            accentColor={accentColor}
            size={size}
            tintColor={tintColor}
          />
        </button>
      ) : (
        <EnergyNowCardView
          title={selectedOption?.name ?? t('widgets.energyNow.settings.home')}
          currentLoadW={selectedOption?.currentPowerW ?? overview.totals.currentLoadW}
          todayUsageKWh={selectedOption?.todayUsageKWh ?? todayTotalUsageKWh}
          trend={selectedTrend}
          accentColor={accentColor}
          size={size}
          tintColor={tintColor}
        />
      )}

      <EnergyNowSettingsDialog
        isOpen={isSettingsOpen}
        onOpenChange={setIsSettingsOpen}
        options={sourceOptions}
        selectedSourceId={selectedOption?.id}
        onSelectionChange={(nextSelectedSourceId) =>
          onUpdate?.({ selectedSourceId: nextSelectedSourceId })
        }
        roomValue={roomValue}
        roomLabel={roomLabel}
        roomOptions={roomOptions}
        onRoomChange={onRoomChange}
        tintColor={tintColor}
        onTintColorChange={(nextTintColor) =>
          onUpdate?.({ ...(data ?? {}), tintColor: nextTintColor })
        }
        theme={theme}
      />
    </>
  );
});

export type { EnergySourceOption };
export { EnergyNowSettingsDialog };
