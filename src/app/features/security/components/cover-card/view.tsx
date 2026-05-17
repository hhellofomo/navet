import * as Dialog from '@radix-ui/react-dialog';
import type { HTMLAttributes } from 'react';
import { BaseCard } from '@/app/components/primitives';
import { CardMetric } from '@/app/components/primitives/card-metric';
import { CardMetricActionLayout } from '@/app/components/primitives/card-metric-action-layout';
import { DialogShell } from '@/app/components/primitives/dialog-shell';
import { EntityCardHeader } from '@/app/components/primitives/entity-card-header';
import { EntityCardHeaderIcon } from '@/app/components/primitives/entity-card-header-icon';
import { type CardSize, isCompactCardSize } from '@/app/components/shared/card-size-selector';
import { DialogHeader } from '@/app/components/shared/device-editor';
import { EntityRoomSelector } from '@/app/components/shared/entity-room-selector';
import { getCardShellSurfaceTokens } from '@/app/components/shared/theme/card-shell-surface-tokens';
import { getThemeSurfaceTokens } from '@/app/components/shared/theme/theme-surface-tokens';
import { type ThemeType, useI18n } from '@/app/hooks';
import { getSecurityCardSurfaceTokens } from '../security-card-surface-tokens';
import { CoverActionRow } from './cover-action-row';
import { CoverPresetChips } from './cover-preset-chips';
import { CoverWindowVisualization } from './cover-window-visualization';
import type { CoverIconButtonProps, DeviceClass, DeviceClassConfig } from './types';

type CoverColorSet = {
  gradient: string;
  border: string;
  iconBg: string;
  accent: string;
  glow: string;
};

const COVER_OPEN_TONE_THRESHOLD = 50;

function isCoverOpenTone(position: number) {
  return position > COVER_OPEN_TONE_THRESHOLD;
}

interface CoverCardViewProps {
  entityId: string;
  name: string;
  room: string;
  position: number;
  deviceClass: DeviceClass;
  deviceClassConfig: Record<DeviceClass, DeviceClassConfig>;
  size: CardSize;
  isEditMode: boolean;
  cardId: string;
  cardProps: HTMLAttributes<HTMLDivElement>;
  openColors: CoverColorSet;
  closedColors: CoverColorSet;
  theme: ThemeType;
  stateDisplay: { text: string; color: string };
  iconButtonProps: CoverIconButtonProps;
  settingsButtonProps: CoverIconButtonProps;
  isSettingsOpen: boolean;
  setIsSettingsOpen: (open: boolean) => void;
  onSizeChange: (id: string, size: CardSize) => void;
  handlePositionChange: (newPosition: number) => void;
  handleOpen: () => void;
  handleClose: () => void;
  handleStop: () => void;
  setDeviceClass: (deviceClass: DeviceClass) => void;
}

