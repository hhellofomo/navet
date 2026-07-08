import { Palette, Sliders } from 'lucide-react';
import { memo, useEffect, useMemo, useState } from 'react';
import {
  CardDialogHeader,
  CardDialogTabList,
  CardDialogTabTrigger,
} from '@/app/components/patterns';
import { DialogDoneFooter, ModalSurface } from '@/app/components/primitives';
import { TabPanel, Tabs } from '@/app/components/primitives/tabs';
import { CustomCardTintPicker, CustomScrollbar } from '@/app/components/shared/device-editor';
import {
  getCustomCardTintSurface,
  getInheritedDialogSectionStyle,
  normalizeCustomCardTint,
  withTintAlpha,
} from '@/app/components/shared/theme/custom-card-tint-surface';
import { getThemeSurfaceTokens } from '@/app/components/shared/theme/theme-surface-tokens';
import { cn } from '@/app/components/ui/utils';
import { useI18n } from '@/app/hooks';
import type { ThemeType } from '@/app/hooks/use-theme';
import { getEntityTypeLabel } from '@/app/utils/entity-type-label';
import { VacuumCleaningControls } from './vacuum-cleaning-controls';
import { VacuumPlannerSection } from './vacuum-planner-section';
import { getVacuumSettingsDialogSurface } from './vacuum-settings-dialog-surface';
import { VacuumStatusHeader } from './vacuum-status-header';
import { VacuumStatusMetrics } from './vacuum-status-metrics';
import type { VacuumStatus } from './vacuum-utils';

type PlannerView = 'all' | 'rooms' | 'zones';
type CleaningMode = 'auto' | 'spot' | 'edge' | 'room';

interface VacuumSettingsDialogProps {
  entityId: string;
  isOpen: boolean;
  onClose: () => void;
  onStartCleaning: () => void;
  onPauseCleaning?: () => void;
  onReturnHome: () => void;
  name: string;
  room: string;
  theme: ThemeType;
  accentColorValue: string;
  currentStatus?: VacuumStatus;
  battery?: number;
  cleanedArea?: string;
  cleaningTime?: string;
  cleaningMode?: CleaningMode;
  fanSpeed?: string;
  fanSpeeds?: string[];
  availableRooms?: string[];
  availableZones?: string[];
  tintColor?: string;
  onTintColorChange?: (color: string) => void;
  surfaceGradientClassName?: string;
  surfaceBorderClassName?: string;
  surfaceBackdropClassName?: string;
  surfaceStateClassName?: string;
  surfaceGlowClassName?: string;
  surfaceOverlayClassName?: string;
}

