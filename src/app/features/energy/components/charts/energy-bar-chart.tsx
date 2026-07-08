import { memo, useId } from 'react';

export interface EnergyBarDatum {
  label: string;
  value: number;
  unit?: string;
  /** Show warning indicator and stripe overlay on this bar */
  alert?: boolean;
}

interface EnergyBarChartProps {
  data: EnergyBarDatum[];
  /** Primary bar color (top of gradient) */
  color?: string;
  /** Alert bar color */
  alertColor?: string;
}

const VB_W = 400;
const VB_H = 160;
const PAD_TOP = 24;
const PAD_BOT = 28;

export const EnergyBarChart = memo(function EnergyBarChart({
  data,
  color = '#22d3ee',
  alertColor = '#fb923c',
}: EnergyBarChartProps) {
  const id = useId();
  const chartH = VB_H - PAD_TOP - PAD_BOT;
  const step = VB_W / data.length;
  const barW = step * 0.6;
  const maxValue = Math.max(...data.map((d) => d.value), 1);

  return (
    <svg viewBox={`0 0 ${VB_W} ${VB_H}`} className="w-full" role="img" aria-label="Bar chart">
      <defs>
        {data.map((d, i) => {
          const c = d.alert ? alertColor : color;
          return (
            <linearGradient key={i} id={`${id}-g${i}`} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={c} stopOpacity="0.85" />
              <stop offset="100%" stopColor={c} stopOpacity="0.18" />
            </linearGradient>
          );
        })}
        {/* Diagonal stripe overlay for alert bars */}
        <pattern
          id={`${id}-stripe`}
          patternUnits="userSpaceOnUse"
          width="6"
          height="6"
          patternTransform="rotate(45)"
        >
          <rect width="3" height="6" fill={`${alertColor}20`} />
        </pattern>
      </defs>

      {data.map((d, i) => {
        const barH = Math.max(6, (d.value / maxValue) * chartH);
        const x = i * step + (step - barW) / 2;
        const y = PAD_TOP + chartH - barH;
        const cx = x + barW / 2;

        return (
          <g key={d.label}>
            {/* Bar */}
            <rect x={x} y={y} width={barW} height={barH} rx="8" fill={`url(#${id}-g${i})`} />
            {/* Stripe overlay on alert bars */}
            {d.alert && (
              <rect x={x} y={y} width={barW} height={barH} rx="8" fill={`url(#${id}-stripe)`} />
            )}
            {/* Value label */}
            <text
              x={cx}
              y={y - 7}
              textAnchor="middle"
              fontSize="11"
              fontWeight="600"
              fill="rgba(255,255,255,0.82)"
            >
              {d.value}
              {d.unit ?? ''}
            </text>
            {/* Warning triangle */}
            {d.alert && barH > 36 && (
              <g transform={`translate(${cx}, ${y + barH - 20})`}>
                <polygon
                  points="0,-8 7.5,4.5 -7.5,4.5"
                  fill="none"
                  stroke={alertColor}
                  strokeWidth="1.4"
                  strokeLinejoin="round"
                />
                <line
                  x1="0"
                  y1="-4"
                  x2="0"
                  y2="1"
                  stroke={alertColor}
                  strokeWidth="1.4"
                  strokeLinecap="round"
                />
                <circle cx="0" cy="3.2" r="0.9" fill={alertColor} />
              </g>
            )}
            {/* Category label */}
            <text
              x={cx}
              y={VB_H - 7}
              textAnchor="middle"
              fontSize="10"
              fill="rgba(255,255,255,0.38)"
            >
              {d.label}
            </text>
          </g>
        );
      })}
    </svg>
  );
});
