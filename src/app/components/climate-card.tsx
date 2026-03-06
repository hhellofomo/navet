import { useState, memo } from 'react';
import { Thermometer } from 'lucide-react';
import * as RadioGroup from '@radix-ui/react-radio-group';
import { CardSizeSelector, type CardSize } from './card-size-selector';
import { useTheme } from '../contexts/theme-context';

interface ClimateCardProps {
  id: string;
  name: string;
  temperature: number;
  mode: string;
  size: CardSize;
  onSizeChange: (id: string, size: CardSize) => void;
  isEditMode: boolean;
}

export const ClimateCard = memo(function ClimateCard({ id, name, temperature, mode: initialMode, size, onSizeChange, isEditMode }: ClimateCardProps) {
  const [mode, setMode] = useState(initialMode);
  const { theme } = useTheme();
  
  // Size-specific styling with intelligent layout adaptation
  const isSmall = size === 'small';
  const isMedium = size === 'medium';
  const isLarge = size === 'large';
  const padding = isSmall ? 'p-4' : 'p-5';

  // Theme-aware colors
  const cardGradient = theme === 'light' ? 'from-white to-purple-50/80' : 'from-purple-900/90 to-purple-950/95';
  const cardBorder = theme === 'light' ? 'border-gray-200/80' : 'border-purple-700/30';
  const textPrimary = theme === 'light' ? 'text-gray-900' : 'text-white';
  const textSecondary = theme === 'light' ? 'text-gray-500' : 'text-gray-400';
  const iconBg = theme === 'light' ? 'bg-purple-100' : 'bg-purple-500/20';
  const iconColor = theme === 'light' ? 'text-purple-600' : 'text-purple-400';
  const glowGradient = theme === 'light' ? 'from-purple-50/40' : 'from-purple-500/5';
  const activeBtnBg = theme === 'light' ? 'bg-purple-600 text-white' : 'bg-purple-500 text-white';
  const inactiveBtnBg = theme === 'light' ? 'bg-gray-100 text-gray-600' : 'bg-white/5 text-gray-400';

  return (
    <div className={`relative h-full bg-gradient-to-br ${cardGradient} backdrop-blur-xl rounded-3xl ${padding} border ${cardBorder} overflow-hidden ${theme === 'light' ? 'shadow-lg' : ''}`}>
      {isEditMode && (
        <CardSizeSelector 
          currentSize={size} 
          onSizeChange={(newSize) => onSizeChange(id, newSize)} 
        />
      )}
      
      <div className={`absolute inset-0 bg-gradient-to-br ${glowGradient} to-transparent`}></div>
      
      {/* Light theme frosted overlay */}
      {theme === 'light' && <div className="absolute inset-0 bg-white/60" />}
      
      <div className="relative h-full flex flex-col">
        <div className={`flex items-start justify-between ${isSmall ? 'mb-1' : 'mb-2'}`}>
          <div className="min-w-0 flex-1">
            <h3 className={`font-semibold ${textPrimary} truncate ${isSmall ? 'text-xs' : 'text-sm'}`}>{name}</h3>
          </div>
          <div className={`${isSmall ? 'w-8 h-8' : 'w-10 h-10'} rounded-full ${iconBg} flex items-center justify-center flex-shrink-0`}>
            <Thermometer className={`${isSmall ? 'w-4 h-4' : 'w-5 h-5'} ${iconColor}`} />
          </div>
        </div>

        {isSmall ? (
          // Small: Minimal display
          <div className="flex-1 flex flex-col items-center justify-center">
            <div className={`text-3xl font-bold ${textPrimary} leading-none mb-1`}>{temperature}°</div>
            <div className={`text-xs ${textSecondary}`}>{mode}</div>
          </div>
        ) : isMedium ? (
          // Medium: Compact with inline mode selector
          <>
            <div className="flex-1 flex items-center justify-center">
              <div className="text-center">
                <div className={`text-3xl font-bold ${textPrimary} mb-1`}>{temperature}°C</div>
                <div className={`text-xs ${textSecondary}`}>{mode}</div>
              </div>
            </div>
            <RadioGroup.Root value={mode} onValueChange={setMode} className="flex gap-2 mt-2">
              <RadioGroup.Item value="Cooling" className={`flex-1 py-1.5 rounded-lg text-[10px] font-medium transition-colors ${mode === 'Cooling' ? activeBtnBg : inactiveBtnBg}`}>
                Cool
              </RadioGroup.Item>
              <RadioGroup.Item value="Heating" className={`flex-1 py-1.5 rounded-lg text-[10px] font-medium transition-colors ${mode === 'Heating' ? activeBtnBg : inactiveBtnBg}`}>
                Heat
              </RadioGroup.Item>
              <RadioGroup.Item value="Off" className={`flex-1 py-1.5 rounded-lg text-[10px] font-medium transition-colors ${mode === 'Off' ? activeBtnBg : inactiveBtnBg}`}>
                Off
              </RadioGroup.Item>
            </RadioGroup.Root>
          </>
        ) : (
          // Large: Full display with spacious controls
          <>
            <div className="flex-1 flex items-center justify-center">
              <div className="text-center">
                <div className={`text-3xl font-bold ${textPrimary} mb-1`}>{temperature}°C</div>
                <div className={`text-xs ${textSecondary}`}>{mode}</div>
              </div>
            </div>
            <RadioGroup.Root value={mode} onValueChange={setMode} className="flex gap-2 mt-2">
              <RadioGroup.Item value="Cooling" className={`flex-1 py-2 rounded-lg text-[10px] font-medium transition-colors ${mode === 'Cooling' ? activeBtnBg : inactiveBtnBg}`}>
                Cool
              </RadioGroup.Item>
              <RadioGroup.Item value="Heating" className={`flex-1 py-2 rounded-lg text-xs font-medium transition-colors ${mode === 'Heating' ? activeBtnBg : inactiveBtnBg}`}>
                Heat
              </RadioGroup.Item>
              <RadioGroup.Item value="Off" className={`flex-1 py-2 rounded-lg text-xs font-medium transition-colors ${mode === 'Off' ? activeBtnBg : inactiveBtnBg}`}>
                Off
              </RadioGroup.Item>
            </RadioGroup.Root>
          </>
        )}
      </div>
    </div>
  );
});