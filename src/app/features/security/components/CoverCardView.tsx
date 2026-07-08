import * as Dialog from '@radix-ui/react-dialog';
import * as Slider from '@radix-ui/react-slider';
import { ChevronDown, ChevronUp, Square } from 'lucide-react';
import type { HTMLAttributes } from 'react';
import { CardActionRow } from '@/app/components/shared/card-action-row';
import { CardSettingsActionButton } from '@/app/components/shared/card-settings-action-button';
import { type CardSize, CardSizeSelector } from '@/app/components/shared/card-size-selector';
import { EntityCardHeader } from '@/app/components/shared/entity-card-header';
import { EntityCardHeaderIcon } from '@/app/components/shared/entity-card-header-icon';
import type { ThemeType } from '@/app/hooks';
import type { CoverIconButtonProps, DeviceClass, DeviceClassConfig } from './cover-card.types';

interface CoverCardViewProps {
  name: string;
  room: string;
  position: number;
  deviceClass: DeviceClass;
  deviceClassConfig: Record<DeviceClass, DeviceClassConfig>;
  size: CardSize;
  isEditMode: boolean;
  cardId: string;
  cardProps: HTMLAttributes<HTMLDivElement>;
  cardColors: {
    gradient: string;
    border: string;
    iconBg: string;
    accent: string;
    glow: string;
  };
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
  name,
  room,
  position,
  deviceClass,
  deviceClassConfig,
  size,
  isEditMode,
  cardId,
  cardProps,
  cardColors,
  theme,
  stateDisplay,
  iconButtonProps,
  settingsButtonProps,
  isSettingsOpen,
  setIsSettingsOpen,
  onSizeChange,
  handlePositionChange,
  handleOpen,
  handleClose,
  handleStop,
  setDeviceClass,
}: CoverCardViewProps) {
  // Size-specific styling with intelligent layout adaptation
  const isSmall = size === 'extra-small' || size === 'small';
  const isMedium = size === 'medium';
  const padding = isSmall ? 'p-4' : 'p-5';

  const textColor = theme === 'light' ? 'text-gray-900' : 'text-white';
  const secondaryTextColor = theme === 'light' ? 'text-gray-600' : 'text-gray-300';
  const buttonBg =
    theme === 'light' ? 'bg-gray-900/10 hover:bg-gray-900/20' : 'bg-white/10 hover:bg-white/20';
  const buttonText = theme === 'light' ? 'text-gray-900' : 'text-white';
  const sliderTrackBg = theme === 'light' ? 'bg-gray-200' : 'bg-white/10';
  const actionBtnClass =
    theme === 'light'
      ? 'bg-gray-100 hover:bg-gray-200 text-gray-900'
      : 'bg-white/5 hover:bg-white/10 text-white';

  const DeviceIcon = deviceClassConfig[deviceClass].icon;

  return (
    <div
      {...cardProps}
      className={`relative h-full bg-gradient-to-br ${cardColors.gradient} backdrop-blur-xl rounded-3xl ${padding} border ${cardColors.border} overflow-hidden ${theme === 'light' ? 'shadow-lg' : ''}`}
    >
      {isEditMode && (
        <CardSizeSelector
          currentSize={size}
          onSizeChange={(newSize) => onSizeChange(cardId, newSize)}
        />
      )}
      <div className={`absolute inset-0 bg-gradient-to-br ${cardColors.glow} to-transparent`}></div>

      {/* Light theme frosted overlay */}
      {theme === 'light' && <div className="absolute inset-0 bg-white/60" />}
      <div className="relative h-full flex flex-col">
        <EntityCardHeader
          title={name}
          subtitle={deviceClassConfig[deviceClass].label}
          size={size}
          leading={
            <EntityCardHeaderIcon
              IconComponent={DeviceIcon}
              isActive={position > 50}
              size={size}
              ariaLabel={iconButtonProps['aria-label']}
              onClick={iconButtonProps.onClick}
              onPointerDown={iconButtonProps.onPointerDown}
            />
          }
        />

        {!isSmall && (
          <div className="mb-2 space-y-0.5">
            <p className={`truncate text-xs ${secondaryTextColor}`}>{room}</p>
            <p className={`truncate text-xs ${stateDisplay.color}`}>{stateDisplay.text}</p>
          </div>
        )}

        {isSmall ? (
          <div className="flex-1 flex flex-col justify-end gap-2">
            <div className="flex flex-col">
              <div className={`text-3xl font-bold ${textColor} leading-none mb-1`}>{position}%</div>
              <div className={`text-xs ${stateDisplay.color}`}>{stateDisplay.text}</div>
            </div>

            <CardActionRow
              theme={theme}
              size="small"
              leftContent={
                <>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleOpen();
                    }}
                    className={`h-7 w-7 rounded-full ${buttonBg} hover:scale-105 transition-all flex items-center justify-center`}
                    title="Open"
                  >
                    <ChevronUp className={`h-3 w-3 ${buttonText}`} />
                  </button>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleStop();
                    }}
                    className={`h-7 w-7 rounded-full ${buttonBg} hover:scale-105 transition-all flex items-center justify-center`}
                    title="Stop"
                  >
                    <Square className={`h-3 w-3 ${buttonText}`} />
                  </button>
                </>
              }
              overflowItems={[
                {
                  key: 'close',
                  label: 'Close',
                  icon: ChevronDown,
                  onSelect: handleClose,
                },
              ]}
              rightContent={
                <CardSettingsActionButton {...settingsButtonProps} theme={theme} size="small" />
              }
            />
          </div>
        ) : isMedium ? (
          <div className="flex-1 flex flex-col gap-2">
            <div className="flex-1 flex flex-col justify-center gap-2">
              <div className={`text-3xl font-bold ${textColor} leading-none mb-1`}>{position}%</div>
              <Slider.Root
                value={[position]}
                onValueChange={(value) => handlePositionChange(value[0])}
                max={100}
                step={1}
                className="relative flex items-center w-full h-5"
              >
                <Slider.Track className={`relative grow rounded-full h-1 ${sliderTrackBg}`}>
                  <Slider.Range className="absolute rounded-full h-full bg-gradient-to-r from-indigo-400 to-indigo-600" />
                </Slider.Track>
                <Slider.Thumb className="block w-4 h-4 bg-white rounded-full shadow-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 cursor-pointer" />
              </Slider.Root>
            </div>
            <div className="mt-auto pt-2">
              <CardActionRow
                theme={theme}
                size="medium"
                leftContent={
                  <>
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleOpen();
                      }}
                      className={`flex-1 py-1.5 ${actionBtnClass} rounded-lg text-[10px] font-medium transition-colors flex items-center justify-center gap-0.5`}
                    >
                      <ChevronUp className="h-3 w-3" /> Open
                    </button>
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleStop();
                      }}
                      className={`flex-1 py-1.5 ${actionBtnClass} rounded-lg text-[10px] font-medium transition-colors flex items-center justify-center gap-0.5`}
                    >
                      <Square className="h-3 w-3" /> Stop
                    </button>
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleClose();
                      }}
                      className={`flex-1 py-1.5 ${actionBtnClass} rounded-lg text-[10px] font-medium transition-colors flex items-center justify-center gap-0.5`}
                    >
                      <ChevronDown className="h-3 w-3" /> Close
                    </button>
                  </>
                }
                rightContent={
                  <CardSettingsActionButton {...settingsButtonProps} theme={theme} size="small" />
                }
              />
            </div>
          </div>
        ) : (
          <div className="flex-1 flex flex-col">
            <div className="flex-1 flex flex-col justify-center">
              <div className={`text-3xl font-bold ${textColor} mb-1`}>{position}%</div>
              <Slider.Root
                value={[position]}
                onValueChange={(value) => handlePositionChange(value[0])}
                max={100}
                step={1}
                className="relative flex items-center w-full h-5 mb-3"
              >
                <Slider.Track className={`relative grow rounded-full h-1 ${sliderTrackBg}`}>
                  <Slider.Range className="absolute rounded-full h-full bg-gradient-to-r from-indigo-400 to-indigo-600" />
                </Slider.Track>
                <Slider.Thumb className="block w-4 h-4 bg-white rounded-full shadow-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 cursor-pointer" />
              </Slider.Root>
            </div>
            <div className="mt-auto pt-4">
              <CardActionRow
                theme={theme}
                size="large"
                leftContent={
                  <>
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleOpen();
                      }}
                      className={`flex-1 py-2 ${actionBtnClass} rounded-lg text-xs font-medium transition-colors flex items-center justify-center gap-1`}
                    >
                      <ChevronUp className="h-3.5 w-3.5" /> Open
                    </button>
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleStop();
                      }}
                      className={`flex-1 py-2 ${actionBtnClass} rounded-lg text-xs font-medium transition-colors flex items-center justify-center gap-1`}
                    >
                      <Square className="h-3.5 w-3.5" /> Stop
                    </button>
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleClose();
                      }}
                      className={`flex-1 py-2 ${actionBtnClass} rounded-lg text-xs font-medium transition-colors flex items-center justify-center gap-1`}
                    >
                      <ChevronDown className="h-3.5 w-3.5" /> Close
                    </button>
                  </>
                }
                rightContent={
                  <CardSettingsActionButton {...settingsButtonProps} theme={theme} size="medium" />
                }
              />
            </div>
          </div>
        )}
      </div>

      {/* Device Class Settings Dialog */}
      <Dialog.Root open={isSettingsOpen} onOpenChange={setIsSettingsOpen}>
        <Dialog.Portal>
          <Dialog.Overlay className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 animate-in fade-in" />
          <Dialog.Content className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-gradient-to-br from-gray-900/95 to-gray-950/95 backdrop-blur-xl border border-gray-700/50 rounded-3xl p-6 w-[90vw] max-w-md z-50 shadow-2xl animate-in fade-in zoom-in duration-200">
            <Dialog.Title className="text-xl font-semibold text-white mb-2">
              Device Type
            </Dialog.Title>
            <Dialog.Description className="text-sm text-gray-300 mb-6">
              Select the type of cover for {name}
            </Dialog.Description>

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
                    className={`p-4 rounded-2xl border-2 transition-all duration-200 ${
                      isSelected
                        ? 'bg-indigo-500/20 border-indigo-500 shadow-lg shadow-indigo-500/20'
                        : 'bg-white/5 border-white/10 hover:bg-white/10 hover:border-white/20'
                    }`}
                  >
                    <div className="flex flex-col items-center gap-2">
                      <div
                        className={`w-12 h-12 rounded-full flex items-center justify-center ${
                          isSelected ? 'bg-indigo-500/30' : 'bg-white/10'
                        }`}
                      >
                        <Icon
                          className={`w-6 h-6 ${isSelected ? 'text-indigo-400' : 'text-gray-300'}`}
                        />
                      </div>
                      <span
                        className={`text-xs font-medium text-center ${
                          isSelected ? 'text-white' : 'text-gray-300'
                        }`}
                      >
                        {config.label}
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
                  className="flex-1 py-2.5 bg-white/5 hover:bg-white/10 rounded-xl text-white text-sm font-medium transition-colors"
                >
                  Cancel
                </button>
              </Dialog.Close>
              <Dialog.Close asChild>
                <button
                  type="button"
                  className="flex-1 py-2.5 bg-indigo-600 hover:bg-indigo-700 rounded-xl text-white text-sm font-medium transition-colors"
                >
                  Done
                </button>
              </Dialog.Close>
            </div>
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>
    </div>
  );
}
