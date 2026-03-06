import { memo, useState } from 'react';
import { Loader2, Home, Play, Pause, MapPin, Battery, Settings } from 'lucide-react';
import * as Dialog from '@radix-ui/react-dialog';
import { CardSizeSelector, type CardSize } from './card-size-selector';
import { CaptionValue } from './ui/caption-value';
import { CardContentLayout } from './shared/card-content-layout';
import { DialogHeader } from './shared/dialog-header';
import { CustomScrollbar } from './shared/custom-scrollbar';
import { useTheme } from '../contexts/theme-context';

interface VacuumCardProps {
  id: string;
  name: string;
  status: 'cleaning' | 'returning' | 'docked' | 'paused' | 'idle';
  battery: number;
  cleanedArea?: string;
  cleaningTime?: string;
  room?: string;
  size: CardSize;
  onSizeChange: (id: string, size: CardSize) => void;
  isEditMode: boolean;
}

export const VacuumCard = memo(function VacuumCard({ 
  id,
  name, 
  status, 
  battery, 
  cleanedArea = '0 m²',
  cleaningTime = '0 min',
  room = 'Living Room',
  size, 
  onSizeChange, 
  isEditMode 
}: VacuumCardProps) {
  const [currentStatus, setCurrentStatus] = useState(status);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const { theme, colors } = useTheme();

  const getBatteryColor = () => {
    if (battery > 60) return 'from-green-500 to-green-600';
    if (battery > 30) return 'from-amber-500 to-amber-600';
    return 'from-red-500 to-red-600';
  };
  
  // Size-specific styling with intelligent layout adaptation
  const isSmall = size === 'small';
  const isMedium = size === 'medium';
  const isLarge = size === 'large';
  const padding = isSmall ? 'p-4' : 'p-5';
  
  const statusConfig = {
    cleaning: {
      label: 'Cleaning',
      color: colors.vacuum.cleaning.gradient,
      border: colors.vacuum.cleaning.border,
      iconBg: colors.vacuum.cleaning.iconBg,
      iconColor: colors.vacuum.cleaning.accent,
      accent: colors.vacuum.cleaning.accent,
      glow: colors.vacuum.cleaning.glow,
      icon: Loader2,
      iconClass: 'animate-spin',
    },
    returning: {
      label: 'Returning to Dock',
      color: colors.vacuum.returning.gradient,
      border: colors.vacuum.returning.border,
      iconBg: colors.vacuum.returning.iconBg,
      iconColor: colors.vacuum.returning.accent,
      accent: colors.vacuum.returning.accent,
      glow: colors.vacuum.returning.glow,
      icon: Home,
      iconClass: '',
    },
    docked: {
      label: 'Docked',
      color: colors.vacuum.docked.gradient,
      border: colors.vacuum.docked.border,
      iconBg: colors.vacuum.docked.iconBg,
      iconColor: colors.vacuum.docked.accent,
      accent: colors.vacuum.docked.accent,
      glow: colors.vacuum.docked.glow,
      icon: Home,
      iconClass: '',
    },
    paused: {
      label: 'Paused',
      color: colors.vacuum.paused.gradient,
      border: colors.vacuum.paused.border,
      iconBg: colors.vacuum.paused.iconBg,
      iconColor: colors.vacuum.paused.accent,
      accent: colors.vacuum.paused.accent,
      glow: colors.vacuum.paused.glow,
      icon: Pause,
      iconClass: '',
    },
    idle: {
      label: 'Idle',
      color: colors.vacuum.docked.gradient,
      border: colors.vacuum.docked.border,
      iconBg: colors.vacuum.docked.iconBg,
      iconColor: colors.vacuum.docked.accent,
      accent: colors.vacuum.docked.accent,
      glow: colors.vacuum.docked.glow,
      icon: MapPin,
      iconClass: '',
    },
  };

  const config = statusConfig[currentStatus];
  const StatusIcon = config.icon;

  // Theme-aware colors
  const textPrimary = theme === 'light' ? 'text-gray-900' : 'text-white';
  const textSecondary = theme === 'light' ? 'text-gray-500' : 'text-gray-400';
  const textTertiary = theme === 'light' ? 'text-gray-400' : 'text-gray-600';
  const btnBg = theme === 'light' ? 'bg-gray-900/10 hover:bg-gray-900/20' : 'bg-white/10 hover:bg-white/20';
  const btnText = theme === 'light' ? 'text-gray-900' : 'text-white';

  const handleStartCleaning = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentStatus('cleaning');
  };

  const handlePause = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentStatus('paused');
  };

  const handleReturnHome = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentStatus('returning');
  };

  return (
    <div className={`relative h-full bg-gradient-to-br ${config.color} backdrop-blur-xl rounded-3xl ${padding} border ${config.border} overflow-hidden ${theme === 'light' ? 'shadow-lg' : ''}`}>
      {isEditMode && (
        <CardSizeSelector 
          currentSize={size} 
          onSizeChange={(newSize) => onSizeChange(id, newSize)} 
        />
      )}
      
      <div className={`absolute inset-0 bg-gradient-to-br ${config.glow} to-transparent`}></div>
      
      {/* Light theme frosted overlay */}
      {theme === 'light' && <div className="absolute inset-0 bg-white/60" />}
      
      <div className="relative h-full flex flex-col">
        {/* Header */}
        <div className={`flex items-start justify-between ${isSmall ? 'mb-1' : 'mb-2'}`}>
          <div className="min-w-0 flex-1">
            <h3 className={`font-semibold ${textPrimary} truncate ${isSmall ? 'text-xs' : 'text-sm'}`}>{name}</h3>
          </div>
          <div className={`${isSmall ? 'w-8 h-8' : 'w-10 h-10'} rounded-full ${config.iconBg} flex items-center justify-center flex-shrink-0`}>
            <StatusIcon className={`${isSmall ? 'w-4 h-4' : 'w-5 h-5'} ${config.iconColor} ${config.iconClass}`} />
          </div>
        </div>

        {isSmall ? (
          // Small: Battery percentage as primary value with status
          <CardContentLayout
            primaryValue={`${battery}%`}
            primaryValueColor={textPrimary}
            caption={
              <div className="flex items-center gap-1.5">
                <span className={textSecondary}>Battery</span>
                <span className={textTertiary}>|</span>
                <span className={config.accent}>{config.label}</span>
              </div>
            }
            actions={
              <>
                {currentStatus === 'cleaning' ? (
                  <button 
                    onClick={handlePause}
                    className={`w-8 h-8 rounded-full ${btnBg} transition-colors flex items-center justify-center`}
                  >
                    <Pause className={`w-3.5 h-3.5 ${btnText}`} />
                  </button>
                ) : (
                  <button 
                    onClick={handleStartCleaning}
                    className="w-10 h-10 rounded-full bg-blue-500 hover:bg-blue-600 transition-colors flex items-center justify-center shadow-lg shadow-blue-500/30"
                  >
                    <Play className="w-4 h-4 text-white" />
                  </button>
                )}
                <button 
                  onClick={handleReturnHome}
                  className={`w-8 h-8 rounded-full ${btnBg} transition-colors flex items-center justify-center`}
                >
                  <Home className={`w-3.5 h-3.5 ${btnText}`} />
                </button>
                
                {/* Spacer */}
                <div className="flex-1" />
                
                {/* Settings button */}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setIsDialogOpen(true);
                  }}
                  className={`w-8 h-8 rounded-full ${btnBg} transition-all flex items-center justify-center`}
                >
                  <Settings className={`w-3.5 h-3.5 ${btnText}`} />
                </button>
              </>
            }
            layout="between"
          />
        ) : isMedium ? (
          // Medium: Battery as primary value with stats
          <CardContentLayout
            primaryValue={`${battery}%`}
            primaryValueColor={textPrimary}
            caption={
              <div className="flex items-center gap-1.5">
                <span className={textSecondary}>Battery</span>
                <span className={textTertiary}>|</span>
                <span className={config.accent}>{config.label}</span>
                <span className={textTertiary}>|</span>
                <span className={textSecondary}>{cleanedArea}</span>
                <span className={textTertiary}>|</span>
                <span className={textSecondary}>{cleaningTime}</span>
              </div>
            }
            actions={
              <>
                {currentStatus === 'cleaning' ? (
                  <button 
                    onClick={handlePause}
                    className={`w-8 h-8 rounded-full ${btnBg} transition-colors flex items-center justify-center`}
                  >
                    <Pause className={`w-3.5 h-3.5 ${btnText}`} />
                  </button>
                ) : (
                  <button 
                    onClick={handleStartCleaning}
                    className="w-10 h-10 rounded-full bg-blue-500 hover:bg-blue-600 transition-colors flex items-center justify-center shadow-lg shadow-blue-500/30"
                  >
                    <Play className="w-4 h-4 text-white" />
                  </button>
                )}
                <button 
                  onClick={handleReturnHome}
                  className={`w-8 h-8 rounded-full ${btnBg} transition-colors flex items-center justify-center`}
                >
                  <Home className={`w-3.5 h-3.5 ${btnText}`} />
                </button>
                
                {/* Spacer */}
                <div className="flex-1" />
                
                {/* Settings button */}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setIsDialogOpen(true);
                  }}
                  className={`w-8 h-8 rounded-full ${btnBg} transition-all flex items-center justify-center`}
                >
                  <Settings className={`w-3.5 h-3.5 ${btnText}`} />
                </button>
              </>
            }
            layout="between"
          />
        ) : (
          // Large: 2-column layout with extended controls
          <div className="flex-1 flex flex-col">
            {/* Current location */}
            <div className={`mb-4 p-3 ${theme === 'light' ? 'bg-gray-100' : 'bg-white/5'} rounded-xl`}>
              <div className="flex items-center gap-2">
                <MapPin className={`w-4 h-4 ${textSecondary}`} />
                <span className={`text-xs ${textSecondary}`}>Current Location</span>
              </div>
              <span className={`text-sm font-semibold ${textPrimary} mt-1 block`}>{room}</span>
            </div>

            {/* 2-column layout */}
            <div className="flex gap-4 mb-4">
              {/* Left: Battery primary value */}
              <div className="flex flex-col">
                <div className={`text-3xl font-bold ${textPrimary} leading-none transition-colors duration-500 mb-1`}>{battery}%</div>
                <div className="flex items-center gap-2 text-sm">
                  <span className={textSecondary}>Battery</span>
                  <span className={textTertiary}>|</span>
                  <span className={config.accent}>{config.label}</span>
                </div>
              </div>

              {/* Right: Stats */}
              <div className="flex-1 flex flex-col gap-[2px] justify-center">
                <CaptionValue 
                  caption="Area Cleaned"
                  value={cleanedArea}
                  align="right"
                />
                <CaptionValue 
                  caption="Duration"
                  value={cleaningTime}
                  align="right"
                />
              </div>
            </div>

            {/* Controls */}
            <div className="flex items-center gap-3 mt-auto">
              {currentStatus === 'cleaning' ? (
                <button 
                  onClick={handlePause}
                  className={`w-10 h-10 rounded-full ${btnBg} transition-colors flex items-center justify-center`}
                >
                  <Pause className={`w-5 h-5 ${btnText}`} />
                </button>
              ) : (
                <button 
                  onClick={handleStartCleaning}
                  className="w-14 h-14 rounded-full bg-blue-500 hover:bg-blue-600 transition-colors flex items-center justify-center shadow-lg shadow-blue-500/30"
                >
                  <Play className="w-6 h-6 text-white" />
                </button>
              )}
              <button 
                onClick={handleReturnHome}
                className={`w-10 h-10 rounded-full ${btnBg} transition-colors flex items-center justify-center`}
              >
                <Home className={`w-5 h-5 ${btnText}`} />
              </button>
              
              {/* Spacer */}
              <div className="flex-1" />
              
              {/* Settings button */}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setIsDialogOpen(true);
                }}
                className={`w-10 h-10 rounded-full ${btnBg} transition-all flex items-center justify-center`}
              >
                <Settings className={`w-5 h-5 ${btnText}`} />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Settings Dialog */}
      <Dialog.Root open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <Dialog.Portal>
          <Dialog.Overlay className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 animate-in fade-in" />
          <Dialog.Content 
            className={`fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[90vw] max-w-md h-[85vh] backdrop-blur-xl rounded-3xl border shadow-2xl z-50 animate-in fade-in zoom-in duration-200 overflow-hidden bg-gradient-to-br ${config.color} ${config.border}`}
          >
            <CustomScrollbar isOn={currentStatus === 'cleaning'}>
              <div className="p-8">
                <DialogHeader 
                  title="Vacuum Settings"
                  description={`${name} - ${config.label}`}
                  isOn={currentStatus === 'cleaning'}
                />

                <div className="space-y-8">
                  {/* Battery Information */}
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-sm font-medium text-gray-300">Battery Level</span>
                      <span className="text-lg font-bold text-white">{battery}%</span>
                    </div>
                    <div className="w-full h-3 bg-white/10 rounded-full overflow-hidden">
                      <div 
                        className={`h-full bg-gradient-to-r ${getBatteryColor()} rounded-full transition-all duration-300`}
                        style={{ width: `${battery}%` }}
                      />
                    </div>
                  </div>

                  {/* Current Location */}
                  <div>
                    <span className="text-sm font-medium text-gray-300 block mb-3">Current Location</span>
                    <div className="p-4 bg-white/5 rounded-xl">
                      <div className="flex items-center gap-2">
                        <MapPin className="w-5 h-5 text-gray-400" />
                        <span className="text-sm font-semibold text-white">{room}</span>
                      </div>
                    </div>
                  </div>

                  {/* Cleaning Statistics */}
                  <div>
                    <span className="text-sm font-medium text-gray-300 block mb-3">Cleaning Statistics</span>
                    <div className="grid grid-cols-2 gap-3">
                      <div className="p-4 bg-white/5 rounded-xl">
                        <div className="text-xs text-gray-400 mb-1">Area Cleaned</div>
                        <div className="text-lg font-bold text-white">{cleanedArea}</div>
                      </div>
                      <div className="p-4 bg-white/5 rounded-xl">
                        <div className="text-xs text-gray-400 mb-1">Duration</div>
                        <div className="text-lg font-bold text-white">{cleaningTime}</div>
                      </div>
                    </div>
                  </div>

                  {/* Cleaning Modes */}
                  <div>
                    <span className="text-sm font-medium text-gray-300 block mb-3">Cleaning Mode</span>
                    <div className="grid grid-cols-2 gap-2">
                      {['Auto', 'Spot', 'Edge', 'Room'].map((mode) => (
                        <button
                          key={mode}
                          className="py-3 rounded-xl text-sm font-medium transition-all border-2 border-white/10 bg-white/5 text-gray-300 hover:border-blue-500/50"
                        >
                          {mode}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Fan Speed */}
                  <div>
                    <span className="text-sm font-medium text-gray-300 block mb-3">Fan Speed</span>
                    <div className="grid grid-cols-3 gap-2">
                      {['Quiet', 'Standard', 'Max'].map((speed) => (
                        <button
                          key={speed}
                          className="py-3 rounded-xl text-sm font-medium transition-all border-2 border-white/10 bg-white/5 text-gray-300 hover:border-blue-500/50"
                        >
                          {speed}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Quick Actions */}
                  <div>
                    <span className="text-sm font-medium text-gray-300 block mb-3">Quick Actions</span>
                    <div className="flex flex-col gap-2">
                      <button className="w-full py-3 bg-blue-500 hover:bg-blue-600 rounded-xl text-white font-medium transition-colors flex items-center justify-center gap-2">
                        <Play className="w-4 h-4" />
                        Start Cleaning
                      </button>
                      <button className="w-full py-3 bg-white/10 hover:bg-white/20 rounded-xl text-white font-medium transition-colors flex items-center justify-center gap-2">
                        <Home className="w-4 h-4" />
                        Return to Dock
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </CustomScrollbar>
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>
    </div>
  );
});