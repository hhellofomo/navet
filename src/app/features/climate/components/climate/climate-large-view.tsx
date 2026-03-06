import { ClimateModeSelector } from './climate-mode-selector';

interface ClimateLargeViewProps {
  temperature: number;
  mode: string;
  textPrimary: string;
  textSecondary: string;
  activeBtnBg: string;
  inactiveBtnBg: string;
  onModeChange: (mode: string) => void;
}

export function ClimateLargeView({
  temperature,
  mode,
  textPrimary,
  textSecondary,
  activeBtnBg,
  inactiveBtnBg,
  onModeChange,
}: ClimateLargeViewProps) {
  return (
    <>
      <div className="flex-1 flex items-center justify-center">
        <div className="text-center">
          <div className={`text-3xl font-bold ${textPrimary} mb-1`}>{temperature}°C</div>
          <div className={`text-xs ${textSecondary}`}>{mode}</div>
        </div>
      </div>
      <ClimateModeSelector
        mode={mode}
        onModeChange={onModeChange}
        activeBtnBg={activeBtnBg}
        inactiveBtnBg={inactiveBtnBg}
        isLarge
      />
    </>
  );
}
