import { memo } from 'react';
import { useTheme } from '@/app/hooks';
import { getEnergyChartTokens } from './energy-chart-tokens';

interface EnergyQualityBarProps {
  /** 0–100 — how far along the Bad→Good scale the current performance is */
  value: number;
  label?: string;
  badLabel?: string;
  goodLabel?: string;
  /** Number of vertical tick segments */
  segments?: number;
  accentColor: string;
}

const VB_W = 400;
const VB_H = 34;
const BAR_TOP = 4;
const BAR_H = 14;

export const EnergyQualityBar = memo(function EnergyQualityBar({
  value,
  label,
  badLabel = 'Bad',
  goodLabel = 'Good',
  segments = 44,
  accentColor,
}: EnergyQualityBarProps) {
  const { theme } = useTheme();
  const tokens = getEnergyChartTokens(theme, accentColor);
  const activeCount = Math.round(Math.min(1, Math.max(0, value / 100)) * segments);
  const segW = VB_W / segments;

  return (
    <svg
      viewBox={`0 0 ${VB_W} ${VB_H}`}
      className="h-12 w-full"
      role="img"
      aria-label={label ?? 'Quality bar'}
    >
      {Array.from({ length: segments }, (_, i) => {
        const t = i / (segments - 1);
        const active = i < activeCount;
        return (
          <rect
            key={i}
            x={i * segW + 1}
            y={BAR_TOP}
            width={segW - 2}
            height={BAR_H}
            rx="2"
            fill={t < 0.33 ? tokens.alert : t < 0.66 ? tokens.warn : tokens.good}
            opacity={active ? 0.58 : 0.12}
          />
        );
      })}

      <text x={0} y={VB_H - 4} fontSize="9" fill={tokens.labelSubtle}>
        {badLabel}
      </text>
      <text x={VB_W} y={VB_H - 4} textAnchor="end" fontSize="9" fill={tokens.labelSubtle}>
        {goodLabel}
      </text>

      {label && (
        <text x={VB_W / 2} y={VB_H - 4} textAnchor="middle" fontSize="9" fill={tokens.labelMuted}>
          {label}
        </text>
      )}
    </svg>
  );
});
