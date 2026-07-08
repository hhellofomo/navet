import { Battery, Sparkles, Wind } from 'lucide-react';
import type { CSSProperties } from 'react';
import { useI18n } from '@/app/hooks';
import { MetricCard } from './vacuum-metric-card';

interface VacuumStatusMetricsProps {
  battery: number;
  cleanedArea: string;
  cleaningTime: string;
  sectionStyle?: CSSProperties;
}

export function VacuumStatusMetrics({
  battery,
  cleanedArea,
  cleaningTime,
  sectionStyle,
}: VacuumStatusMetricsProps) {
  const { t } = useI18n();

  return (
    <div className="grid grid-cols-3 gap-2">
      <MetricCard
        icon={Battery}
        label={t('vacuum.settings.battery')}
        value={`${battery}%`}
        className="bg-white/7"
        style={sectionStyle}
      />
      <MetricCard
        icon={Sparkles}
        label={t('vacuum.cleanedArea')}
        value={cleanedArea}
        className="bg-white/7"
        style={sectionStyle}
      />
      <MetricCard
        icon={Wind}
        label={t('vacuum.cleaningTime')}
        value={cleaningTime}
        className="bg-white/7"
        style={sectionStyle}
      />
    </div>
  );
}
