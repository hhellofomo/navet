import { Settings2, Wind } from 'lucide-react';
import { memo, useState } from 'react';
import { type CardSize, CardSizeSelector } from '@/app/components/shared/card-size-selector';
import { EntityCardHeaderIcon } from '@/app/components/shared/entity-card-header-icon';
import { useEntityCardInteractionController } from '@/app/components/shared/entity-card-interaction-controller';
import { CardWrapper } from '@/app/components/ui/card-wrapper';
import { useTheme } from '@/app/contexts/theme-context';
import { HVACSettingsDialog } from '../hvac-settings-dialog';
import { HVACGauge } from './hvac-gauge';
import { HVACModeControls } from './hvac-mode-controls';
import { HVACTempControls } from './hvac-temp-controls';

interface HVACCardProps {
  id: string;
  name: string;
  room: string;
  initialTemp?: number;
  initialCurrentTemp?: number;
  initialMode?: string;
  initialState?: boolean;
  size: CardSize;
  onSizeChange: (id: string, size: CardSize) => void;
  isEditMode: boolean;
}

export const HVACCard = memo(function HVACCard({
  id,
  name,
  room,
  initialTemp = 21,
  initialCurrentTemp = 22,
  initialMode = 'cool',
  initialState = true,
  size,
  onSizeChange,
  isEditMode,
}: HVACCardProps) {
  const [targetTemp, setTargetTemp] = useState(initialTemp);
  const [currentTemp] = useState(initialCurrentTemp);
  const [mode, setMode] = useState(initialMode);
  const [isOn, setIsOn] = useState(initialState);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const { colors, theme } = useTheme();

  // Size-specific styling
  const isSmall = size === 'extra-small' || size === 'small';
  const isMedium = size === 'medium';
  const _isLarge = size === 'large';

  // Get theme-aware colors based on mode
  const getCardColors = () => {
    if (!isOn) return colors.hvac.off;
    switch (mode) {
      case 'cool':
        return colors.hvac.cooling;
      case 'heat':
        return colors.hvac.heating;
      default:
        return colors.hvac.off;
    }
  };

  const cardColors = getCardColors();
  const textColor =
    theme === 'light'
      ? isOn
        ? 'text-gray-900'
        : 'text-gray-500'
      : isOn
        ? 'text-white'
        : 'text-gray-300';
  const secondaryTextColor = theme === 'light' ? 'text-gray-600' : 'text-gray-300';
  const buttonBg =
    theme === 'light' ? 'bg-gray-900/10 hover:bg-gray-900/20' : 'bg-white/10 hover:bg-white/20';
  const buttonText = theme === 'light' ? 'text-gray-900' : 'text-white';
  const cardInteraction = useEntityCardInteractionController({
    ariaLabel: `${name} hvac`,
    ariaPressed: isOn,
    isEditMode,
    onToggle: () => setIsOn((current) => !current),
    onOpenControls: () => setIsSettingsOpen(true),
    onOpenSettings: () => setIsSettingsOpen(true),
  });

  // Light theme overlay - tinted when active, neutral when off
  const lightOverlay =
    theme === 'light'
      ? isOn
        ? mode === 'cool'
          ? 'bg-cyan-50/45'
          : mode === 'heat'
            ? 'bg-orange-50/45'
            : 'bg-white/60'
        : 'bg-white/60'
      : undefined;

  return (
    <>
      <CardWrapper
        interactionProps={cardInteraction.cardProps}
        className={`bg-gradient-to-br ${cardColors.gradient} border ${cardColors.border} p-4 ${!isOn ? 'grayscale opacity-40' : ''}`}
        lightOverlayClassName={lightOverlay}
        showShadow={isOn}
      >
        {isEditMode && (
          <CardSizeSelector
            currentSize={size}
            onSizeChange={(newSize) => onSizeChange(id, newSize)}
          />
        )}

        <div
          className={`absolute inset-0 bg-gradient-to-br ${cardColors.glow} to-transparent transition-all duration-500`}
        ></div>

        {!isEditMode && (
          <button
            {...cardInteraction.settingsButtonProps}
            className={`absolute right-3 top-3 z-20 flex h-8 w-8 items-center justify-center rounded-full ${buttonBg} transition-all`}
          >
            <Settings2 className={`h-3.5 w-3.5 ${buttonText}`} />
          </button>
        )}

        <div className="relative z-[2] h-full flex flex-col">
          {/* Header */}
          <div className={`flex items-start justify-between ${isSmall ? 'mb-1' : 'mb-2'}`}>
            <div className="min-w-0 flex-1">
              <h3
                className={`font-semibold ${textColor} truncate ${isSmall ? 'text-xs' : 'text-sm'} transition-colors duration-500`}
              >
                {name}
              </h3>
              <p className="text-[10px] text-gray-300 truncate mt-0.5">HVAC</p>
            </div>
            <EntityCardHeaderIcon
              IconComponent={Wind}
              isActive={isOn}
              size={size}
              ariaLabel={cardInteraction.iconButtonProps['aria-label']}
              onClick={cardInteraction.iconButtonProps.onClick}
              onPointerDown={cardInteraction.iconButtonProps.onPointerDown}
            />
          </div>

          {/* Content area - adaptive based on size */}
          {isSmall ? (
            // Small: Compact layout
            <div className="flex-1 flex flex-col justify-end gap-2">
              {/* Target temp display (prominent) */}
              <div>
                <div
                  className={`text-3xl font-bold ${textColor} leading-none transition-colors duration-500 mb-1`}
                >
                  {targetTemp}°C
                </div>
                <div className={`text-xs ${secondaryTextColor}`}>
                  Current temperature {currentTemp}°C
                </div>
              </div>

              {/* Controls - following light card standard */}
              <div className="flex gap-2 items-center">
                <HVACTempControls
                  targetTemp={targetTemp}
                  onTempChange={setTargetTemp}
                  isOn={isOn}
                  size="small"
                />

                {/* Spacer */}
                <div className="flex-1" />
              </div>
            </div>
          ) : isMedium ? (
            // Medium: More space for controls
            <div className="flex-1 flex flex-col justify-between">
              {/* Target temperature (prominent) */}
              <div>
                <div
                  className={`text-3xl font-bold ${textColor} leading-none transition-colors duration-500 mb-1`}
                >
                  {targetTemp}°C
                </div>
                <div className={`text-xs ${secondaryTextColor}`}>
                  Current temperature {currentTemp}°C
                </div>
              </div>

              {/* Control buttons */}
              <div className="flex gap-2 items-center">
                <HVACTempControls
                  targetTemp={targetTemp}
                  onTempChange={setTargetTemp}
                  isOn={isOn}
                  size="medium"
                />

                <HVACModeControls mode={mode} isOn={isOn} onModeChange={setMode} size="medium" />
              </div>
            </div>
          ) : (
            // Large: Full featured layout with half gauge
            <div className="flex-1 flex flex-col justify-between">
              {/* Half Temperature Gauge with side buttons */}
              <div className="flex-1 flex items-center justify-center">
                <div className="relative flex items-end gap-4">
                  {/* Temp controls on sides */}
                  <div className="mb-8">
                    <HVACTempControls
                      targetTemp={targetTemp}
                      onTempChange={setTargetTemp}
                      isOn={isOn}
                      size="large"
                    />
                  </div>

                  {/* Half Gauge */}
                  <HVACGauge
                    id={id}
                    mode={mode}
                    targetTemp={targetTemp}
                    currentTemp={currentTemp}
                    isOn={isOn}
                  />

                  {/* Spacer for symmetry */}
                  <div className="w-12 h-12 mb-8" />
                </div>
              </div>

              {/* Mode controls - single row */}
              <div className="space-y-2">
                <div className={`text-xs ${secondaryTextColor} text-center`}>Mode</div>
                <div className="flex gap-2 items-center justify-center">
                  <HVACModeControls mode={mode} isOn={isOn} onModeChange={setMode} size="large" />
                </div>
              </div>
            </div>
          )}
        </div>
      </CardWrapper>

      <HVACSettingsDialog
        isOpen={isSettingsOpen}
        onOpenChange={setIsSettingsOpen}
        name={name}
        room={room}
        isOn={isOn}
        mode={mode}
        targetTemp={targetTemp}
        currentTemp={currentTemp}
        onModeChange={setMode}
        onTogglePower={() => setIsOn(!isOn)}
      />
    </>
  );
});
