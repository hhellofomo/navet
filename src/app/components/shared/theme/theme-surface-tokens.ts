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
      panel: 'bg-white',
      panelMuted: 'bg-gray-50',
      border: 'border-gray-200',
      borderStrong: 'border-gray-200',
      divider: 'divide-gray-200',
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
      lightOverlay: null,
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
      iconBg: 'bg-zinc-900',
      subtleBg: 'bg-black',
      hoverBg: 'hover:bg-zinc-900',
      inputBg: 'bg-black',
      placeholder: 'placeholder-gray-400',
      cardShadow: '',
      lightOverlay: null,
      dialogBackdrop: 'bg-black/60',
      ringOffset: 'ring-offset-black',
    };
  }

  if (theme === 'glass') {
    const isHigh = effectsQuality === 'high';
    const isMedium = effectsQuality === 'medium';

    return {
      appBg: 'bg-slate-950',
      shellPanel: isHigh
        ? 'bg-[linear-gradient(180deg,rgba(255,255,255,0.16),rgba(255,255,255,0.06))] border-white/16 shadow-[inset_0_1px_0_rgba(255,255,255,0.16)]'
        : isMedium
          ? 'bg-[linear-gradient(180deg,rgba(255,255,255,0.10),rgba(255,255,255,0.03))] border-white/12 shadow-[inset_0_1px_0_rgba(255,255,255,0.10)]'
          : 'bg-slate-950/94 border-white/10',
      panel: isHigh
        ? 'bg-[linear-gradient(180deg,rgba(255,255,255,0.14),rgba(255,255,255,0.05))]'
        : isMedium
          ? 'bg-[linear-gradient(180deg,rgba(255,255,255,0.09),rgba(255,255,255,0.03))]'
          : 'bg-slate-950/92',
      panelMuted: isHigh
        ? 'bg-[linear-gradient(180deg,rgba(255,255,255,0.11),rgba(255,255,255,0.04))]'
        : isMedium
          ? 'bg-[linear-gradient(180deg,rgba(255,255,255,0.07),rgba(255,255,255,0.02))]'
          : 'bg-slate-950/88',
      border: isHigh ? 'border-white/18' : 'border-white/12',
      borderStrong: isHigh ? 'border-white/18' : 'border-white/12',
      divider: 'divide-white/10',
      textPrimary: 'text-white',
      textSecondary: 'text-gray-300',
      textSubtle: 'text-gray-300',
      textMuted: isHigh ? 'text-white/60' : 'text-white/68',
      iconBg: isHigh
        ? 'bg-[linear-gradient(180deg,rgba(255,255,255,0.14),rgba(255,255,255,0.05))]'
        : 'bg-white/8',
      subtleBg: isHigh
        ? 'bg-[linear-gradient(180deg,rgba(255,255,255,0.10),rgba(255,255,255,0.03))]'
        : 'bg-white/6',
      hoverBg: isHigh ? 'hover:bg-white/14' : 'hover:bg-white/8',
      inputBg: isHigh
        ? 'bg-[linear-gradient(180deg,rgba(255,255,255,0.10),rgba(255,255,255,0.03))]'
        : 'bg-white/6',
      placeholder: 'placeholder-white/45',
      cardShadow: isHigh
        ? 'shadow-[0_24px_56px_-32px_rgba(3,10,24,0.82),inset_0_1px_0_rgba(255,255,255,0.16)]'
        : isMedium
          ? 'shadow-[0_18px_40px_-30px_rgba(3,10,24,0.72),inset_0_1px_0_rgba(255,255,255,0.10)]'
          : '',
      lightOverlay: isHigh
        ? 'bg-[linear-gradient(180deg,rgba(255,255,255,0.18),rgba(255,255,255,0.06)_14%,rgba(255,255,255,0.015)_42%,transparent_70%)]'
        : isMedium
          ? 'bg-[linear-gradient(180deg,rgba(255,255,255,0.12),rgba(255,255,255,0.03)_18%,transparent_64%)]'
          : 'bg-[linear-gradient(180deg,rgba(255,255,255,0.05),transparent_52%)]',
      dialogBackdrop: isHigh ? 'bg-black/42' : isMedium ? 'bg-slate-950/68' : 'bg-slate-950/78',
      ringOffset: 'ring-offset-slate-950',
    };
  }

  return {
    appBg: 'bg-[#0a0a0a]',
    shellPanel: 'bg-[#0a0a0a] border-zinc-800',
    panel: 'bg-zinc-900',
    panelMuted: 'bg-zinc-900',
    border: 'border-zinc-800',
    borderStrong: 'border-zinc-800',
    divider: 'divide-zinc-800',
    textPrimary: 'text-white',
    textSecondary: 'text-gray-300',
    textSubtle: 'text-gray-300',
    textMuted: 'text-gray-500',
    iconBg: 'bg-zinc-800',
    subtleBg: 'bg-zinc-900',
    hoverBg: 'hover:bg-zinc-800',
    inputBg: 'bg-zinc-900',
    placeholder: 'placeholder-gray-500',
    cardShadow: '',
    lightOverlay: null,
    dialogBackdrop: 'bg-black/50',
    ringOffset: 'ring-offset-gray-900',
  };
}
