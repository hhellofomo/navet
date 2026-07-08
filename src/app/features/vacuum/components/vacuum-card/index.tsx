import { Bot } from 'lucide-react';
import { memo } from 'react';
import {
  type CardSize,
  CardSizeSelector,
  isCompactCardSize,
} from '@/app/components/shared/card-size-selector';
import { EntityCardHeader } from '@/app/components/shared/entity-card-header';
import { EntityCardHeaderIcon } from '@/app/components/shared/entity-card-header-icon';
import { getThemeColorValue } from '@/app/components/shared/theme/theme-colors';
import { getThemeSurfaceTokens } from '@/app/components/shared/theme/theme-surface-tokens';
import { useTheme } from '@/app/hooks';
import { useVacuumControl } from '../vacuum/use-vacuum-control';
import { VacuumControlsLarge } from '../vacuum/vacuum-controls-large';
import { VacuumControlsMedium } from '../vacuum/vacuum-controls-medium';
import { VacuumControlsSmall } from '../vacuum/vacuum-controls-small';
import { VacuumSettingsDialog } from '../vacuum/vacuum-settings-dialog';
import { VacuumStatusDisplay } from '../vacuum/vacuum-status-display';
import type { VacuumStatus } from '../vacuum/vacuum-utils';

interface VacuumCardProps {
  id: string;
  name: string;
  status: VacuumStatus;
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
  isEditMode,
}: VacuumCardProps) {
  const {
    currentStatus,
    isDialogOpen,
    setIsDialogOpen,
    handleStartCleaning,
    handlePause,
    handleReturnHome,
  } = useVacuumControl({ initialStatus: status });
  const { theme, primaryColor } = useTheme();
  const surface = getThemeSurfaceTokens(theme);
  const isGlass = theme === 'glass';
  const accentColorValue = getThemeColorValue(primaryColor);

  const isSmall = isCompactCardSize(size);
  const isMedium = size === 'medium';
  const padding = isSmall ? 'p-4' : 'p-5';

  const cardGradient =
    theme === 'light'
      ? 'from-white to-gray-50/80'
      : isGlass
        ? 'from-white/16 via-slate-200/8 to-white/[0.03]'
        : 'from-gray-900/90 to-gray-950/95';
  const cardBorder =
    theme === 'light' ? 'border-gray-200/80' : isGlass ? surface.border : 'border-gray-700/30';
  const glowGradient =
    theme === 'light'
      ? 'from-gray-50/40'
      : isGlass
        ? 'from-white/10 via-cyan-300/8'
        : 'from-gray-500/5';

  return (
    <div className="h-full w-full relative">
      {isEditMode && (
        <CardSizeSelector
          currentSize={size}
          onSizeChange={(newSize) => onSizeChange(id, newSize)}
        />
      )}

      <div
        className={`relative h-full bg-gradient-to-br ${cardGradient} backdrop-blur-xl rounded-3xl ${padding} border ${cardBorder} overflow-hidden ${surface.cardShadow}`}
      >
        <div className={`absolute inset-0 bg-gradient-to-br ${glowGradient} to-transparent`}></div>

        {surface.lightOverlay && <div className={`absolute inset-0 ${surface.lightOverlay}`} />}

        <div className="relative h-full flex flex-col">
          <EntityCardHeader
            title={name}
            subtitle="Vacuum"
            size={size}
            leading={
              <EntityCardHeaderIcon
                IconComponent={Bot}
                isActive={currentStatus === 'cleaning' || currentStatus === 'returning'}
                size={size}
              />
            }
          />

          <div className={`flex-1 flex flex-col ${isMedium ? 'justify-end' : ''}`}>
            <div className={isMedium ? 'mt-auto' : ''}>
              <VacuumStatusDisplay
                currentStatus={currentStatus}
                battery={battery}
                cleanedArea={cleanedArea}
                cleaningTime={cleaningTime}
                room={room}
                theme={theme}
                isSmall={isSmall}
                isMedium={isMedium}
              />
            </div>

            <div className={isMedium ? 'pt-3' : 'mt-auto pt-4'}>
              {isSmall ? (
                <VacuumControlsSmall
                  currentStatus={currentStatus}
                  onStartCleaning={handleStartCleaning}
                  onPause={handlePause}
                  onReturnHome={handleReturnHome}
                  onOpenSettings={() => setIsDialogOpen(true)}
                  theme={theme}
                  accentColorValue={accentColorValue}
                />
              ) : isMedium ? (
                <VacuumControlsMedium
                  currentStatus={currentStatus}
                  onStartCleaning={handleStartCleaning}
                  onPause={handlePause}
                  onReturnHome={handleReturnHome}
                  onOpenSettings={() => setIsDialogOpen(true)}
                  theme={theme}
                  accentColorValue={accentColorValue}
                />
              ) : (
                <VacuumControlsLarge
                  currentStatus={currentStatus}
                  onStartCleaning={handleStartCleaning}
                  onPause={handlePause}
                  onReturnHome={handleReturnHome}
                  onOpenSettings={() => setIsDialogOpen(true)}
                  theme={theme}
                  accentColorValue={accentColorValue}
                />
              )}
            </div>
          </div>
        </div>
      </div>

      <VacuumSettingsDialog
        isOpen={isDialogOpen}
        onClose={() => setIsDialogOpen(false)}
        onStartCleaning={handleStartCleaning}
        onReturnHome={handleReturnHome}
        name={name}
        theme={theme}
        accentColorValue={accentColorValue}
      />
    </div>
  );
});
