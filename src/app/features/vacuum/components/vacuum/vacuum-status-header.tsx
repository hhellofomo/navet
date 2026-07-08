import { Pause, Play } from 'lucide-react';
import type { CSSProperties } from 'react';
import { Button } from '@/app/components/primitives';
import { useI18n } from '@/app/hooks';
import type { VacuumStatus } from './vacuum-utils';

interface VacuumStatusHeaderProps {
  currentStatus: VacuumStatus;
  plannerSummaryLabel: string;
  cleaningMode: string;
  selectedFanSpeed: string;
  roomTargets: string[];
  plannerView: 'all' | 'rooms' | 'zones';
  primaryActionLabel: string;
  onStartCleaning: () => void;
  onPauseCleaning?: () => void;
  softControlStyle?: CSSProperties;
}

function getStatusIntentClassName(status: VacuumStatus) {
  switch (status) {
    case 'cleaning':
      return 'border-cyan-400/30 bg-cyan-400/14 text-cyan-100';
    case 'returning':
      return 'border-amber-400/30 bg-amber-400/14 text-amber-100';
    case 'paused':
      return 'border-yellow-400/30 bg-yellow-400/14 text-yellow-100';
    case 'docked':
      return 'border-emerald-400/30 bg-emerald-400/14 text-emerald-100';
    default:
      return 'border-white/14 bg-white/10 text-white/82';
  }
}

export function VacuumStatusHeader({
  currentStatus,
  plannerSummaryLabel,
  cleaningMode,
  selectedFanSpeed,
  roomTargets,
  plannerView,
  primaryActionLabel,
  onStartCleaning,
  onPauseCleaning,
  softControlStyle,
}: VacuumStatusHeaderProps) {
  const { t } = useI18n();

  const statusSummary = (() => {
    switch (currentStatus) {
      case 'cleaning':
        return t('vacuum.status.cleaning');
      case 'returning':
        return t('vacuum.status.returning');
      case 'docked':
        return t('vacuum.status.docked');
      case 'paused':
        return t('vacuum.status.paused');
      default:
        return t('vacuum.status.idle');
    }
  })();

  const handleAction = () => {
    if (currentStatus === 'cleaning') {
      onPauseCleaning?.();
    } else {
      onStartCleaning();
    }
  };

  return (
    <div className="flex items-start justify-between gap-4">
      <div>
        <div
          className={`inline-flex items-center rounded-full border px-3 py-1 text-xs font-semibold ${getStatusIntentClassName(currentStatus)}`}
        >
          {statusSummary}
        </div>
        <div className="mt-3 text-2xl font-semibold text-white">{plannerSummaryLabel}</div>
        <div className="mt-1 text-sm text-white/76">
          {plannerView === 'all'
            ? `${roomTargets.length || 1} ${t('vacuum.plan.rooms')} · ${selectedFanSpeed}`
            : `${t('vacuum.settings.cleaningMode')} · ${cleaningMode}`}
        </div>
      </div>

      <Button
        iconOnly
        label={primaryActionLabel}
        variant="secondary"
        size="default"
        onClick={handleAction}
        className="h-12 w-12 rounded-2xl border-white/12 bg-white/10 text-white hover:bg-white/16"
        style={softControlStyle}
      >
        {currentStatus === 'cleaning' ? (
          <Pause className="h-5 w-5" />
        ) : (
          <Play className="h-5 w-5" />
        )}
      </Button>
    </div>
  );
}
