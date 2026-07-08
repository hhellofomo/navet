import { Wind } from 'lucide-react';
import { memo, useState } from 'react';
import { CardActionRow } from '@/app/components/shared/card-action-row';
import { CardSettingsActionButton } from '@/app/components/shared/card-settings-action-button';
import { type CardSize, CardSizeSelector } from '@/app/components/shared/card-size-selector';
import { EntityCardHeader } from '@/app/components/shared/entity-card-header';
import { EntityCardHeaderIcon } from '@/app/components/shared/entity-card-header-icon';
import { useEntityCardInteractionController } from '@/app/components/shared/entity-card-interaction-controller';
import { CardWrapper } from '@/app/components/ui/card-wrapper';
import { useTheme } from '@/app/hooks';
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

        <div className="relative z-[2] h-full flex flex-col">
          <EntityCardHeader
            title={name}
            subtitle="HVAC"
            size={size}
            leading={
              <EntityCardHeaderIcon
                IconComponent={Wind}
                isActive={isOn}
                size={size}
                ariaLabel={cardInteraction.iconButtonProps['aria-label']}
                onClick={cardInteraction.iconButtonProps.onClick}
              />
            }
          />

          {/* Content area - adaptive based on size */}
          <div className="flex-1">
            {isSmall ? (
              // Small: Compact layout
              <div className="flex h-full flex-col gap-2">
                {/* Target temp display (prominent) */}
                <div className="mt-auto">
                  <div
                    className={`text-3xl font-bold ${textColor} leading-none transition-colors duration-500 mb-1`}
                  >
                    {targetTemp}°C
                  </div>
                  <div className={`text-xs ${secondaryTextColor}`}>
                    Current temperature {currentTemp}°C
                  </div>
                </div>

                <div className="pt-2">
                  <CardActionRow
                    theme={theme}
                    size="small"
                    leftContent={
                      <HVACTempControls
                        targetTemp={targetTemp}
                        onTempChange={setTargetTemp}
                        isOn={isOn}
                        size="small"
                      />
                    }
                    rightContent={
                      <CardSettingsActionButton
                        {...cardInteraction.settingsButtonProps}
                        theme={theme}
                        size="small"
                      />
                    }
                  />
                </div>
              </div>
            ) : isMedium ? (
              // Medium: More space for controls
              <div className="flex h-full flex-col">
                {/* Target temperature (prominent) */}
                <div className="mt-auto">
                  <div
                    className={`text-3xl font-bold ${textColor} leading-none transition-colors duration-500 mb-1`}
                  >
                    {targetTemp}°C
                  </div>
                  <div className={`text-xs ${secondaryTextColor}`}>
                    Current temperature {currentTemp}°C
                  </div>
                </div>

                <div className="pt-4">
                  <CardActionRow
                    theme={theme}
                    size="medium"
                    leftContent={
                      <>
                        <HVACTempControls
                          targetTemp={targetTemp}
                          onTempChange={setTargetTemp}
                          isOn={isOn}
                          size="medium"
                        />
                        <HVACModeControls
                          mode={mode}
                          isOn={isOn}
                          onModeChange={setMode}
                          size="medium"
                        />
                      </>
                    }
                    rightContent={
                      <CardSettingsActionButton
                        {...cardInteraction.settingsButtonProps}
                        theme={theme}
                        size="medium"
                      />
                    }
                  />
                </div>
              </div>
            ) : (
              // Large: Full featured layout with half gauge
              <div className="flex h-full flex-col">
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

                <div className="pt-4">
                  <CardActionRow
                    theme={theme}
                    size="large"
                    leftContent={
                      <div className="flex items-center gap-3">
                        <div className={`text-xs ${secondaryTextColor}`}>Mode</div>
                        <HVACModeControls
                          mode={mode}
                          isOn={isOn}
                          onModeChange={setMode}
                          size="large"
                        />
                      </div>
                    }
                    rightContent={
                      <CardSettingsActionButton
                        {...cardInteraction.settingsButtonProps}
                        theme={theme}
                        size="large"
                      />
                    }
                  />
                </div>
              </div>
            )}
          </div>
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
