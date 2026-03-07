import { Profiler, type ReactNode } from 'react';

interface RenderProfilerProps {
  id: string;
  children: ReactNode;
  thresholdMs?: number;
}

export function RenderProfiler({ id, children, thresholdMs = 12 }: RenderProfilerProps) {
  if (!import.meta.env.DEV) {
    return children;
  }

  return (
    <Profiler
      id={id}
      onRender={(profileId, phase, actualDuration, baseDuration, startTime, commitTime) => {
        if (actualDuration < thresholdMs) {
          return;
        }

        console.debug('[Navet][RenderProfiler]', {
          id: profileId,
          phase,
          actualDuration: Number(actualDuration.toFixed(2)),
          baseDuration: Number(baseDuration.toFixed(2)),
          startTime: Number(startTime.toFixed(2)),
          commitTime: Number(commitTime.toFixed(2)),
        });
      }}
    >
      {children}
    </Profiler>
  );
}
