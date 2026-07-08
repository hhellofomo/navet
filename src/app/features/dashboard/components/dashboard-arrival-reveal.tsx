import { useEffect, useState } from 'react';
import { getThemeColorValue } from '@/app/components/shared/theme/theme-colors';
import { useTheme } from '@/app/hooks';

interface DashboardArrivalRevealProps {
  open: boolean;
  onComplete: () => void;
  variant: 'all' | 'blank' | 'import';
}

const ARRIVAL_COPY = {
  all: {
    bakingKicker: 'Waking Up Your Home',
    bakingHeading: 'Bringing every room and entity into view.',
    bakingBody:
      'Navet is assembling your full dashboard so you can begin with everything ready and visible.',
    revealKicker: 'Welcome Home',
    revealHeading: 'Everything is in place.',
    revealBody:
      'Your full dashboard is ready. Start exploring and shape it further from a complete first view.',
  },
  blank: {
    bakingKicker: 'Preparing Your Canvas',
    bakingHeading: 'Clearing the board for a fresh start.',
    bakingBody:
      'Navet is setting up a clean dashboard so you can build every room, card, and widget your way.',
    revealKicker: 'Start Fresh',
    revealHeading: 'Your blank dashboard is ready.',
    revealBody:
      'You are starting with an empty board. Add back exactly what matters and build the experience from scratch.',
  },
  import: {
    bakingKicker: 'Restoring Your Dashboard',
    bakingHeading: 'Putting every saved room, card, and detail back in place.',
    bakingBody:
      'Navet is restoring your saved setup and preparing the reveal so you can step right back in.',
    revealKicker: 'Welcome Back',
    revealHeading: 'Your dashboard has been restored.',
    revealBody: 'Everything from your backup is in place and ready for you to return to.',
  },
} as const;

