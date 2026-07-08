export function getDeviceEditorSurfaceTokens(isOn: boolean) {
  return {
    sectionLabelClassName: isOn ? 'text-gray-300' : 'text-gray-500',
    sectionValueClassName: isOn ? 'text-white' : 'text-gray-500',
    titleClassName: isOn ? 'text-white' : 'text-gray-300',
    descriptionClassName: isOn ? 'text-gray-300' : 'text-gray-600',
    closeButtonClassName: isOn ? 'bg-white/10 hover:bg-white/20' : 'bg-white/5 hover:bg-white/10',
    closeIconClassName: isOn ? 'text-gray-300' : 'text-gray-600',
    settingPanelClassName: 'border-white/10 bg-white/5',
    settingLabelClassName: isOn ? 'text-gray-100' : 'text-gray-300',
    settingDescriptionClassName: isOn ? 'text-gray-300' : 'text-gray-500',
    dragHandleClassName: isOn
      ? 'text-white/55 hover:text-white/85 cursor-grab active:cursor-grabbing'
      : 'text-gray-500 cursor-grab active:cursor-grabbing',
    iconChipClassName: 'bg-white/10',
    iconClassName: 'text-white',
    inputClassName: isOn
      ? 'border-white/15 bg-white/10 text-white'
      : 'border-white/10 bg-white/5 text-gray-300',
    suffixClassName: isOn ? 'text-gray-300' : 'text-gray-500',
    disabledCircleClassName: 'cursor-not-allowed opacity-50',
    disabledSurfaceColor: '#4a4a4a',
  };
}
