import { memo, useState } from 'react';
import { useTheme } from '../../../contexts/theme-context';
import { CoverCardView } from './CoverCardView';

type CoverState = 'open' | 'closed' | 'opening' | 'closing';
type DeviceClass =
  | 'blind'
  | 'shade'
  | 'curtain'
  | 'garage'
  | 'gate'
  | 'awning'
  | 'shutter'
  | 'door';

interface CoverCardContainerProps {
  name: string;
  room: string;
  initialPosition?: number; // 0 = closed, 100 = open
  initialDeviceClass?: DeviceClass;
  size: CardSize;
  onSizeChange: (id: string, size: CardSize) => void;
  isEditMode: boolean;
}

const deviceClassConfig: Record<
  DeviceClass,
  { label: string; icon: React.ComponentType<React.SVGProps<SVGSVGElement>> }
> = {
  blind: { label: 'Window Blinds', icon: Blinds },
  shade: { label: 'Roller Shades', icon: Blinds },
  curtain: { label: 'Curtains', icon: Home },
  garage: { label: 'Garage Doors', icon: DoorOpen },
  gate: { label: 'Gates', icon: Fence },
  awning: { label: 'Awnings', icon: SunDim },
  shutter: { label: 'Shutters', icon: Square },
  door: { label: 'Doors', icon: DoorOpen },
};

export const CoverCardContainer = memo(function CoverCardContainer({
  name,
  room,
  initialPosition = 0,
  initialDeviceClass = 'blind',
  size,
  onSizeChange,
  isEditMode,
}: CoverCardContainerProps) {
  const [position, setPosition] = useState(initialPosition);
  const [deviceClass, setDeviceClass] = useState<DeviceClass>(initialDeviceClass);
  const [coverState, setCoverState] = useState<CoverState>(
    initialPosition === 100 ? 'open' : initialPosition === 0 ? 'closed' : 'open'
  );
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const { colors, theme } = useTheme();

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
        return { text: 'Open', color: theme === 'light' ? 'text-gray-600' : 'text-gray-300' };
      case 'closed':
        return { text: 'Closed', color: theme === 'light' ? 'text-gray-600' : 'text-gray-300' };
      case 'opening':
        return { text: 'Opening...', color: theme === 'light' ? 'text-gray-600' : 'text-gray-300' };
      case 'closing':
        return { text: 'Closing...', color: theme === 'light' ? 'text-gray-600' : 'text-gray-300' };
    }
  };

  const stateDisplay = getStateDisplay();
  const cardColors = position > 50 ? colors.cover.open : colors.cover.closed;
  const cardId = `cover-${name.toLowerCase().replace(/ /g, '-')}`;

  return (
    <CoverCardView
      name={name}
      room={room}
      position={position}
      deviceClass={deviceClass}
      deviceClassConfig={deviceClassConfig}
      size={size}
      isEditMode={isEditMode}
      cardId={cardId}
      cardColors={cardColors}
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