export function CoverCardView({
  entityId,
  name,
  room: _room,
  position,
  deviceClass,
  deviceClassConfig,
  size,
  isEditMode: _isEditMode,
  cardId: _cardId,
  cardProps,
  openColors,
  closedColors,
  theme,
  stateDisplay,
  iconButtonProps,
  settingsButtonProps,
  isSettingsOpen,
  setIsSettingsOpen,
  onSizeChange: _onSizeChange,
  handlePositionChange,
  handleOpen,
  handleClose,
  handleStop,
  setDeviceClass,
}: CoverCardViewProps) {
  const { t } = useI18n();
  const isSmall = isCompactCardSize(size);
  const isMedium = size === 'medium';
  const clampedPosition = Math.max(0, Math.min(100, position));

  const surface = getThemeSurfaceTokens(theme);
  const cardShell = getCardShellSurfaceTokens(theme);
  const securitySurface = getSecurityCardSurfaceTokens(theme);

  const DeviceIcon = deviceClassConfig[deviceClass].icon;

  return (
    <BaseCard
      size={size}
      {...cardProps}
      frameClassName={`bg-linear-to-br ${closedColors.gradient} ${cardShell.rootFrameClassName} ${isCoverOpenTone(clampedPosition) ? openColors.border : closedColors.border} ${securitySurface.containerShadowClassName}`}
      disableDefaultSheen
      overlay={
        <>
          <div
            className={`absolute inset-x-0 bottom-0 bg-linear-to-br ${openColors.gradient} transition-[height] duration-100 ease-out`}
            style={{ height: `${clampedPosition}%` }}
          />
          <div className={`absolute inset-0 bg-linear-to-br ${openColors.glow} to-transparent`} />
          {securitySurface.overlayClassName ? (
            <div className={`absolute inset-0 ${securitySurface.overlayClassName}`} />
          ) : null}
        </>
      }
      contentClassName="h-full"
    >
      <div className="relative flex h-full flex-col">
        {isSmall ? (
          <CompactCoverLayout
            name={name}
            size={size}
            DeviceIcon={DeviceIcon}
            iconButtonProps={iconButtonProps}
            settingsButtonProps={settingsButtonProps}
            deviceLabel={t(deviceClassConfig[deviceClass].labelKey)}
            openColors={openColors}
            position={clampedPosition}
            stateDisplay={stateDisplay}
            theme={theme}
            onOpen={handleOpen}
            onStop={handleStop}
            onClose={handleClose}
            onSetPosition={handlePositionChange}
          />
        ) : isMedium ? (
          <MediumCoverLayout
            name={name}
            size={size}
            DeviceIcon={DeviceIcon}
            iconButtonProps={iconButtonProps}
            settingsButtonProps={settingsButtonProps}
            deviceLabel={t(deviceClassConfig[deviceClass].labelKey)}
            openColors={openColors}
            position={clampedPosition}
            stateDisplay={stateDisplay}
            theme={theme}
            onOpen={handleOpen}
            onStop={handleStop}
            onClose={handleClose}
            onSetPosition={handlePositionChange}
          />
        ) : (
          <LargeCoverLayout
            name={name}
            size={size}
            DeviceIcon={DeviceIcon}
            iconButtonProps={iconButtonProps}
            settingsButtonProps={settingsButtonProps}
            deviceLabel={t(deviceClassConfig[deviceClass].labelKey)}
            openColors={openColors}
            position={clampedPosition}
            stateDisplay={stateDisplay}
            theme={theme}
            onOpen={handleOpen}
            onStop={handleStop}
            onClose={handleClose}
            onSetPosition={handlePositionChange}
          />
        )}
      </div>

      {isSettingsOpen ? (
        <DialogShell
          isOpen={isSettingsOpen}
          onOpenChange={setIsSettingsOpen}
          overlayClassName={`animate-in fade-in ${surface.dialogBackdrop}`}
          contentClassName={`fixed top-1/2 left-1/2 z-50 w-[90vw] max-w-md -translate-x-1/2 -translate-y-1/2 rounded-3xl border p-6 shadow-2xl backdrop-blur-xl animate-in fade-in zoom-in duration-200 ${securitySurface.dialogContentClassName}`}
        >
          <DialogHeader
            title={t('cover.settings.deviceType')}
            description={t('cover.settings.description', { name })}
            isOn
            supportingContent={
              <EntityRoomSelector entityId={entityId} label={t('common.room')} compact />
            }
          />

          <div className="grid grid-cols-2 gap-3 mb-6">
            {(Object.keys(deviceClassConfig) as DeviceClass[]).map((type) => {
              const config = deviceClassConfig[type];
              const Icon = config.icon;
              const isSelected = deviceClass === type;

              return (
                <button
                  type="button"
                  key={type}
                  onClick={() => setDeviceClass(type)}
                  className={`rounded-2xl border-2 p-4 transition-all duration-200 ${securitySurface.dialogOptionClassName(isSelected)}`}
                >
                  <div className="flex flex-col items-center gap-2">
                    <div
                      className={`flex h-12 w-12 items-center justify-center rounded-full ${securitySurface.dialogOptionIconWrapClassName(isSelected)}`}
                    >
                      <Icon
                        className={`h-6 w-6 ${securitySurface.dialogOptionIconClassName(isSelected)}`}
                      />
                    </div>
                    <span
                      className={`text-center text-xs font-medium ${securitySurface.dialogOptionTextClassName(isSelected)}`}
                    >
                      {t(config.labelKey)}
                    </span>
                  </div>
                </button>
              );
            })}
          </div>

          <div className="flex gap-3">
            <Dialog.Close asChild>
              <button
                type="button"
                className={`flex-1 rounded-xl py-2.5 text-sm font-medium text-white transition-colors ${securitySurface.dialogCancelButtonClassName}`}
              >
                {t('common.cancel')}
              </button>
            </Dialog.Close>
            <Dialog.Close asChild>
              <button
                type="button"
                className="flex-1 py-2.5 bg-indigo-600 hover:bg-indigo-700 rounded-xl text-white text-sm font-medium transition-colors"
              >
                {t('common.done')}
              </button>
            </Dialog.Close>
          </div>
        </DialogShell>
      ) : null}
    </BaseCard>
  );
}

interface SharedCoverLayoutProps {
  name: string;
  size: CardSize;
  DeviceIcon: DeviceClassConfig['icon'];
  iconButtonProps: CoverIconButtonProps;
  settingsButtonProps: CoverIconButtonProps;
  deviceLabel: string;
  position: number;
  stateDisplay: { text: string; color: string };
  openColors: CoverColorSet;
  theme: ThemeType;
  onOpen: () => void;
  onStop: () => void;
  onClose: () => void;
  onSetPosition?: (newPosition: number) => void;
}

