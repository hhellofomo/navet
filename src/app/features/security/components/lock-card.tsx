import { DoorClosed, DoorOpen, Lock, Unlock } from 'lucide-react';
import { memo, useState } from 'react';
import { EntityCardHeader } from '@/app/components/shared/entity-card-header';
import { EntityCardHeaderIcon } from '@/app/components/shared/entity-card-header-icon';
import { useTheme } from '@/app/hooks';

interface LockCardProps {
  name: string;
  room: string;
  initialState?: boolean; // true = locked, false = unlocked
}

export const LockCard = memo(function LockCard({
  name,
  initialState = true,
}: Omit<LockCardProps, 'room'>) {
  const [isLocked, setIsLocked] = useState(initialState);
  const { theme, colors } = useTheme();
  const isGlass = theme === 'glass';

  const cardColors = isLocked ? colors.lock.locked : colors.lock.unlocked;

  return (
    <div
      className={`relative h-full bg-gradient-to-br ${cardColors.gradient} backdrop-blur-xl rounded-3xl p-4 border ${cardColors.border} overflow-hidden transition-all duration-500 ${theme === 'light' ? 'shadow-lg' : ''}`}
    >
      <div
        className={`absolute inset-0 bg-gradient-to-br ${cardColors.glow} to-transparent transition-all duration-500`}
      ></div>

      {/* Light theme frosted overlay */}
      {(theme === 'light' || isGlass) && (
        <div className={`absolute inset-0 ${theme === 'light' ? 'bg-white/60' : 'bg-white/[0.03]'}`} />
      )}

      <div className="relative h-full flex flex-col">
        <EntityCardHeader
          title={name}
          subtitle="Lock"
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
          <button
            type="button"
            onClick={() => setIsLocked(!isLocked)}
            className={`w-12 h-12 rounded-full flex items-center justify-center transition-all duration-500 hover:scale-105 ${
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
          </button>

          <div className="text-center mt-3">
            <div
              className={`text-xs ${
                isLocked
                  ? theme === 'light'
                    ? 'text-green-700'
                    : isGlass
                      ? 'text-green-200'
                      : 'text-green-400'
                  : theme === 'light'
                    ? 'text-red-700'
                    : isGlass
                      ? 'text-red-200'
                      : 'text-red-400'
              } transition-colors duration-500`}
            >
              {isLocked ? 'Locked' : 'Unlocked'}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
});
