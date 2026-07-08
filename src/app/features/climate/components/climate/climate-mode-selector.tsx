import * as RadioGroup from '@radix-ui/react-radio-group';

interface ClimateModeSelectorProps {
  mode: string;
  onModeChange: (mode: string) => void;
  activeBtnBg: string;
  inactiveBtnBg: string;
  isLarge?: boolean;
}

export function ClimateModeSelector({
  mode,
  onModeChange,
  activeBtnBg,
  inactiveBtnBg,
  isLarge = false,
}: ClimateModeSelectorProps) {
  return (
    <RadioGroup.Root value={mode} onValueChange={onModeChange} className="flex gap-2 mt-2">
      <RadioGroup.Item
        value="Cooling"
        className={`flex-1 py-${isLarge ? '2' : '1.5'} rounded-lg text-${isLarge ? 'xs' : '[10px]'} font-medium transition-colors ${mode === 'Cooling' ? activeBtnBg : inactiveBtnBg}`}
      >
        Cool
      </RadioGroup.Item>
      <RadioGroup.Item
        value="Heating"
        className={`flex-1 py-${isLarge ? '2' : '1.5'} rounded-lg text-${isLarge ? 'xs' : '[10px]'} font-medium transition-colors ${mode === 'Heating' ? activeBtnBg : inactiveBtnBg}`}
      >
        Heat
      </RadioGroup.Item>
      <RadioGroup.Item
        value="Off"
        className={`flex-1 py-${isLarge ? '2' : '1.5'} rounded-lg text-${isLarge ? 'xs' : '[10px]'} font-medium transition-colors ${mode === 'Off' ? activeBtnBg : inactiveBtnBg}`}
      >
        Off
      </RadioGroup.Item>
    </RadioGroup.Root>
  );
}
