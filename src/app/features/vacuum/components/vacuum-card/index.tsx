import { Bot } from 'lucide-react';
import { memo } from 'react';
import {
  type CardSize,
  CardSizeSelector,
  isCompactCardSize,
} from '@/app/components/shared/card-size-selector';
import { EntityCardHeader } from '@/app/components/shared/entity-card-header';
import { EntityCardHeaderIcon } from '@/app/components/shared/entity-card-header-icon';
import { getCardStateSurfaceTokens } from '@/app/components/shared/theme/card-state-surface-tokens';
import { getThemeSurfaceTokens } from '@/app/components/shared/theme/theme-surface-tokens';
import { useI18n, useTheme } from '@/app/hooks';
import { useVacuumControl } from '../vacuum/use-vacuum-control';
import { VacuumControlsLarge } from '../vacuum/vacuum-controls-large';
import { VacuumControlsMedium } from '../vacuum/vacuum-controls-medium';
import { VacuumControlsSmall } from '../vacuum/vacuum-controls-small';
import { VacuumSettingsDialog } from '../vacuum/vacuum-settings-dialog';
import { VacuumStatusDisplay } from '../vacuum/vacuum-status-display';
import { getVacuumThemeStatus, type VacuumStatus } from '../vacuum/vacuum-utils';

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
  const { theme, colors } = useTheme();
  const { t } = useI18n();
  const surface = getThemeSurfaceTokens(theme);
  const isActive = currentStatus === 'cleaning' || currentStatus === 'returning';
  const stateSurface = getCardStateSurfaceTokens(theme, isActive);
  const cardColors = colors.vacuum[getVacuumThemeStatus(currentStatus)];

  const isSmall = isCompactCardSize(size);
  const isMedium = size === 'medium';
  const padding = isSmall ? 'p-4' : 'p-5';

  return (
    <div className="h-full w-full relative">
      {isEditMode && (
        <CardSizeSelector
          currentSize={size}
          onSizeChange={(newSize) => onSizeChange(id, newSize)}
        />
      )}

      <div
        className={`relative h-full bg-gradient-to-br ${cardColors.gradient} backdrop-blur-xl rounded-3xl ${padding} border ${cardColors.border} overflow-hidden ${surface.cardShadow} ${stateSurface.containerClassName}`}
      >
        {isActive && (
          <div
            className={`absolute inset-0 bg-gradient-to-br ${cardColors.glow} to-transparent`}
          ></div>
        )}

        {surface.lightOverlay && <div className={`absolute inset-0 ${surface.lightOverlay}`} />}
        {stateSurface.overlayClassName && (
          <div className={`absolute inset-0 ${stateSurface.overlayClassName}`} />
        )}

        <div className="relative h-full flex flex-col">
          <EntityCardHeader
            title={name}
            subtitle={t('vacuum.subtitle')}
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
                  accentColorValue={cardColors.accent}
                />
              ) : isMedium ? (
                <VacuumControlsMedium
                  currentStatus={currentStatus}
                  onStartCleaning={handleStartCleaning}
                  onPause={handlePause}
                  onReturnHome={handleReturnHome}
                  onOpenSettings={() => setIsDialogOpen(true)}
                  theme={theme}
                  accentColorValue={cardColors.accent}
                />
              ) : (
                <VacuumControlsLarge
                  currentStatus={currentStatus}
                  onStartCleaning={handleStartCleaning}
                  onPause={handlePause}
                  onReturnHome={handleReturnHome}
                  onOpenSettings={() => setIsDialogOpen(true)}
                  theme={theme}
                  accentColorValue={cardColors.accent}
                />
              )}
            </div>
          </div>
        </div>
      </div>

      <VacuumSettingsDialog
        entityId={id}
        isOpen={isDialogOpen}
        onClose={() => setIsDialogOpen(false)}
        onStartCleaning={handleStartCleaning}
        onReturnHome={handleReturnHome}
        name={name}
        room={room}
        theme={theme}
        accentColorValue={cardColors.accent}
      />
    </div>
  );
});