export const VacuumSettingsDialog = memo(function VacuumSettingsDialog({
  entityId,
  isOpen,
  onClose,
  onStartCleaning,
  onPauseCleaning,
  onReturnHome,
  name,
  room,
  theme,
  accentColorValue,
  currentStatus = 'idle',
  battery = 0,
  cleanedArea = '0 m²',
  cleaningTime = '0 min',
  cleaningMode = 'auto',
  fanSpeed,
  fanSpeeds,
  availableRooms,
  availableZones,
  tintColor,
  onTintColorChange,
  surfaceGradientClassName,
  surfaceBorderClassName,
  surfaceBackdropClassName,
  surfaceStateClassName,
  surfaceGlowClassName,
  surfaceOverlayClassName,
}: VacuumSettingsDialogProps) {
  const { t } = useI18n();
  const surface = getThemeSurfaceTokens(theme);
  const entityType = getEntityTypeLabel(entityId);
  const dialogSurface = getVacuumSettingsDialogSurface(theme, currentStatus);
  const isActive = currentStatus === 'cleaning' || currentStatus === 'returning';
  const roomTargets = useMemo(
    () => (availableRooms?.length ? availableRooms : room && room !== 'Whole Home' ? [room] : []),
    [availableRooms, room]
  );
  const zoneTargets = availableZones ?? [];
  const speedOptions = useMemo(
    () =>
      fanSpeeds?.length
        ? fanSpeeds
        : [t('vacuum.speed.quiet'), t('vacuum.speed.standard'), t('vacuum.speed.max')],
    [fanSpeeds, t]
  );
  const initialPlannerView = useMemo<PlannerView>(
    () => (roomTargets.length > 0 ? 'rooms' : zoneTargets.length > 0 ? 'zones' : 'all'),
    [roomTargets.length, zoneTargets.length]
  );
  const [plannerView, setPlannerView] = useState<PlannerView>(initialPlannerView);
  const [selectedRooms, setSelectedRooms] = useState<string[]>(
    roomTargets[0] ? [roomTargets[0]] : []
  );
  const [selectedZones, setSelectedZones] = useState<string[]>(
    zoneTargets[0] ? [zoneTargets[0]] : []
  );
  const [selectedCleaningMode, setSelectedCleaningMode] = useState<CleaningMode>(cleaningMode);
  const [selectedFanSpeed, setSelectedFanSpeed] = useState<string>(
    fanSpeed ?? speedOptions[1] ?? speedOptions[0] ?? ''
  );
  const [localTintColor, setLocalTintColor] = useState<string>(tintColor ?? accentColorValue);
  const [activeTab, setActiveTab] = useState('controls');

  const selectedTargetCount =
    plannerView === 'rooms'
      ? selectedRooms.length
      : plannerView === 'zones'
        ? selectedZones.length
        : roomTargets.length;

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    setPlannerView(initialPlannerView);
    setSelectedRooms(roomTargets[0] ? [roomTargets[0]] : []);
    setSelectedZones(zoneTargets[0] ? [zoneTargets[0]] : []);
    setSelectedCleaningMode(cleaningMode);
    setSelectedFanSpeed(fanSpeed ?? speedOptions[1] ?? speedOptions[0] ?? '');
    setLocalTintColor(tintColor ?? accentColorValue);
  }, [
    accentColorValue,
    cleaningMode,
    fanSpeed,
    initialPlannerView,
    isOpen,
    roomTargets,
    speedOptions,
    tintColor,
    zoneTargets,
  ]);

  const primaryActionLabel =
    currentStatus === 'cleaning' ? t('vacuum.action.pause') : t('vacuum.action.startCleaning');
  const plannerSummaryLabel =
    plannerView === 'all'
      ? t('vacuum.plan.wholeHome')
      : plannerView === 'rooms'
        ? `${selectedTargetCount} ${t('vacuum.plan.rooms')}`
        : `${selectedTargetCount} ${t('vacuum.plan.zones')}`;
  const resolvedTintColor =
    normalizeCustomCardTint(tintColor) ?? normalizeCustomCardTint(localTintColor);
  const tintSurface = getCustomCardTintSurface(theme, resolvedTintColor);
  const sectionStyle = getInheritedDialogSectionStyle(theme, resolvedTintColor, accentColorValue);
  const activeControlColor = resolvedTintColor ?? accentColorValue;
  const activePillStyle = activeControlColor
    ? {
        backgroundColor: withTintAlpha(activeControlColor, theme === 'light' ? 0.14 : 0.18),
        borderColor: withTintAlpha(activeControlColor, theme === 'light' ? 0.24 : 0.34),
        boxShadow: `inset 0 0 0 1px ${withTintAlpha(activeControlColor, theme === 'light' ? 0.14 : 0.2)}`,
      }
    : sectionStyle;
  const softControlStyle = activeControlColor
    ? {
        backgroundColor: withTintAlpha(activeControlColor, theme === 'light' ? 0.08 : 0.12),
        borderColor: withTintAlpha(activeControlColor, theme === 'light' ? 0.16 : 0.22),
      }
    : sectionStyle;

  const handleTintChange = (color: string) => {
    setLocalTintColor(color);
    onTintColorChange?.(color);
  };

  return (
    <ModalSurface
      isOpen={isOpen}
      onOpenChange={(open) => {
        if (!open) {
          onClose();
        }
      }}
      title={name}
      description={entityType}
      disableOpenAutoFocus
      bodyClassName="p-6"
      overlayClassName={surface.dialogBackdrop}
      contentClassName={cn(
        'h-auto max-h-[88vh] max-w-[42rem]',
        surfaceGradientClassName
          ? `bg-gradient-to-br ${surfaceGradientClassName}`
          : dialogSurface.contentClassName,
        surfaceBackdropClassName,
        surfaceStateClassName,
        surfaceBorderClassName ?? dialogSurface.contentBorderClassName
      )}
      contentStyle={tintSurface.panelStyle}
      contentGlowClassName={
        surfaceGlowClassName
          ? `bg-gradient-to-br ${surfaceGlowClassName} to-transparent`
          : dialogSurface.contentGlowClassName
            ? `bg-gradient-to-br ${dialogSurface.contentGlowClassName} to-transparent`
            : undefined
      }
      contentGlowStyle={tintSurface.glowStyle}
      contentOverlayClassName={surfaceOverlayClassName ?? tintSurface.overlayClassName ?? undefined}
    >
      <CustomScrollbar isOn={isActive}>
        <div>
          <CardDialogHeader title={name} description={entityType} entityId={entityId} />

          <Tabs value={activeTab} defaultValue="controls" onValueChange={setActiveTab}>
            <CardDialogTabList>
              <CardDialogTabTrigger
                active={activeTab === 'controls'}
                icon={Sliders}
                onClick={() => setActiveTab('controls')}
              >
                Controls
              </CardDialogTabTrigger>
              <CardDialogTabTrigger
                active={activeTab === 'card'}
                icon={Palette}
                onClick={() => setActiveTab('card')}
              >
                Customize
              </CardDialogTabTrigger>
            </CardDialogTabList>

            <TabPanel value="controls" className="mt-5 space-y-6">
              <VacuumStatusHeader
                currentStatus={currentStatus}
                plannerSummaryLabel={plannerSummaryLabel}
                cleaningMode={selectedCleaningMode}
                selectedFanSpeed={selectedFanSpeed}
                roomTargets={roomTargets}
                plannerView={plannerView}
                primaryActionLabel={primaryActionLabel}
                onStartCleaning={onStartCleaning}
                onPauseCleaning={onPauseCleaning}
                softControlStyle={softControlStyle ?? undefined}
              />

              <VacuumStatusMetrics
                battery={battery}
                cleanedArea={cleanedArea}
                cleaningTime={cleaningTime}
                sectionStyle={sectionStyle ?? undefined}
              />

              <VacuumPlannerSection
                plannerView={plannerView}
                onPlannerViewChange={setPlannerView}
                roomTargets={roomTargets}
                zoneTargets={zoneTargets}
                selectedRooms={selectedRooms}
                selectedZones={selectedZones}
                onRoomsChange={setSelectedRooms}
                onZonesChange={setSelectedZones}
                sectionStyle={sectionStyle ?? undefined}
                activePillStyle={activePillStyle ?? undefined}
              />

              <VacuumCleaningControls
                cleaningMode={selectedCleaningMode}
                onCleaningModeChange={setSelectedCleaningMode}
                fanSpeed={selectedFanSpeed}
                onFanSpeedChange={setSelectedFanSpeed}
                fanSpeedOptions={speedOptions}
                currentStatus={currentStatus}
                onStartCleaning={onStartCleaning}
                onPauseCleaning={onPauseCleaning}
                onReturnHome={onReturnHome}
                activePillStyle={activePillStyle}
                softControlStyle={softControlStyle}
                activeControlColor={activeControlColor}
                theme={theme}
              />
            </TabPanel>

            <TabPanel value="card" className="mt-5">
              <CustomCardTintPicker
                value={resolvedTintColor}
                onChange={handleTintChange}
                isOn={theme !== 'light'}
                defaultColor={accentColorValue}
              />
            </TabPanel>
          </Tabs>

          <DialogDoneFooter label={t('common.done')} />
        </div>
      </CustomScrollbar>
    </ModalSurface>
  );
});
