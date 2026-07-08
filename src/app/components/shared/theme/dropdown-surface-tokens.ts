import type { ThemeType } from '@/app/hooks/use-theme';

export function getThemeDropdownSurfaceClasses(theme: ThemeType) {
  if (theme === 'light') {
    return 'rounded-2xl border border-gray-200/80 bg-white/94 text-gray-900 shadow-[0_24px_60px_-28px_rgba(15,23,42,0.28)] backdrop-blur-xl';
  }

  if (theme === 'contrast') {
    return 'rounded-2xl border border-white/16 bg-black text-white shadow-[0_24px_60px_-28px_rgba(0,0,0,0.82)] backdrop-blur-xl';
  }

  if (theme === 'glass') {
    return 'rounded-2xl border border-white/14 bg-white/10 text-white shadow-[0_24px_60px_-28px_rgba(0,0,0,0.58),inset_0_1px_0_rgba(255,255,255,0.12)] backdrop-blur-2xl';
  }

  return 'rounded-2xl border border-white/10 bg-[#141518]/94 text-white shadow-[0_24px_60px_-28px_rgba(0,0,0,0.72)] backdrop-blur-xl';
}
