import type { ThemeType } from '@/app/hooks/use-theme';

export interface ThemeSurfaceTokens {
  appBg: string;
  shellPanel: string;
  panel: string;
  panelMuted: string;
  border: string;
  borderStrong: string;
  divider: string;
  textPrimary: string;
  textSecondary: string;
  textMuted: string;
  iconBg: string;
  subtleBg: string;
  hoverBg: string;
  inputBg: string;
  placeholder: string;
  cardShadow: string;
  lightOverlay: string | null;
  dialogBackdrop: string;
  ringOffset: string;
}

export function getThemeSurfaceTokens(theme: ThemeType): ThemeSurfaceTokens {
  if (theme === 'light') {
    return {
      appBg: 'bg-gray-50',
      shellPanel: 'bg-white border-gray-200',
      panel: 'bg-white/95',
      panelMuted: 'bg-gray-50',
      border: 'border-gray-200',
      borderStrong: 'border-gray-200/80',
      divider: 'divide-gray-200/80',
      textPrimary: 'text-gray-900',
      textSecondary: 'text-gray-600',
      textMuted: 'text-gray-500',
      iconBg: 'bg-gray-100',
      subtleBg: 'bg-gray-100',
      hoverBg: 'hover:bg-gray-100',
      inputBg: 'bg-gray-100',
      placeholder: 'placeholder-gray-400',
      cardShadow: 'shadow-lg',
      lightOverlay: 'bg-white/60',
      dialogBackdrop: 'bg-black/50 backdrop-blur-sm',
      ringOffset: 'ring-offset-white',
    };
  }

  if (theme === 'contrast') {
    return {
      appBg: 'bg-black',
      shellPanel: 'bg-black border-white/16',
      panel: 'bg-black',
      panelMuted: 'bg-black',
      border: 'border-white/16',
      borderStrong: 'border-white/16',
      divider: 'divide-white/10',
      textPrimary: 'text-white',
      textSecondary: 'text-gray-300',
      textMuted: 'text-gray-300',
      iconBg: 'bg-white/10',
      subtleBg: 'bg-black',
      hoverBg: 'hover:bg-white/10',
      inputBg: 'bg-black',
      placeholder: 'placeholder-gray-400',
      cardShadow: '',
      lightOverlay: null,
      dialogBackdrop: 'bg-black/60 backdrop-blur-sm',
      ringOffset: 'ring-offset-black',
    };
  }

  if (theme === 'glass') {
    return {
      appBg: 'bg-slate-950',
      shellPanel: 'bg-white/8 border-white/12 backdrop-blur-2xl',
      panel: 'bg-white/10',
      panelMuted: 'bg-white/8',
      border: 'border-white/18',
      borderStrong: 'border-white/18',
      divider: 'divide-white/10',
      textPrimary: 'text-white',
      textSecondary: 'text-gray-300',
      textMuted: 'text-white/60',
      iconBg: 'bg-white/10',
      subtleBg: 'bg-white/8',
      hoverBg: 'hover:bg-white/12',
      inputBg: 'bg-white/8',
      placeholder: 'placeholder-white/45',
      cardShadow: '',
      lightOverlay: 'bg-white/[0.03]',
      dialogBackdrop: 'bg-black/45 backdrop-blur-md',
      ringOffset: 'ring-offset-slate-950',
    };
  }

  return {
    appBg: 'bg-[#0a0a0a]',
    shellPanel: 'bg-[#0a0a0a] border-white/5',
    panel: 'bg-gray-900/95',
    panelMuted: 'bg-white/5',
    border: 'border-white/10',
    borderStrong: 'border-white/10',
    divider: 'divide-white/10',
    textPrimary: 'text-white',
    textSecondary: 'text-gray-300',
    textMuted: 'text-gray-500',
    iconBg: 'bg-white/6',
    subtleBg: 'bg-white/5',
    hoverBg: 'hover:bg-white/10',
    inputBg: 'bg-white/5',
    placeholder: 'placeholder-gray-500',
    cardShadow: '',
    lightOverlay: null,
    dialogBackdrop: 'bg-black/50 backdrop-blur-sm',
    ringOffset: 'ring-offset-gray-900',
  };
}
