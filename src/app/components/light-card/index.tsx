import { useState, memo, useCallback } from 'react';
import { CardSizeSelector, type CardSize } from '../card-size-selector';
import { LightCardSmall } from './light-card-small';
import { LightCardMedium } from './light-card-medium';
import { LightCardLarge } from './light-card-large';
import { LightSettingsDialog } from './light-settings-dialog';
import { getGradientColors } from '../../utils/color-utils';
import { LIGHT_ICON_MAP, DEFAULT_LIGHT_ICON } from '../../constants/icon-map';
import { useTheme } from '../../contexts/theme-context';

interface LightCardProps {
  id: string;
  name: string;
  room: string;
  initialState?: boolean;
  initialBrightness?: number;
  initialTemp?: number;
  size: CardSize;
  onSizeChange: (id: string, size: CardSize) => void;
  isEditMode: boolean;
}

export const LightCard = memo(function LightCard({ 
  id, 
  name, 
  room, 
  initialState = true, 
  initialBrightness = 80, 
  initialTemp = 4000, 
  size, 
  onSizeChange, 
  isEditMode 
}: LightCardProps) {
  const [isOn, setIsOn] = useState(initialState);
  const [brightness, setBrightness] = useState(initialBrightness);
  const [colorTemp, setColorTemp] = useState(initialTemp);
  const [selectedColor, setSelectedColor] = useState<string | null>(null);
  const [customColor, setCustomColor] = useState('#FFA500');
  const [isOpen, setIsOpen] = useState(false);
  const [selectedIcon, setSelectedIcon] = useState(DEFAULT_LIGHT_ICON);
  const { colors, theme } = useTheme();

  const gradientColors = getGradientColors(isOn, selectedColor, theme);
  const IconComponent = LIGHT_ICON_MAP[selectedIcon] || LIGHT_ICON_MAP[DEFAULT_LIGHT_ICON];

  const isSmall = size === 'small';
  const isMedium = size === 'medium';
  const padding = isSmall ? 'p-4' : 'p-5';

  const handleBrightnessChange = useCallback((value: number) => {
    setBrightness(value);
    if (!isOn) setIsOn(true);
  }, [isOn]);

  const handleTempChange = useCallback((temp: number) => {
    setColorTemp(temp);
    setSelectedColor(null);
    if (!isOn) setIsOn(true);
  }, [isOn]);

  const handleColorChange = useCallback((color: string) => {
    setSelectedColor(color);
    if (!isOn) setIsOn(true);
  }, [isOn]);

  const handleClearColor = useCallback(() => {
    setSelectedColor(null);
  }, []);

  const handleSettingsClick = useCallback(() => {
    setIsOpen(true);
  }, []);

  return (
    <>
      <div 
        className={`relative h-full backdrop-blur-xl rounded-3xl ${padding} border overflow-hidden transition-all duration-500 ${!isEditMode ? 'cursor-pointer' : ''} ${
          gradientColors.customGradient 
            ? `border-orange-500/30` 
            : `bg-gradient-to-br ${colors.light.gradient} border ${colors.light.border}`
        } ${!isOn ? 'grayscale opacity-40' : ''} ${theme === 'light' && isOn ? 'shadow-lg' : ''}`}
        style={gradientColors.customGradient ? { background: gradientColors.customGradient, borderColor: 'rgba(251, 146, 60, 0.3)' } : {}}
        onClick={() => !isEditMode && setIsOn(!isOn)}
      >
        {isEditMode && (
          <CardSizeSelector 
            currentSize={size} 
            onSizeChange={(newSize) => onSizeChange(id, newSize)} 
          />
        )}
        
        {/* Glow effect when on */}
        {isOn && (
          <div 
            className={`absolute -inset-[100%] blur-3xl ${theme === 'light' ? 'opacity-40' : 'opacity-20'}`}
            style={{ 
              background: `radial-gradient(circle, ${gradientColors.glow || 'transparent'} 0%, transparent 70%)`
            }}
          />
        )}
        
        {/* Light theme frosted overlay - warm tint when on, neutral when off */}
        {theme === 'light' && (
          <div className={`absolute inset-0 ${isOn ? 'bg-amber-50/45' : 'bg-white/60'}`} />
        )}
        
        {theme !== 'light' && <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent"></div>}
        
        <div className="relative h-full flex flex-col">
          {isSmall ? (
            <LightCardSmall 
              name={name}
              room={room}
              brightness={brightness}
              colorTemp={colorTemp}
              selectedColor={selectedColor}
              isOn={isOn}
              IconComponent={IconComponent}
              onBrightnessChange={handleBrightnessChange}
              onTempChange={handleTempChange}
              onColorChange={handleColorChange}
              onClearColor={handleClearColor}
              onSettingsClick={handleSettingsClick}
            />
          ) : isMedium ? (
            <LightCardMedium 
              name={name}
              room={room}
              brightness={brightness}
              colorTemp={colorTemp}
              selectedColor={selectedColor}
              isOn={isOn}
              IconComponent={IconComponent}
              onBrightnessChange={handleBrightnessChange}
              onTempChange={handleTempChange}
              onColorChange={handleColorChange}
              onClearColor={handleClearColor}
              onSettingsClick={handleSettingsClick}
            />
          ) : (
            <LightCardLarge 
              name={name}
              room={room}
              brightness={brightness}
              colorTemp={colorTemp}
              selectedColor={selectedColor}
              isOn={isOn}
              IconComponent={IconComponent}
              onBrightnessChange={handleBrightnessChange}
              onTempChange={handleTempChange}
              onColorChange={handleColorChange}
              onClearColor={handleClearColor}
              onSettingsClick={handleSettingsClick}
            />
          )}
        </div>
      </div>

      <LightSettingsDialog 
        isOpen={isOpen}
        onOpenChange={setIsOpen}
        name={name}
        room={room}
        isOn={isOn}
        colorTemp={colorTemp}
        selectedColor={selectedColor}
        customColor={customColor}
        brightness={brightness}
        selectedIcon={selectedIcon}
        onTempChange={setColorTemp}
        onColorChange={setSelectedColor}
        onCustomColorChange={setCustomColor}
        onBrightnessChange={setBrightness}
        onIconChange={setSelectedIcon}
      />
    </>
  );
});