function CoverCardHeader({
  name,
  size,
  DeviceIcon,
  iconButtonProps,
  deviceLabel,
  position,
}: Pick<
  SharedCoverLayoutProps,
  'name' | 'size' | 'DeviceIcon' | 'iconButtonProps' | 'deviceLabel' | 'position'
>) {
  const tone = isCoverOpenTone(position) ? 'primary' : 'neutral';

  return (
    <EntityCardHeader
      title={name}
      subtitle={deviceLabel}
      layout="eyebrow-first"
      size={size}
      tone={tone}
      leading={
        <EntityCardHeaderIcon
          IconComponent={DeviceIcon}
          isActive={isCoverOpenTone(position)}
          size={size}
          tone={tone}
          ariaLabel={iconButtonProps['aria-label']}
          onClick={iconButtonProps.onClick}
          onPointerDown={iconButtonProps.onPointerDown}
        />
      }
    />
  );
}

function CoverPositionMetric({
  position,
  stateDisplay,
  openColors,
  theme,
  size,
}: Pick<SharedCoverLayoutProps, 'position' | 'stateDisplay' | 'openColors' | 'theme'> & {
  size: 'sm' | 'xl';
}) {
  return (
    <CardMetric
      value={`${position}%`}
      label={stateDisplay.text}
      size={size}
      isActive={position > 0}
      accentClassName={openColors.accent}
      theme={theme}
      labelClassName={stateDisplay.color}
    />
  );
}

// Small — no window visualization; the card background split IS the indicator.
function CompactCoverLayout({
  name,
  size,
  DeviceIcon,
  iconButtonProps,
  settingsButtonProps,
  deviceLabel,
  position,
  stateDisplay,
  openColors,
  theme,

  onOpen,
  onStop,
  onClose,
}: SharedCoverLayoutProps) {
  return (
    <div className="flex h-full flex-col">
      <CoverCardHeader
        name={name}
        size={size}
        DeviceIcon={DeviceIcon}
        iconButtonProps={iconButtonProps}
        deviceLabel={deviceLabel}
        position={position}
      />

      <CardMetricActionLayout
        size="small"
        metric={
          <CoverPositionMetric
            position={position}
            stateDisplay={stateDisplay}
            openColors={openColors}
            theme={theme}
            size="sm"
          />
        }
        actions={
          <CoverActionRow
            theme={theme}
            size="small"
            position={position}
            settingsButtonProps={settingsButtonProps}
            onOpen={onOpen}
            onStop={onStop}
            onClose={onClose}
          />
        }
      />
    </div>
  );
}

// Medium — no window visualization; the card background split IS the indicator.
function MediumCoverLayout({
  name,
  size,
  DeviceIcon,
  iconButtonProps,
  settingsButtonProps,
  deviceLabel,
  position,
  stateDisplay,
  openColors,
  theme,

  onOpen,
  onStop,
  onClose,
}: SharedCoverLayoutProps) {
  return (
    <div className="flex h-full flex-col">
      <CoverCardHeader
        name={name}
        size={size}
        DeviceIcon={DeviceIcon}
        iconButtonProps={iconButtonProps}
        deviceLabel={deviceLabel}
        position={position}
      />

      <CardMetricActionLayout
        size="medium"
        metric={
          <CoverPositionMetric
            position={position}
            stateDisplay={stateDisplay}
            openColors={openColors}
            theme={theme}
            size="sm"
          />
        }
        actions={
          <CoverActionRow
            theme={theme}
            size="medium"
            position={position}
            settingsButtonProps={settingsButtonProps}
            onOpen={onOpen}
            onStop={onStop}
            onClose={onClose}
          />
        }
      />
    </div>
  );
}

// Large — keeps the window visualization alongside the split background.
function LargeCoverLayout({
  name,
  size,
  DeviceIcon,
  iconButtonProps,
  settingsButtonProps,
  deviceLabel,
  position,
  stateDisplay,
  openColors,
  theme,

  onOpen,
  onStop,
  onClose,
  onSetPosition,
}: SharedCoverLayoutProps) {
  const { t } = useI18n();

  return (
    <div className="flex h-full flex-col">
      <CoverCardHeader
        name={name}
        size={size}
        DeviceIcon={DeviceIcon}
        iconButtonProps={iconButtonProps}
        deviceLabel={deviceLabel}
        position={position}
      />

      <div className="mt-5 grid flex-1 grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)] gap-5">
        <CoverWindowVisualization
          position={position}
          theme={theme}
          ariaLabel={t('cover.ariaLabel', { name })}
          onSetPosition={onSetPosition ?? (() => undefined)}
        />

        <div className="flex min-w-0 flex-col rounded-[28px] border border-white/10 bg-black/10 p-4 backdrop-blur-sm">
          <CoverPositionMetric
            position={position}
            stateDisplay={stateDisplay}
            openColors={openColors}
            theme={theme}
            size="xl"
          />

          {onSetPosition && (
            <div className="mt-auto pt-4">
              <CoverPresetChips position={position} theme={theme} onSetPosition={onSetPosition} />
            </div>
          )}
        </div>
      </div>

      <div className="mt-3">
        <CoverActionRow
          theme={theme}
          size="medium"
          position={position}
          settingsButtonProps={settingsButtonProps}
          onOpen={onOpen}
          onStop={onStop}
          onClose={onClose}
        />
      </div>
    </div>
  );
}
