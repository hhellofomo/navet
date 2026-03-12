import { getHVACModeButtonColor } from '../../utils/hvac-styles';

export function getHVACSettingsDialogStyles(mode: string, isOn: boolean) {
  const modeSurface = getModeSurface(mode, isOn);

  return {
    contentClassName: `bg-gradient-to-br from-${modeSurface.from}/95 to-${modeSurface.to}/95 border-${modeSurface.border}`,
    sectionLabelClassName: 'text-gray-300',
    infoPanelClassName: 'rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur-sm',
    targetValueClassName: isOn ? 'text-white' : 'text-gray-500',
    currentValueClassName: 'text-gray-300',
    modeButtonClassName: (buttonMode: string) => {
      const shadowClass = getModeButtonShadow(buttonMode, mode, isOn);
      return `${getHVACModeButtonColor(buttonMode, mode, isOn)} ${shadowClass}`.trim();
    },
    modeIconWrapClassName: (buttonMode: string) =>
      mode === buttonMode && isOn ? 'bg-white/20' : 'bg-white/10',
    powerButtonClassName: isOn
      ? 'bg-white/10 hover:bg-white/15'
      : 'bg-red-500/20 hover:bg-red-500/30',
    powerIconWrapClassName: isOn ? 'bg-white/10' : 'bg-red-500/30',
    powerStatusClassName: isOn ? 'bg-green-500/20 text-green-400' : 'bg-gray-500/20 text-gray-300',
  };
}

function getModeSurface(mode: string, isOn: boolean) {
  if (!isOn) {
    return { from: 'gray-900', to: 'gray-950', border: 'gray-500/10' };
  }

  switch (mode) {
    case 'cool':
      return { from: 'blue-900', to: 'blue-950', border: 'blue-500/20' };
    case 'heat':
      return { from: 'red-900', to: 'red-950', border: 'red-500/20' };
    case 'fan':
      return { from: 'green-900', to: 'green-950', border: 'green-500/20' };
    default:
      return { from: 'gray-900', to: 'gray-950', border: 'gray-500/10' };
  }
}

function getModeButtonShadow(buttonMode: string, currentMode: string, isOn: boolean) {
  if (currentMode !== buttonMode || !isOn) {
    return '';
  }

  switch (buttonMode) {
    case 'cool':
      return 'shadow-lg shadow-blue-500/30';
    case 'heat':
      return 'shadow-lg shadow-red-500/30';
    case 'fan':
      return 'shadow-lg shadow-green-500/30';
    default:
      return '';
  }
}
