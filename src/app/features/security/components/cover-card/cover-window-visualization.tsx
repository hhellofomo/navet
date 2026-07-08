import * as Slider from '@radix-ui/react-slider';
import type { ThemeType } from '@/app/hooks';

interface CoverWindowVisualizationProps {
  position: number;
  theme: ThemeType;
  ariaLabel: string;
  onSetPosition: (newPosition: number) => void;
}

const CASSETTE_HEIGHT = 12;
const SLAT_COUNT = 11;

export function CoverWindowVisualization({
  position,
  theme,
  ariaLabel,
  onSetPosition,
}: CoverWindowVisualizationProps) {
  const blindCoverage = Math.max(0, Math.min(1, (100 - position) / 100));
  const isLight = theme === 'light';

  return (
    <Slider.Root
      orientation="vertical"
      value={[100 - position]}
      min={0}
      max={100}
      step={1}
      inverted
      onValueChange={(values) => {
        const v = values[0];
        if (typeof v === 'number') onSetPosition(100 - v);
      }}
      className="relative flex h-full min-h-52 w-full max-w-40 touch-none select-none items-center justify-center"
      aria-label={ariaLabel}
      onPointerDown={(e) => e.stopPropagation()}
      onClick={(e) => e.stopPropagation()}
    >
      <div
        className={`absolute inset-0 overflow-hidden rounded-2xl border ${
          isLight ? 'border-slate-300/70 bg-sky-50/60' : 'border-white/14 bg-black/22'
        }`}
      >
        <div
          className={`absolute inset-x-0 top-0 rounded-t-2xl border-b ${
            isLight ? 'border-slate-300/50 bg-slate-200/80' : 'border-white/10 bg-white/16'
          }`}
          style={{ height: CASSETTE_HEIGHT }}
        />

        <div className="absolute inset-x-0 bottom-0" style={{ top: CASSETTE_HEIGHT }}>
          <div
            className="absolute inset-0"
            style={{
              background: isLight
                ? 'linear-gradient(180deg, rgba(186,230,253,0.28) 0%, rgba(224,242,254,0.08) 100%)'
                : 'linear-gradient(180deg, rgba(147,197,253,0.07) 0%, rgba(255,255,255,0.02) 100%)',
            }}
          />

          {blindCoverage > 0.01 && (
            <div
              className="absolute inset-x-0 top-0 overflow-hidden"
              style={{ height: `${blindCoverage * 100}%` }}
            >
              <div
                className="absolute inset-0"
                style={{
                  background: isLight
                    ? 'linear-gradient(180deg, rgba(248,250,252,0.97) 0%, rgba(218,226,238,0.93) 100%)'
                    : 'linear-gradient(180deg, rgba(255,255,255,0.22) 0%, rgba(255,255,255,0.11) 100%)',
                }}
              />
              {Array.from({ length: SLAT_COUNT }, (_, i) => (
                <div
                  key={i}
                  className={`pointer-events-none absolute inset-x-0 border-b ${
                    isLight ? 'border-slate-300/55' : 'border-white/10'
                  }`}
                  style={{ top: `${((i + 1) / (SLAT_COUNT + 1)) * 100}%` }}
                />
              ))}
              <div
                className={`absolute inset-x-1.5 bottom-0 h-2 rounded-[3px] border ${
                  isLight ? 'border-slate-300/80 bg-slate-300/70' : 'border-white/18 bg-white/30'
                }`}
              />
            </div>
          )}
        </div>

        <div className="absolute bottom-2 right-2 rounded-full bg-black/50 px-2.5 py-1.5 text-xs font-medium text-white backdrop-blur-sm">
          {position}%
        </div>
      </div>

      <Slider.Track className="absolute inset-0 h-full w-full cursor-ns-resize opacity-0" />
      <Slider.Thumb
        className="absolute h-0.5 w-full opacity-0 outline-none"
        aria-label={ariaLabel}
      />
    </Slider.Root>
  );
}
