export interface HVACSettingsDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  name: string;
  room: string;
  isOn: boolean;
  mode: string;
  targetTemp: number;
  currentTemp: number;
  onModeChange: (mode: string) => void;
  onTogglePower: () => void;
}
