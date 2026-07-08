import { Home, MapPin, User } from 'lucide-react';
import { memo } from 'react';
import {
  type CardSize,
  CardSizeSelector,
  isCompactCardSize,
} from '@/app/components/shared/card-size-selector';
import { useTheme } from '@/app/hooks';
import { getPersonCardSurfaceTokens } from './person-card-surface-tokens';

interface PersonCardProps {
  name: string;
  location: string;
  state: 'home' | 'away';
  size: CardSize;
  onSizeChange: (id: string, size: CardSize) => void;
  isEditMode: boolean;
}

export const PersonCard = memo(function PersonCard({
  name,
  location,
  state,
  size,
  onSizeChange,
  isEditMode,
}: PersonCardProps) {
  const cardId = `person-${name.toLowerCase().replace(/ /g, '-')}`;
  const { theme, colors } = useTheme();

  // Size-specific styling
  const isSmall = isCompactCardSize(size);
  const padding = isSmall ? 'p-4' : 'p-5';

  const cardColors = state === 'home' ? colors.person.home : colors.person.away;
  const surface = getPersonCardSurfaceTokens(theme, state);

  return (
    <div
      className={`relative h-full bg-gradient-to-br ${cardColors.gradient} backdrop-blur-xl rounded-3xl ${padding} border ${cardColors.border} overflow-hidden ${surface.containerShadowClassName}`}
    >
      {isEditMode && (
        <CardSizeSelector
          currentSize={size}
          onSizeChange={(newSize) => onSizeChange(cardId, newSize)}
        />
      )}

      <div className={`absolute inset-0 bg-gradient-to-br ${cardColors.glow} to-transparent`}></div>

      {/* Light theme frosted overlay */}
      {surface.overlayClassName && (
        <div className={`absolute inset-0 ${surface.overlayClassName}`} />
      )}

      <div className="relative h-full flex flex-col">
        <div className="flex items-start justify-between mb-2">
          <div className="min-w-0 flex-1">
            <h3
              className={`font-semibold truncate ${isSmall ? 'text-xs' : 'text-sm'} ${surface.titleClassName}`}
            >
              {name}
            </h3>
            <p className={`mt-0.5 truncate text-[10px] ${surface.typeLabelClassName}`}>Person</p>
            {!isSmall && <p className={`text-xs ${surface.locationClassName}`}>{location}</p>}
          </div>
        </div>

        <div className="flex-1 flex flex-col items-center justify-center">
          <div
            className={`${isSmall ? 'w-10 h-10' : 'w-14 h-14'} rounded-full flex items-center justify-center mb-2 ${
              state === 'home'
                ? 'bg-gradient-to-br from-blue-400 to-blue-600 shadow-lg shadow-blue-500/50'
                : surface.avatarAwayBgClassName
            }`}
          >
            <User className={`${isSmall ? 'w-5 h-5' : 'w-7 h-7'} ${surface.avatarIconClassName}`} />
          </div>

          {!isSmall && (
            <div
              className={`flex items-center gap-1.5 rounded-full px-3 py-1 ${surface.statusPillClassName}`}
            >
              {state === 'home' ? (
                <>
                  <Home className={`h-3 w-3 ${surface.homeIconClassName}`} />
                  <span className={`text-xs font-medium ${surface.statusLabelClassName}`}>
                    Home
                  </span>
                </>
              ) : (
                <>
                  <MapPin className={`h-3 w-3 ${surface.awayIconClassName}`} />
                  <span className={`text-xs ${surface.statusLabelClassName}`}>Away</span>
                </>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
});