export function DashboardArrivalReveal({ open, onComplete, variant }: DashboardArrivalRevealProps) {
  const { theme, primaryColor } = useTheme();
  const [phase, setPhase] = useState<'baking' | 'revealed' | 'exiting'>('baking');

  useEffect(() => {
    if (!open) {
      return;
    }

    setPhase('baking');
    const timeoutId = window.setTimeout(() => setPhase('revealed'), 3200);
    return () => window.clearTimeout(timeoutId);
  }, [open]);

  useEffect(() => {
    if (phase !== 'exiting') {
      return;
    }

    const timeoutId = window.setTimeout(onComplete, 900);
    return () => window.clearTimeout(timeoutId);
  }, [onComplete, phase]);

  if (!open) return null;

  const copy = ARRIVAL_COPY[variant];
  const accentColor = getThemeColorValue(primaryColor);
  const panelBackground =
    theme === 'light' ? 'rgba(255, 255, 255, 0.72)' : 'rgba(10, 10, 10, 0.55)';
  const textColor = theme === 'light' ? '#111827' : '#ffffff';
  const subtleColor = theme === 'light' ? '#4b5563' : 'rgba(255,255,255,0.78)';
  const backdropColor = theme === 'light' ? 'rgba(248, 250, 252, 0.84)' : 'rgba(3, 7, 18, 0.78)';

  return (
    <div
      className="pointer-events-none fixed inset-0 z-[90] overflow-hidden"
      style={{
        background: backdropColor,
      }}
      aria-hidden="true"
    >
      <style>{`
        @keyframes navet-dashboard-bake-panel {
          0% { opacity: 1; }
          42% { opacity: 1; }
          56% { opacity: 0; }
          100% { opacity: 0; }
        }

        @keyframes navet-dashboard-bake-logo {
          0% { transform: scale(0.9) rotate(-8deg); opacity: 0; filter: blur(5px); }
          14% { transform: scale(1) rotate(0deg); opacity: 1; filter: blur(0); }
          36% { transform: scale(1.04) rotate(0deg); opacity: 1; filter: blur(0); }
          56% { transform: scale(0.98) rotate(0deg); opacity: 0; filter: blur(4px); }
          100% { transform: scale(0.98) rotate(0deg); opacity: 0; filter: blur(4px); }
        }

        @keyframes navet-dashboard-bake-pulse {
          0% { transform: translate(-50%, -50%) scale(0.82); opacity: 0.12; }
          50% { transform: translate(-50%, -50%) scale(1.05); opacity: 0.34; }
          100% { transform: translate(-50%, -50%) scale(1.26); opacity: 0.08; }
        }

        @keyframes navet-dashboard-bake-orbit {
          0% { transform: rotate(0deg) translateX(0); opacity: 0; }
          18% { opacity: 1; }
          100% { transform: rotate(360deg) translateX(0); opacity: 0; }
        }

        @keyframes navet-dashboard-bake-copy {
          0% { opacity: 0; transform: translateY(12px); }
          16% { opacity: 1; transform: translateY(0); }
          48% { opacity: 1; transform: translateY(0); }
          60% { opacity: 0; transform: translateY(-8px); }
          100% { opacity: 0; transform: translateY(-8px); }
        }

        @keyframes navet-dashboard-reveal-ring {
          0% { transform: translate(-50%, -50%) scale(0.68); opacity: 0; }
          18% { opacity: 0.95; }
          66% { opacity: 0.32; }
          100% { transform: translate(-50%, -50%) scale(1.55); opacity: 0; }
        }

        @keyframes navet-dashboard-reveal-glow {
          0% { transform: translate(-50%, -50%) scale(0.8); opacity: 0; }
          24% { opacity: 1; }
          100% { transform: translate(-50%, -50%) scale(1.18); opacity: 0.2; }
        }

        @keyframes navet-dashboard-reveal-card {
          0% { transform: translateY(22px) scale(0.96); opacity: 0; }
          62% { transform: translateY(0) scale(1.012); opacity: 1; }
          100% { transform: translateY(0) scale(1); opacity: 1; }
        }

        @keyframes navet-dashboard-reveal-fade {
          0% { opacity: 0; }
          10% { opacity: 1; }
          90% { opacity: 1; }
          100% { opacity: 0; }
        }

        @keyframes navet-dashboard-reveal-line {
          0% { transform: scaleX(0.15); opacity: 0; }
          28% { transform: scaleX(1); opacity: 1; }
          100% { transform: scaleX(1.08); opacity: 0; }
        }

        @keyframes navet-dashboard-reveal-logo {
          0% { transform: scale(0.82); opacity: 0; filter: blur(6px); }
          62% { transform: scale(1.03); opacity: 1; filter: blur(0); }
          100% { transform: scale(1); opacity: 1; filter: blur(0); }
        }

        @keyframes navet-dashboard-reveal-panel {
          0% { opacity: 0; transform: scale(0.985) translateY(14px); }
          100% { opacity: 1; transform: scale(1) translateY(0); }
        }

        @keyframes navet-dashboard-exit-shell {
          0% { opacity: 1; }
          100% { opacity: 0; }
        }

        @keyframes navet-dashboard-exit-card {
          0% { opacity: 1; transform: translateY(0) scale(1); filter: blur(0); }
          100% { opacity: 0; transform: translateY(16px) scale(0.985); filter: blur(8px); }
        }
      `}</style>

      <div
        className="absolute inset-0"
        style={{
          background: `radial-gradient(circle at 50% 38%, ${accentColor}18 0%, transparent 42%), ${backdropColor}`,
          animation:
            phase === 'exiting' ? 'navet-dashboard-exit-shell 0.9s ease forwards' : undefined,
        }}
      />

      <div
        className="absolute inset-0"
        style={{
          animation:
            phase === 'baking' ? 'navet-dashboard-bake-panel 6.2s ease forwards' : undefined,
          opacity: phase === 'baking' ? 1 : 0,
        }}
      >
        <div
          className="absolute left-1/2 top-[42%] h-[22rem] w-[22rem] rounded-full blur-3xl"
          style={{
            background: `radial-gradient(circle, ${accentColor}2f 0%, ${accentColor}10 55%, transparent 76%)`,
            animation: 'navet-dashboard-bake-pulse 2.4s ease-in-out infinite',
          }}
        />
        <div className="absolute inset-0 flex items-center justify-center px-6">
          <div className="relative flex w-full max-w-lg flex-col items-center text-center">
            <div className="relative h-40 w-40">
              {[0, 1, 2].map((index) => (
                <div
                  key={index}
                  className="absolute left-1/2 top-1/2 h-3.5 w-3.5 rounded-full"
                  style={{
                    backgroundColor: accentColor,
                    boxShadow: `0 0 24px ${accentColor}88`,
                    transformOrigin: `0 ${index === 1 ? 56 : 46}px`,
                    animation:
                      phase === 'baking'
                        ? `navet-dashboard-bake-orbit 2.6s linear ${index * 0.32}s infinite`
                        : undefined,
                  }}
                />
              ))}
              <div
                className="absolute inset-0 flex items-center justify-center"
                style={{
                  animation:
                    phase === 'baking'
                      ? 'navet-dashboard-bake-logo 6.2s cubic-bezier(0.22, 1, 0.36, 1) forwards'
                      : undefined,
                }}
              >
                <img src="/logo.svg" alt="" className="h-24 w-24" />
              </div>
            </div>
            <p
              className="mt-8 text-[11px] font-semibold uppercase tracking-[0.42em]"
              style={{
                color: subtleColor,
                animation:
                  phase === 'baking' ? 'navet-dashboard-bake-copy 6.2s ease forwards' : undefined,
              }}
            >
              {copy.bakingKicker}
            </p>
            <h2
              className="mt-4 text-3xl font-semibold tracking-tight md:text-4xl"
              style={{
                color: textColor,
                animation:
                  phase === 'baking' ? 'navet-dashboard-bake-copy 6.2s ease forwards' : undefined,
              }}
            >
              {copy.bakingHeading}
            </h2>
            <p
              className="mt-4 max-w-md text-sm leading-relaxed md:text-base"
              style={{
                color: subtleColor,
                animation:
                  phase === 'baking' ? 'navet-dashboard-bake-copy 6.2s ease forwards' : undefined,
              }}
            >
              {copy.bakingBody}
            </p>
          </div>
        </div>
      </div>

      {phase !== 'baking' &&
        [0, 0.24, 0.48].map((delay, index) => (
          <div
            key={delay}
            className="absolute left-1/2 top-[40%] rounded-full border"
            style={{
              width: `${15 + index * 4}rem`,
              height: `${15 + index * 4}rem`,
              borderColor: `${accentColor}${index === 0 ? '88' : '44'}`,
              transform: 'translate(-50%, -50%)',
              animation:
                phase === 'revealed'
                  ? `navet-dashboard-reveal-ring 3.8s ease-out ${delay}s forwards`
                  : 'navet-dashboard-exit-shell 0.9s ease forwards',
            }}
          />
        ))}

      {phase !== 'baking' && (
        <div
          className="absolute left-1/2 top-[40%] h-[24rem] w-[24rem] rounded-full blur-3xl"
          style={{
            background: `radial-gradient(circle, ${accentColor}40 0%, ${accentColor}08 56%, transparent 74%)`,
            transform: 'translate(-50%, -50%)',
            animation:
              phase === 'revealed'
                ? 'navet-dashboard-reveal-glow 3.5s ease-out forwards'
                : 'navet-dashboard-exit-shell 0.9s ease forwards',
          }}
        />
      )}

      <div className="absolute inset-0 flex items-center justify-center px-6">
        <div
          className="pointer-events-auto relative w-full max-w-xl overflow-hidden rounded-[32px] border px-8 py-10 text-center shadow-2xl backdrop-blur-2xl"
          style={{
            background: `linear-gradient(180deg, ${panelBackground}, ${theme === 'light' ? 'rgba(255,255,255,0.54)' : 'rgba(17,24,39,0.46)'})`,
            borderColor: `${accentColor}33`,
            animation:
              phase === 'revealed'
                ? 'navet-dashboard-reveal-card 1.05s cubic-bezier(0.22, 1, 0.36, 1) forwards'
                : phase === 'exiting'
                  ? 'navet-dashboard-exit-card 0.9s cubic-bezier(0.22, 1, 0.36, 1) forwards'
                  : undefined,
            opacity: phase === 'revealed' || phase === 'exiting' ? 1 : 0,
          }}
        >
          <div
            className="mx-auto flex min-h-24 w-full max-w-[18rem] items-center justify-center"
            style={{
              animation:
                phase === 'revealed'
                  ? 'navet-dashboard-reveal-logo 1.2s cubic-bezier(0.22, 1, 0.36, 1) forwards'
                  : phase === 'exiting'
                    ? 'navet-dashboard-exit-card 0.9s cubic-bezier(0.22, 1, 0.36, 1) forwards'
                    : undefined,
              opacity: phase === 'revealed' || phase === 'exiting' ? 1 : 0,
            }}
          >
            <img src="/logo.svg" alt="" className="h-24 w-24" />
          </div>
          <div
            className="mx-auto mt-5 h-px w-28 origin-center"
            style={{
              background: `linear-gradient(90deg, transparent, ${accentColor}, transparent)`,
              animation:
                phase === 'revealed'
                  ? 'navet-dashboard-reveal-line 1.4s ease-out 0.25s forwards'
                  : phase === 'exiting'
                    ? 'navet-dashboard-exit-shell 0.9s ease forwards'
                    : undefined,
              opacity: phase === 'revealed' || phase === 'exiting' ? 1 : 0,
            }}
          />
          <p
            className="mt-6 text-[11px] font-semibold uppercase tracking-[0.38em]"
            style={{ color: subtleColor }}
          >
            {copy.revealKicker}
          </p>
          <h2
            className="mt-3 text-4xl font-semibold tracking-tight md:text-5xl"
            style={{ color: textColor }}
          >
            {copy.revealHeading}
          </h2>
          <p
            className="mx-auto mt-4 max-w-md text-sm leading-relaxed md:text-base"
            style={{ color: subtleColor }}
          >
            {copy.revealBody}
          </p>
          <button
            type="button"
            onClick={() => setPhase('exiting')}
            className="mt-8 inline-flex items-center justify-center rounded-full px-6 py-3 text-sm font-semibold text-white transition-transform duration-300 hover:scale-[1.02] active:scale-[0.98]"
            style={{
              background: `linear-gradient(135deg, ${accentColor}, ${accentColor}cc)`,
              boxShadow: `0 18px 40px ${accentColor}55`,
            }}
          >
            Enter My Dashboard
          </button>
        </div>
      </div>
    </div>
  );
}
