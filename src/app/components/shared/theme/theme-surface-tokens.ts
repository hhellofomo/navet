import type { ThemeType } from '@/app/hooks/use-theme';
import type { EffectsQuality } from '@/app/stores/settings-store';

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
  textSubtle: string;
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

const getCurrentEffectsQuality = (): EffectsQuality => {
  if (typeof document === 'undefined') {
    return 'high';
  }

  const value = document.documentElement.dataset.effectsQuality;
  return value === 'medium' || value === 'low' ? value : 'high';
};

export function getThemeSurfaceTokens(
  theme: ThemeType,
  effectsQuality: EffectsQuality = getCurrentEffectsQuality()
): ThemeSurfaceTokens {
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
      textSubtle: 'text-gray-500',
      textMuted: 'text-gray-500',
      iconBg: 'bg-gray-100',
      subtleBg: 'bg-gray-100',
      hoverBg: 'hover:bg-gray-100',
      inputBg: 'bg-gray-100',
      placeholder: 'placeholder-gray-400',
      cardShadow: effectsQuality === 'high' ? 'shadow-md' : '',
      lightOverlay: 'bg-white/60',
      dialogBackdrop: 'bg-black/48',
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
      textSubtle: 'text-gray-300',
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
    const isHigh = effectsQuality === 'high';
    const isMedium = effectsQuality === 'medium';

    return {
      appBg: 'bg-slate-950',
      shellPanel: isHigh
        ? 'bg-white/10 border-white/12'
        : isMedium
          ? 'bg-slate-900/82 border-white/12'
          : 'bg-slate-950/94 border-white/10',
      panel: isHigh ? 'bg-white/10' : isMedium ? 'bg-slate-900/80' : 'bg-slate-950/92',
      panelMuted: isHigh ? 'bg-white/8' : isMedium ? 'bg-slate-900/74' : 'bg-slate-950/88',
      border: isHigh ? 'border-white/18' : 'border-white/12',
      borderStrong: isHigh ? 'border-white/18' : 'border-white/12',
      divider: 'divide-white/10',
      textPrimary: 'text-white',
      textSecondary: 'text-gray-300',
      textSubtle: 'text-gray-300',
      textMuted: isHigh ? 'text-white/60' : 'text-white/68',
      iconBg: isHigh ? 'bg-white/10' : 'bg-white/8',
      subtleBg: isHigh ? 'bg-white/8' : 'bg-white/6',
      hoverBg: isHigh ? 'hover:bg-white/12' : 'hover:bg-white/8',
      inputBg: isHigh ? 'bg-white/8' : 'bg-white/6',
      placeholder: 'placeholder-white/45',
      cardShadow: '',
      lightOverlay: isHigh
        ? 'bg-[linear-gradient(180deg,rgba(255,255,255,0.08),rgba(255,255,255,0.02)_38%,transparent_68%)]'
        : isMedium
          ? 'bg-[linear-gradient(180deg,rgba(255,255,255,0.07),rgba(255,255,255,0.015)_34%,transparent_60%)]'
          : 'bg-[linear-gradient(180deg,rgba(255,255,255,0.05),transparent_52%)]',
      dialogBackdrop: isHigh ? 'bg-black/42' : isMedium ? 'bg-slate-950/68' : 'bg-slate-950/78',
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
    textSubtle: 'text-gray-300',
    textMuted: 'text-gray-500',
    iconBg: 'bg-white/6',
    subtleBg: 'bg-white/5',
    hoverBg: 'hover:bg-white/10',
    inputBg: 'bg-white/5',
    placeholder: 'placeholder-gray-500',
    cardShadow: '',
    lightOverlay: null,
    dialogBackdrop: 'bg-black/50',
    ringOffset: 'ring-offset-gray-900',
  };
}
