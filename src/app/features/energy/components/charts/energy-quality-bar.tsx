import { memo } from 'react';

interface EnergyQualityBarProps {
  /** 0–100 — how far along the Bad→Good scale the current performance is */
  value: number;
  label?: string;
  badLabel?: string;
  goodLabel?: string;
  /** Number of vertical tick segments */
  segments?: number;
}

// Color stops from bad (red) → good (green)
const STOP_COLORS = ['#ef4444', '#f97316', '#f59e0b', '#84cc16', '#22c55e', '#10b981'];

function colorAt(t: number): string {
  const i = Math.min(STOP_COLORS.length - 1, Math.floor(t * STOP_COLORS.length));
  return STOP_COLORS[i];
}

const VB_W = 400;
const VB_H = 44;
const BAR_TOP = 6;
const BAR_H = 22;

export const EnergyQualityBar = memo(function EnergyQualityBar({
  value,
  label,
  badLabel = 'Bad',
  goodLabel = 'Good',
  segments = 44,
}: EnergyQualityBarProps) {
  const activeCount = Math.round(Math.min(1, Math.max(0, value / 100)) * segments);
  const segW = VB_W / segments;

  return (
    <svg
      viewBox={`0 0 ${VB_W} ${VB_H}`}
      className="w-full"
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
            fill={colorAt(t)}
            opacity={active ? 0.88 : 0.1}
          />
        );
      })}

      {/* Bad / Good labels */}
      <text x={0} y={VB_H - 4} fontSize="9" fill="rgba(255,255,255,0.3)">
        {badLabel}
      </text>
      <text x={VB_W} y={VB_H - 4} textAnchor="end" fontSize="9" fill="rgba(255,255,255,0.3)">
        {goodLabel}
      </text>

      {/* Optional center label */}
      {label && (
        <text
          x={VB_W / 2}
          y={VB_H - 4}
          textAnchor="middle"
          fontSize="9"
          fill="rgba(255,255,255,0.45)"
        >
          {label}
        </text>
      )}
    </svg>
  );
});
