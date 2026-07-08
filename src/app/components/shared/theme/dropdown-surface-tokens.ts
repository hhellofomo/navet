import type { ThemeType } from '@/app/hooks/use-theme';
import type { EffectsQuality } from '@/app/stores/settings-store';

const getCurrentEffectsQuality = (): EffectsQuality => {
  if (typeof document === 'undefined') {
    return 'high';
  }

  const value = document.documentElement.dataset.effectsQuality;
  return value === 'medium' || value === 'low' ? value : 'high';
};

export function getThemeDropdownSurfaceClasses(
  theme: ThemeType,
  effectsQuality: EffectsQuality = getCurrentEffectsQuality()
) {
  if (theme === 'light') {
    return 'rounded-2xl border border-gray-200/80 bg-white text-gray-900';
  }

  if (theme === 'contrast') {
    return 'rounded-2xl border border-white/16 bg-black text-white';
  }

  if (theme === 'glass') {
    return effectsQuality === 'high'
      ? 'rounded-2xl border border-white/14 bg-slate-900/80 text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.12)]'
      : effectsQuality === 'medium'
        ? 'rounded-2xl border border-white/12 bg-slate-900/88 text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.08)]'
        : 'rounded-2xl border border-white/10 bg-slate-950/94 text-white';
  }

  return 'rounded-2xl border border-white/10 bg-[#141518] text-white';
}
