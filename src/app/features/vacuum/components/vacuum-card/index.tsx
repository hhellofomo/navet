import { Bot, type LucideIcon, Map as MapIcon, Timer } from 'lucide-react';
import { memo } from 'react';
import { BaseCard, CardMetric } from '@/app/components/primitives';
import { EntityCardHeader } from '@/app/components/primitives/entity-card-header';
import { EntityCardHeaderIcon } from '@/app/components/primitives/entity-card-header-icon';
import { type CardSize, isCompactCardSize } from '@/app/components/shared/card-size-selector';
import { getCardShellSurfaceTokens } from '@/app/components/shared/theme/card-shell-surface-tokens';
import { getCardStateSurfaceTokens } from '@/app/components/shared/theme/card-state-surface-tokens';
import { getThemeSurfaceTokens } from '@/app/components/shared/theme/theme-surface-tokens';
import { cn } from '@/app/components/ui/utils';
import { useHomeAssistant, useI18n, useTheme } from '@/app/hooks';
import type { ThemeType } from '@/app/hooks/use-theme';
import { homeAssistantSelectors } from '@/app/stores/selectors';
import { useVacuumControl } from '../vacuum/use-vacuum-control';
import { VacuumControlsLarge } from '../vacuum/vacuum-controls-large';
import { VacuumControlsMedium } from '../vacuum/vacuum-controls-medium';
import { VacuumControlsSmall } from '../vacuum/vacuum-controls-small';
import { resolveVacuumGlanceMetrics, type VacuumLevelMetric } from '../vacuum/vacuum-metrics';
import { VacuumSettingsDialog } from '../vacuum/vacuum-settings-dialog';
import {
  deriveVacuumProgressMetric,
  getVacuumThemeStatus,
  normalizeVacuumStatus,
  type VacuumStatus,
} from '../vacuum/vacuum-utils';

type VacuumCardSize = 'small' | 'medium' | 'large';

interface VacuumCardProps {
  id: string;
  name: string;
  status: VacuumStatus;
  battery: number;
  cleaningProgress?: number;
  cleanedArea?: string;
  cleaningTime?: string;
  nextCleaning?: string;
  waterLevel?: number | string;
  binLevel?: number | string;
  room?: string;
  size: CardSize;
  onSizeChange: (id: string, size: CardSize) => void;
  isEditMode: boolean;
}

function normalizeVacuumCardSize(size: CardSize): VacuumCardSize {
  if (size === 'small' || size === 'medium' || size === 'large') {
    return size;
  }

  return 'medium';
}

function normalizeVacuumDisplayName(value: string): string {
  const trimmed = value.trim().replace(/\s+/g, ' ');
  const parts = trimmed.split(' ');

  if (parts.length % 2 === 0) {
    const half = parts.length / 2;
    const left = parts.slice(0, half).join(' ');
    const right = parts.slice(half).join(' ');

    if (left === right) {
      return left;
    }
  }

  return trimmed;
}

function getStatusLabelKey(status: VacuumStatus) {
  switch (status) {
    case 'cleaning':
      return 'vacuum.status.cleaning';
    case 'returning':
      return 'vacuum.status.returning';
    case 'docked':
      return 'vacuum.status.docked';
    case 'paused':
      return 'vacuum.status.paused';
    default:
      return 'vacuum.status.idle';
  }
}

function MetricPill({
  Icon,
  label,
  value,
  metric,
  theme,
  compact = false,
}: {
  Icon: LucideIcon;
  label: string;
  value: string;
  metric?: VacuumLevelMetric;
  theme: ThemeType;
  compact?: boolean;
}) {
  const surface = getThemeSurfaceTokens(theme);
  const hasPercentage = typeof metric?.percentage === 'number';

  return (
    <div
      className={cn(
        'min-w-0 rounded-lg border border-white/10 bg-white/6 px-2.5 py-2 shadow-inner shadow-white/5',
        theme === 'light' && 'border-slate-200/70 bg-white/70 shadow-none',
        compact && 'rounded-md px-2 py-1'
      )}
    >
      <div className="flex items-center gap-1.5">
        <Icon
          className={cn(
            compact ? 'h-3 w-3 shrink-0' : 'h-3.5 w-3.5 shrink-0',
            metric?.isWarning ? 'text-amber-300' : surface.textSubtle
          )}
        />
        <span
          className={cn(
            'truncate font-medium',
            compact ? 'text-[0.6rem] leading-none' : 'text-[0.66rem]',
            surface.textSubtle
          )}
        >
          {label}
        </span>
      </div>
      <div
        className={cn(
          'truncate font-semibold',
          compact ? 'mt-0.5 text-xs leading-none' : 'mt-1 text-sm',
          surface.textPrimary
        )}
      >
        {value}
      </div>
      {hasPercentage && !compact ? (
        <div className="mt-1.5 h-1 overflow-hidden rounded-full bg-white/12">
          <div
            className={cn(
              'h-full rounded-full',
              metric?.isWarning ? 'bg-amber-300' : 'bg-white/72',
              theme === 'light' && (metric?.isWarning ? 'bg-amber-500' : 'bg-slate-800/70')
            )}
            style={{ width: `${metric?.percentage ?? 0}%` }}
          />
        </div>
      ) : null}
    </div>
  );
}

