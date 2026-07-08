import { memo } from 'react';

interface EnergyGaugeProps {
  /** 0–100 */
  value: number;
  color?: string;
  /** Main text in the center of the arc */
  label?: string;
  /** Smaller text below the main label */
  sublabel?: string;
}

// Semi-circle: center (100, 100), radius 78
// Arc from (22, 100) → (178, 100) over the top
const CX = 100;
const CY = 100;
const R = 78;
const TRACK_W = 10;
const SEMI_CIRC = Math.PI * R; // ≈ 245

const ARC_D = `M ${CX - R} ${CY} A ${R} ${R} 0 0 1 ${CX + R} ${CY}`;

export const EnergyGauge = memo(function EnergyGauge({
  value,
  color = '#22d3ee',
  label,
  sublabel,
}: EnergyGaugeProps) {
  const filled = Math.min(1, Math.max(0, value / 100)) * SEMI_CIRC;

  return (
    // viewBox height = 115 — crops below the center line, leaving space for sublabel
    <svg viewBox="0 0 200 115" className="w-full" role="img" aria-label={label ?? 'Gauge'}>
      {/* Track */}
      <path
        d={ARC_D}
        fill="none"
        stroke="rgba(255,255,255,0.08)"
        strokeWidth={TRACK_W}
        strokeLinecap="round"
      />
      {/* Value arc */}
      <path
        d={ARC_D}
        fill="none"
        stroke={color}
        strokeWidth={TRACK_W}
        strokeLinecap="round"
        strokeDasharray={`${filled} ${SEMI_CIRC}`}
      />
      {/* Main label */}
      {label && (
        <text
          x={CX}
          y={CY - 8}
          textAnchor="middle"
          fontSize="26"
          fontWeight="700"
          fill="rgba(255,255,255,0.9)"
        >
          {label}
        </text>
      )}
      {/* Sublabel */}
      {sublabel && (
        <text x={CX} y={CY + 12} textAnchor="middle" fontSize="11" fill="rgba(255,255,255,0.38)">
          {sublabel}
        </text>
      )}
      {/* Min / max tick labels */}
      <text x={CX - R + 2} y={CY + 18} fontSize="9" fill="rgba(255,255,255,0.25)">
        0
      </text>
      <text x={CX + R - 2} y={CY + 18} textAnchor="end" fontSize="9" fill="rgba(255,255,255,0.25)">
        100
      </text>
    </svg>
  );
});
