import type { CSSProperties } from 'react';
import { InteractivePill } from '@/app/components/primitives';

interface SelectablePillProps {
  label: string;
  description?: string;
  active: boolean;
  onClick: () => void;
  style?: CSSProperties;
}

export function SelectablePill({
  label,
  description,
  active,
  onClick,
  style,
}: SelectablePillProps) {
  return (
    <InteractivePill
      onClick={onClick}
      active={active}
      intent="navigation"
      variant="default"
      className="min-h-18 w-full items-start justify-start rounded-2xl px-4 py-3 text-left"
      style={style}
    >
      <div className="text-sm font-semibold">{label}</div>
      {description ? <div className="mt-1 text-sm text-white/72">{description}</div> : null}
    </InteractivePill>
  );
}
