import type { ThemeType } from '@/app/hooks/use-theme';

export function getStickyBarSurfaceClass(theme: ThemeType, isActive: boolean): string {
  if (!isActive) {
    return '';
  }

  if (theme === 'light') {
    return 'mx-[-8px] rounded-[22px] border border-gray-200/80 bg-gray-50/92 px-2 py-2 shadow-[0_16px_36px_-30px_rgba(15,23,42,0.22)] backdrop-blur-xl';
  }

  if (theme === 'glass') {
    return 'mx-[-8px] rounded-[22px] border border-white/10 bg-white/[0.055] px-2 py-2 shadow-[0_16px_40px_-28px_rgba(0,0,0,0.6),inset_0_1px_0_rgba(255,255,255,0.12)] backdrop-blur-2xl';
  }

  if (theme === 'contrast') {
    return 'mx-[-8px] rounded-[22px] border border-white/18 bg-black/94 px-2 py-2 shadow-[0_16px_36px_-28px_rgba(0,0,0,0.8)]';
  }

  return 'mx-[-8px] rounded-[22px] border border-white/8 bg-[#0a0a0a]/84 px-2 py-2 shadow-[0_16px_36px_-28px_rgba(0,0,0,0.72)] backdrop-blur-xl';
}
