import { memo, useId } from 'react';

export interface EnergySparklinePoint {
  value: number;
}

interface EnergySparklineProps {
  data: EnergySparklinePoint[];
  color?: string;
  /** Height in viewBox units — controls aspect ratio (default 40) */
  height?: number;
}

const VB_W = 200;
const PAD_X = 2;
const PAD_Y = 3;

/** Compute a smooth cubic bezier path through points using Catmull-Rom → cubic bezier conversion */
function smoothPath(pts: { x: number; y: number }[]): string {
  if (pts.length < 2) return '';
  if (pts.length === 2) return `M ${pts[0].x} ${pts[0].y} L ${pts[1].x} ${pts[1].y}`;

  let d = `M ${pts[0].x} ${pts[0].y}`;
  for (let i = 0; i < pts.length - 1; i++) {
    const p0 = pts[Math.max(0, i - 1)];
    const p1 = pts[i];
    const p2 = pts[i + 1];
    const p3 = pts[Math.min(pts.length - 1, i + 2)];

    const cp1x = p1.x + (p2.x - p0.x) / 6;
    const cp1y = p1.y + (p2.y - p0.y) / 6;
    const cp2x = p2.x - (p3.x - p1.x) / 6;
    const cp2y = p2.y - (p3.y - p1.y) / 6;

    d += ` C ${cp1x} ${cp1y} ${cp2x} ${cp2y} ${p2.x} ${p2.y}`;
  }
  return d;
}

export const EnergySparkline = memo(function EnergySparkline({
  data,
  color = '#22d3ee',
  height = 40,
}: EnergySparklineProps) {
  const id = useId();

  if (data.length < 2) return null;

  const chartW = VB_W - PAD_X * 2;
  const chartH = height - PAD_Y * 2;
  const baseline = PAD_Y + chartH;

  const maxVal = Math.max(...data.map((d) => d.value), 1);
  const xAt = (i: number) => PAD_X + (i / (data.length - 1)) * chartW;
  const yAt = (v: number) => PAD_Y + (1 - v / maxVal) * chartH;

  const pts = data.map((d, i) => ({ x: xAt(i), y: yAt(d.value) }));
  const line = smoothPath(pts);

  // Closed area path
  const area =
    `M ${pts[0].x} ${baseline} L ${pts[0].x} ${pts[0].y}` +
    line.slice(line.indexOf(' ')) +
    ` L ${pts[pts.length - 1].x} ${baseline} Z`;

  return (
    <svg
      viewBox={`0 0 ${VB_W} ${height}`}
      className="w-full"
      role="img"
      aria-label="Power sparkline"
      preserveAspectRatio="none"
    >
      <defs>
        <linearGradient id={`${id}-sg`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={color} stopOpacity="0.35" />
          <stop offset="100%" stopColor={color} stopOpacity="0.02" />
        </linearGradient>
      </defs>

      {/* Filled area */}
      <path d={area} fill={`url(#${id}-sg)`} />

      {/* Smooth stroke */}
      <path
        d={line}
        fill="none"
        stroke={color}
        strokeWidth="1.5"
        strokeLinejoin="round"
        strokeLinecap="round"
      />

      {/* Live dot at the last point */}
      <circle cx={pts[pts.length - 1].x} cy={pts[pts.length - 1].y} r="2.5" fill={color} />
    </svg>
  );
});
