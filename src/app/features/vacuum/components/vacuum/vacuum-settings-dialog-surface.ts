import { getDeviceEditorSurfaceTokens } from '@/app/components/shared/device-editor';
import { getThemeSurfaceTokens } from '@/app/components/shared/theme/theme-surface-tokens';
import type { ThemeType } from '@/app/hooks/use-theme';

export function getVacuumSettingsDialogSurface(theme: ThemeType) {
  const surface = getThemeSurfaceTokens(theme);
  const editorSurface = getDeviceEditorSurfaceTokens(theme !== 'light');

  return {
    surface,
    editorSurface,
    contentClassName:
      theme === 'light'
        ? 'bg-white'
        : theme === 'glass'
          ? 'bg-white/10 backdrop-blur-2xl'
          : 'bg-gray-900',
    headingClassName: surface.textPrimary,
    optionButtonClassName: `${surface.inputBg} border ${surface.border} ${surface.textSecondary}`,
    secondaryButtonClassName: `${surface.subtleBg} ${surface.hoverBg} ${surface.textPrimary}`,
  };
}
