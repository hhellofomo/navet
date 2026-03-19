import { memo, useId } from 'react';
import { useTheme } from '@/app/hooks';
import { getEnergyChartTokens } from './energy-chart-tokens';

export interface EnergyAreaPoint {
  x: string;
  y: number;
}

interface EnergyAreaChartProps {
  data: EnergyAreaPoint[];
  yMax?: number;
  yTicks?: number[];
  /** Unit suffix shown on y-axis labels e.g. "%" or "kW" */
  yUnit?: string;
  accentColor: string;
}

const VB_W = 400;
const VB_H = 96;
const PAD = { top: 8, right: 6, bottom: 22, left: 32 };

export const EnergyAreaChart = memo(function EnergyAreaChart({
  data,
  yMax = 100,
  yTicks = [0, 25, 50, 75, 100],
  yUnit = '%',
  accentColor,
}: EnergyAreaChartProps) {
  const { theme } = useTheme();
  const id = useId();
  const tokens = getEnergyChartTokens(theme, accentColor);
  const cW = VB_W - PAD.left - PAD.right;
  const cH = VB_H - PAD.top - PAD.bottom;
  const baseline = PAD.top + cH;

  const xAt = (i: number) => (data.length < 2 ? PAD.left : PAD.left + (i / (data.length - 1)) * cW);
  const yAt = (v: number) => PAD.top + (1 - Math.min(1, v / yMax)) * cH;

  const pts = data.map((d, i) => ({ x: xAt(i), y: yAt(d.y) }));

  // Step-style filled area
  let area = `M ${pts[0].x} ${baseline} L ${pts[0].x} ${pts[0].y}`;
  for (let i = 1; i < pts.length; i++) {
    area += ` H ${pts[i].x} V ${pts[i].y}`;
  }
  area += ` H ${pts[pts.length - 1].x} V ${baseline} Z`;

  // Step-style stroke line
  let line = `M ${pts[0].x} ${pts[0].y}`;
  for (let i = 1; i < pts.length; i++) {
    line += ` H ${pts[i].x} V ${pts[i].y}`;
  }

  return (
    <svg viewBox={`0 0 ${VB_W} ${VB_H}`} className="h-28 w-full" role="img" aria-label="Area chart">
      <defs>
        <linearGradient id={`${id}-ag`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={tokens.accent} stopOpacity="0.18" />
          <stop offset="100%" stopColor={tokens.accent} stopOpacity="0.02" />
        </linearGradient>
      </defs>

      {yTicks.map((v) => {
        const y = yAt(v);
        return (
          <g key={v}>
            <line
              x1={PAD.left}
              y1={y}
              x2={VB_W - PAD.right}
              y2={y}
              stroke={v === 0 ? tokens.gridStrong : tokens.grid}
              strokeWidth="1"
            />
            <text
              x={PAD.left - 5}
              y={y + 3.5}
              textAnchor="end"
              fontSize="9"
              fill={tokens.labelSubtle}
            >
              {v}
              {yUnit}
            </text>
          </g>
        );
      })}

      <path d={area} fill={`url(#${id}-ag)`} />
      <path d={line} fill="none" stroke={tokens.accent} strokeWidth="1.5" strokeLinejoin="miter" />
      {data.map((d, i) => (
        <text
          key={`${d.x}-${i}`}
          x={xAt(i)}
          y={VB_H - 7}
          textAnchor="middle"
          fontSize="9"
          fill={tokens.labelMuted}
        >
          {d.x}
        </text>
      ))}
    </svg>
  );
});