function VacuumRunStats({
  cleanedArea,
  cleaningTime,
  progress,
  theme,
}: {
  cleanedArea: string;
  cleaningTime: string;
  progress: number;
  theme: ThemeType;
}) {
  const { t } = useI18n();

  return (
    <div className="grid grid-cols-3 gap-2">
      <MetricPill
        Icon={MapIcon}
        label={t('vacuum.cleanedArea')}
        value={cleanedArea}
        theme={theme}
      />
      <MetricPill
        Icon={Timer}
        label={t('vacuum.cleaningTime')}
        value={cleaningTime}
        theme={theme}
      />
      <MetricPill
        Icon={Bot}
        label={t('vacuum.metric.progress')}
        value={`${progress}%`}
        metric={{ value: `${progress}%`, percentage: progress }}
        theme={theme}
      />
    </div>
  );
}

export const VacuumCard = memo(function VacuumCard({
  id,
  name,
  status,
  battery,
  cleaningProgress,
  cleanedArea = '0 m²',
  cleaningTime = '0 min',
  nextCleaning,
  waterLevel,
  binLevel,
  room = 'Living Room',
  size,
  onSizeChange: _onSizeChange,
  isEditMode: _isEditMode,
}: VacuumCardProps) {
  const resolvedSize = normalizeVacuumCardSize(size);
  const readStringList = (value: unknown) =>
    Array.isArray(value)
      ? value.filter((entry): entry is string => typeof entry === 'string' && entry.length > 0)
      : undefined;
  const parseNumberish = (value: unknown) => {
    if (typeof value === 'number' && Number.isFinite(value)) return value;
    if (typeof value === 'string') {
      const parsed = Number.parseFloat(value);
      return Number.isFinite(parsed) ? parsed : undefined;
    }
    return undefined;
  };
  const liveEntity = useHomeAssistant(homeAssistantSelectors.entity(id));
  const allEntities = useHomeAssistant(homeAssistantSelectors.entities);
  const entityRegistry = useHomeAssistant(homeAssistantSelectors.entityRegistry);
  const liveStatus = normalizeVacuumStatus(liveEntity?.state, status);
  const {
    currentStatus,
    isDialogOpen,
    setIsDialogOpen,
    handleStartCleaning,
    handlePause,
    handleReturnHome,
  } = useVacuumControl({ entityId: id, initialStatus: liveStatus });
  const liveAttrs = liveEntity?.attributes as Record<string, unknown> | undefined;
  const liveName =
    typeof liveAttrs?.friendly_name === 'string' && liveAttrs.friendly_name.length > 0
      ? normalizeVacuumDisplayName(liveAttrs.friendly_name)
      : normalizeVacuumDisplayName(name);
  const glanceMetrics = resolveVacuumGlanceMetrics({
    vacuumEntity: liveEntity,
    vacuumEntityId: id,
    fallbackBattery: battery,
    fallbackNextCleaning: nextCleaning,
    fallbackWaterLevel: waterLevel,
    fallbackBinLevel: binLevel,
    entities: allEntities,
    entityRegistry,
  });
  const liveBattery = glanceMetrics.battery;
  const liveRoom =
    typeof liveAttrs?.current_room === 'string' && liveAttrs.current_room.length > 0
      ? liveAttrs.current_room
      : typeof liveAttrs?.current_zone === 'string' && liveAttrs.current_zone.length > 0
        ? liveAttrs.current_zone
        : typeof liveAttrs?.room === 'string' && liveAttrs.room.length > 0
          ? liveAttrs.room
          : room;
  const liveCleanedAreaValue =
    parseNumberish(liveAttrs?.cleaned_area) ??
    parseNumberish(liveAttrs?.cleaned_area_today) ??
    parseNumberish(liveAttrs?.last_cleaned_area);
  const liveCleanedArea =
    typeof liveCleanedAreaValue === 'number'
      ? `${liveCleanedAreaValue.toFixed(liveCleanedAreaValue >= 10 ? 0 : 1)} m²`
      : cleanedArea;
  const liveCleaningTimeMinutes =
    parseNumberish(liveAttrs?.cleaning_time) ??
    parseNumberish(liveAttrs?.clean_time) ??
    parseNumberish(liveAttrs?.cleaning_duration);
  const liveCleaningTime =
    typeof liveCleaningTimeMinutes === 'number'
      ? `${Math.max(0, Math.round(liveCleaningTimeMinutes))} min`
      : cleaningTime;
  const areaBasedCleaningProgress = (() => {
    const totalAreaValue =
      parseNumberish(liveAttrs?.total_clean_area) ??
      parseNumberish(liveAttrs?.clean_area_total) ??
      parseNumberish(liveAttrs?.total_area);

    if (
      typeof liveCleanedAreaValue === 'number' &&
      typeof totalAreaValue === 'number' &&
      totalAreaValue > 0
    ) {
      return Math.max(0, Math.min(100, (liveCleanedAreaValue / totalAreaValue) * 100));
    }

    return undefined;
  })();
  const liveCleaningProgress =
    parseNumberish(liveAttrs?.cleaning_progress) ??
    parseNumberish(liveAttrs?.clean_progress) ??
    parseNumberish(liveAttrs?.progress) ??
    parseNumberish(liveAttrs?.cleaned_percentage) ??
    parseNumberish(liveAttrs?.cleaning_percentage) ??
    parseNumberish(liveAttrs?.clean_percent) ??
    parseNumberish(liveAttrs?.completed_percentage) ??
    areaBasedCleaningProgress ??
    cleaningProgress;
  const liveFanSpeed = typeof liveAttrs?.fan_speed === 'string' ? liveAttrs.fan_speed : undefined;
  const liveFanSpeeds =
    readStringList(liveAttrs?.fan_speed_list) ??
    readStringList(liveAttrs?.fan_speeds) ??
    readStringList(liveAttrs?.preset_modes);
  const liveCleaningMode =
    typeof liveAttrs?.cleaning_mode === 'string'
      ? liveAttrs.cleaning_mode
      : typeof liveAttrs?.clean_mode === 'string'
        ? liveAttrs.clean_mode
        : undefined;
  const availableRooms =
    readStringList(liveAttrs?.rooms) ??
    readStringList(liveAttrs?.room_names) ??
    readStringList(liveAttrs?.segments);
  const availableZones =
    readStringList(liveAttrs?.zones) ??
    readStringList(liveAttrs?.zone_names) ??
    readStringList(liveAttrs?.available_zones);
  const { theme, colors } = useTheme();
  const cardShell = getCardShellSurfaceTokens(theme);
  const { t } = useI18n();
  const isActive = currentStatus === 'cleaning' || currentStatus === 'returning';
  const stateSurface = getCardStateSurfaceTokens(theme, isActive);
  const vacuumThemeStatus = isActive ? getVacuumThemeStatus(currentStatus) : 'docked';
  const cardColors = colors.vacuum[vacuumThemeStatus];
  const activeShellBackgroundClassName = isActive ? `bg-gradient-to-br ${cardColors.gradient}` : '';
  const frameClassName = `${cardShell.rootFrameClassName} ${activeShellBackgroundClassName} ${cardColors.border} ${stateSurface.containerClassName}`;

  const isSmall = isCompactCardSize(resolvedSize);
  const isMedium = resolvedSize === 'medium';
  const isLarge = resolvedSize === 'large';
  const statusLabel = t(getStatusLabelKey(currentStatus));
  const progressMetric = deriveVacuumProgressMetric({
    status: currentStatus,
    battery: liveBattery,
    cleaningProgress: liveCleaningProgress,
  });
  const surface = getThemeSurfaceTokens(theme);
  return (
    <div className="h-full w-full relative">
      <BaseCard
        size={resolvedSize}
        frameClassName={frameClassName}
        disableDefaultSheen
        overlay={
          <>
            {isActive ? (
              <div
                className={`absolute inset-0 bg-gradient-to-br ${cardColors.glow} to-transparent`}
              />
            ) : null}
            {stateSurface.overlayClassName ? (
              <div className={`absolute inset-0 ${stateSurface.overlayClassName}`} />
            ) : null}
          </>
        }
        contentClassName="h-full"
      >
        <div className="relative h-full flex flex-col">
          <EntityCardHeader
            title={liveName}
            subtitle={t('vacuum.subtitle')}
            layout="eyebrow-first"
            size={resolvedSize}
            accentColor={cardColors.accent}
            tone={
              currentStatus === 'returning'
                ? 'purple'
                : currentStatus === 'cleaning'
                  ? 'primary'
                  : 'neutral'
            }
            leading={
              <EntityCardHeaderIcon
                IconComponent={Bot}
                isActive={isActive}
                size={resolvedSize}
                baseColor={cardColors.accent}
                tone={
                  currentStatus === 'returning'
                    ? 'purple'
                    : currentStatus === 'cleaning'
                      ? 'primary'
                      : 'neutral'
                }
              />
            }
          />

          <div className="flex flex-1 flex-col">
            <div className={cn('flex flex-1 flex-col justify-end', isSmall ? 'gap-3' : 'gap-3.5')}>
              <div>
                <div className="flex items-end justify-between gap-3">
                  <CardMetric
                    value={`${liveBattery}%`}
                    label={t('vacuum.settings.battery')}
                    size={isLarge ? 'xl' : 'sm'}
                    isActive={isActive || liveBattery > 0}
                    accentClassName={cardColors.accent}
                    theme={theme}
                    labelClassName={surface.textSubtle}
                    className="min-w-0"
                  />
                  <div className="min-w-0 text-right">
                    <div className={cn('truncate text-sm font-semibold', surface.textPrimary)}>
                      {statusLabel}
                    </div>
                    <div className={cn('mt-1 truncate text-xs font-medium', surface.textSubtle)}>
                      {liveRoom}
                    </div>
                  </div>
                </div>
              </div>

              {isLarge ? (
                <VacuumRunStats
                  cleanedArea={liveCleanedArea}
                  cleaningTime={liveCleaningTime}
                  progress={progressMetric.progress}
                  theme={theme}
                />
              ) : null}
            </div>

            <div className={cn(isMedium ? 'pt-2' : 'pt-4', isSmall && 'mt-auto')}>
              {isSmall ? (
                <VacuumControlsSmall
                  currentStatus={currentStatus}
                  onStartCleaning={handleStartCleaning}
                  onPause={handlePause}
                  onReturnHome={handleReturnHome}
                  onOpenSettings={() => setIsDialogOpen(true)}
                  theme={theme}
                  accentColorValue={cardColors.accent}
                />
              ) : isMedium ? (
                <VacuumControlsMedium
                  currentStatus={currentStatus}
                  onStartCleaning={handleStartCleaning}
                  onPause={handlePause}
                  onReturnHome={handleReturnHome}
                  onOpenSettings={() => setIsDialogOpen(true)}
                  theme={theme}
                  accentColorValue={cardColors.accent}
                />
              ) : (
                <VacuumControlsLarge
                  currentStatus={currentStatus}
                  onStartCleaning={handleStartCleaning}
                  onPause={handlePause}
                  onReturnHome={handleReturnHome}
                  onOpenSettings={() => setIsDialogOpen(true)}
                  theme={theme}
                  accentColorValue={cardColors.accent}
                />
              )}
            </div>
          </div>
        </div>
      </BaseCard>

      {isDialogOpen ? (
        <VacuumSettingsDialog
          entityId={id}
          isOpen={isDialogOpen}
          onClose={() => setIsDialogOpen(false)}
          onStartCleaning={handleStartCleaning}
          onPauseCleaning={handlePause}
          onReturnHome={handleReturnHome}
          name={liveName}
          room={liveRoom}
          theme={theme}
          accentColorValue={cardColors.accent}
          currentStatus={currentStatus}
          battery={liveBattery}
          cleanedArea={liveCleanedArea}
          cleaningTime={liveCleaningTime}
          cleaningMode={
            liveCleaningMode === 'spot' ||
            liveCleaningMode === 'edge' ||
            liveCleaningMode === 'room' ||
            liveCleaningMode === 'auto'
              ? liveCleaningMode
              : 'auto'
          }
          fanSpeed={liveFanSpeed}
          fanSpeeds={liveFanSpeeds}
          availableRooms={availableRooms}
          availableZones={availableZones}
          surfaceGradientClassName={cardColors.gradient}
          surfaceBorderClassName={theme !== 'dark' ? cardColors.border : undefined}
          surfaceBackdropClassName={cardShell.backdropClassName}
          surfaceStateClassName={stateSurface.containerClassName}
          surfaceGlowClassName={isActive ? cardColors.glow : undefined}
          surfaceOverlayClassName={stateSurface.overlayClassName ?? undefined}
        />
      ) : null}
    </div>
  );
});
