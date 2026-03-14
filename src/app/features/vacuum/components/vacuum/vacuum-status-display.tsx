import { MapPin } from 'lucide-react';
import { getThemeSurfaceTokens } from '@/app/components/shared/theme/theme-surface-tokens';
import { useI18n } from '@/app/hooks';
import type { ThemeType } from '@/app/hooks/use-theme';
import { BatteryIndicator } from './battery-indicator';
import { getVacuumStatusColorClass, type VacuumStatus } from './vacuum-utils';

interface VacuumStatusDisplayProps {
  currentStatus: VacuumStatus;
  battery: number;
  cleanedArea: string;
  cleaningTime: string;
  room: string;
  theme: ThemeType;
  isSmall: boolean;
  isMedium?: boolean;
}

export function VacuumStatusDisplay({
  currentStatus,
  battery,
  cleanedArea,
  cleaningTime,
  room,
  theme,
  isSmall,
  isMedium = false,
}: VacuumStatusDisplayProps) {
  const { t } = useI18n();
  const surface = getThemeSurfaceTokens(theme);
  const textPrimary = surface.textPrimary;
  const textSecondary = surface.textSubtle;
  const statusText =
    currentStatus === 'cleaning'
      ? t('vacuum.status.cleaning')
      : currentStatus === 'returning'
        ? t('vacuum.status.returning')
        : currentStatus === 'docked'
          ? t('vacuum.status.docked')
          : currentStatus === 'paused'
            ? t('vacuum.status.paused')
            : t('vacuum.status.idle');
  const statusRow = (
    <div className="flex items-end justify-between">
      <div className={`font-medium leading-none ${getVacuumStatusColorClass(currentStatus)}`}>
        {statusText}
      </div>
      <div className={`flex items-center gap-1 text-xs ${textSecondary}`}>
        <MapPin className="w-3 h-3" />
        <span>{room}</span>
      </div>
    </div>
  );

  return (
    <div className={`flex flex-col ${isMedium ? '' : 'h-full'}`}>
      {isSmall ? (
        <div className="flex flex-1 flex-col justify-end gap-3">
          {statusRow}
          <BatteryIndicator battery={battery} theme={theme} />
        </div>
      ) : isMedium ? (
        <div className="flex flex-col gap-3 pt-2">
          {statusRow}
          <BatteryIndicator battery={battery} theme={theme} />
        </div>
      ) : (
        <div className="flex flex-1 flex-col justify-between pt-2">
          {statusRow}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <div className={`text-xs ${textSecondary}`}>{t('vacuum.cleanedArea')}</div>
              <div className={`font-medium ${textPrimary}`}>{cleanedArea}</div>
            </div>
            <div>
              <div className={`text-xs ${textSecondary}`}>{t('vacuum.cleaningTime')}</div>
              <div className={`font-medium ${textPrimary}`}>{cleaningTime}</div>
            </div>
          </div>
          <BatteryIndicator battery={battery} theme={theme} />
        </div>
      )}
    </div>
  );
}
