interface ClimateSmallViewProps {
  temperature: number;
  mode: string;
  textPrimary: string;
  textSecondary: string;
}

export function ClimateSmallView({
  temperature,
  mode,
  textPrimary,
  textSecondary,
}: ClimateSmallViewProps) {
  return (
    <div className="flex-1 flex flex-col items-center justify-center">
      <div className={`text-3xl font-bold ${textPrimary} leading-none mb-1`}>{temperature}°</div>
      <div className={`text-xs ${textSecondary}`}>{mode}</div>
    </div>
  );
}
