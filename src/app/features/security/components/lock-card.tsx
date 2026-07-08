import { DoorClosed, DoorOpen, Lock, Unlock } from 'lucide-react';
import { memo, useEffect, useState } from 'react';
import { EntityCardHeader } from '@/app/components/shared/entity-card-header';
import { EntityCardHeaderIcon } from '@/app/components/shared/entity-card-header-icon';
import { RoundControlButton } from '@/app/components/shared/round-control-button';
import { getCardShellSurfaceTokens } from '@/app/components/shared/theme/card-shell-surface-tokens';
import { useHomeAssistant, useI18n, useTheme } from '@/app/hooks';
import { homeAssistantSelectors } from '@/app/stores/selectors';
import { getSecurityCardSurfaceTokens } from './security-card-surface-tokens';

interface LockCardProps {
  id: string;
  name: string;
  room: string;
  initialState?: boolean; // true = locked, false = unlocked
}

export const LockCard = memo(function LockCard({
  id,
  name,
  initialState = true,
}: Omit<LockCardProps, 'room'>) {
  const [isLocked, setIsLocked] = useState(initialState);
  const liveEntity = useHomeAssistant(homeAssistantSelectors.entity(id));
  const { t } = useI18n();

  useEffect(() => {
    if (liveEntity) {
      setIsLocked(liveEntity.state === 'locked');
      return;
    }
    setIsLocked(initialState);
  }, [liveEntity, initialState]);
  const { theme, colors } = useTheme();
  const cardShell = getCardShellSurfaceTokens(theme);
  const securitySurface = getSecurityCardSurfaceTokens(theme);

  const cardColors = isLocked ? colors.lock.locked : colors.lock.unlocked;

  return (
    <div
      className={`relative h-full overflow-hidden rounded-3xl bg-gradient-to-br p-4 ${theme !== 'dark' ? 'border' : ''} ${cardShell.backdropClassName} transition-all duration-500 ${cardColors.gradient} ${cardColors.border} ${securitySurface.containerShadowClassName}`}
    >
      <div
        className={`absolute inset-0 bg-gradient-to-br ${cardColors.glow} to-transparent transition-all duration-500`}
      ></div>

      {/* Light theme frosted overlay */}
      {securitySurface.overlayClassName && (
        <div className={`absolute inset-0 ${securitySurface.overlayClassName}`} />
      )}

      <div className="relative h-full flex flex-col">
        <EntityCardHeader
          title={name}
          subtitle={t('security.lock')}
          size="small"
          leading={
            <EntityCardHeaderIcon
              IconComponent={isLocked ? DoorClosed : DoorOpen}
              isActive={isLocked}
              size="small"
            />
          }
        />

        <div className="flex-1 flex flex-col items-center justify-center">
          <RoundControlButton
            theme={theme}
            size="large"
            variant="emphasis"
            onClick={() => setIsLocked(!isLocked)}
            className={`h-12 w-12 transition-all duration-500 hover:scale-105 ${
              isLocked
                ? 'bg-gradient-to-br from-green-400 to-green-600 shadow-lg shadow-green-500/50'
                : 'bg-gradient-to-br from-red-400 to-red-600 shadow-lg shadow-red-500/50'
            }`}
          >
            {isLocked ? (
              <Lock className="w-6 h-6 text-white" />
            ) : (
              <Unlock className="w-6 h-6 text-white" />
            )}
          </RoundControlButton>

          <div className="text-center mt-3">
            <div
              className={`text-xs ${
                isLocked
                  ? theme === 'light'
                    ? 'text-green-700'
                    : theme === 'glass'
                      ? 'text-green-200'
                      : 'text-green-400'
                  : theme === 'light'
                    ? 'text-red-700'
                    : theme === 'glass'
                      ? 'text-red-200'
                      : 'text-red-400'
              } transition-colors duration-500`}
            >
              {isLocked ? t('security.locked') : t('security.unlocked')}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
});
