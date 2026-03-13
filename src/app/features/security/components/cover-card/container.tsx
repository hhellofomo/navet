import { memo, useState } from 'react';
import { useEntityCardInteractionController } from '@/app/components/shared/entity-card-interaction-controller';
import { getThemeSurfaceTokens } from '@/app/components/shared/theme/theme-surface-tokens';
import { useTheme } from '@/app/hooks';
import { DEVICE_CLASS_CONFIG } from './constants';
import type { CoverCardProps, CoverState, DeviceClass } from './types';
import { CoverCardView } from './view';

export const CoverCardContainer = memo(function CoverCardContainer({
  id,
  name,
  room,
  initialPosition = 0,
  initialDeviceClass = 'blind',
  size,
  onSizeChange,
  isEditMode,
}: CoverCardProps) {
  const [position, setPosition] = useState(initialPosition);
  const [deviceClass, setDeviceClass] = useState<DeviceClass>(initialDeviceClass);
  const [coverState, setCoverState] = useState<CoverState>(
    initialPosition === 100 ? 'open' : initialPosition === 0 ? 'closed' : 'open'
  );
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const { colors, theme } = useTheme();
  const surface = getThemeSurfaceTokens(theme);

  // Handle position changes with state tracking
  const handlePositionChange = (newPosition: number) => {
    const oldPosition = position;
    setPosition(newPosition);

    // Set state based on movement
    if (newPosition > oldPosition) {
      setCoverState('opening');
      setTimeout(() => {
        setCoverState(newPosition === 100 ? 'open' : 'opening');
      }, 500);
    } else if (newPosition < oldPosition) {
      setCoverState('closing');
      setTimeout(() => {
        setCoverState(newPosition === 0 ? 'closed' : 'closing');
      }, 500);
    }
  };

  const handleOpen = () => {
    handlePositionChange(100);
  };

  const handleClose = () => {
    handlePositionChange(0);
  };

  const handleStop = () => {
    // Stop the cover at current position
    setCoverState(position === 100 ? 'open' : position === 0 ? 'closed' : 'open');
  };

  // Get state text and color
  const getStateDisplay = () => {
    switch (coverState) {
      case 'open':
        return { text: 'Open', color: surface.textSecondary };
      case 'closed':
        return { text: 'Closed', color: surface.textSecondary };
      case 'opening':
        return { text: 'Opening...', color: surface.textSecondary };
      case 'closing':
        return { text: 'Closing...', color: surface.textSecondary };
    }
  };

  const stateDisplay = getStateDisplay();
  const cardColors = position > 50 ? colors.cover.open : colors.cover.closed;
  const cardId = `cover-${name.toLowerCase().replace(/ /g, '-')}`;
  const cardInteraction = useEntityCardInteractionController({
    ariaLabel: `${name} cover`,
    ariaPressed: position > 0,
    isEditMode,
    onToggle: () => {
      if (position > 0) {
        handleClose();
        return;
      }
      handleOpen();
    },
    onOpenControls: () => setIsSettingsOpen(true),
    onOpenSettings: () => setIsSettingsOpen(true),
  });

  return (
    <CoverCardView
      entityId={id}
      name={name}
      room={room}
      position={position}
      deviceClass={deviceClass}
      deviceClassConfig={DEVICE_CLASS_CONFIG}
      size={size}
      isEditMode={isEditMode}
      cardId={cardId}
      cardColors={cardColors}
      cardProps={cardInteraction.cardProps}
      iconButtonProps={cardInteraction.iconButtonProps}
      settingsButtonProps={cardInteraction.settingsButtonProps}
      theme={theme}
      stateDisplay={stateDisplay}
      isSettingsOpen={isSettingsOpen}
      setIsSettingsOpen={setIsSettingsOpen}
      onSizeChange={onSizeChange}
      handlePositionChange={handlePositionChange}
      handleOpen={handleOpen}
      handleClose={handleClose}
      handleStop={handleStop}
      setDeviceClass={setDeviceClass}
    />
  );
});
