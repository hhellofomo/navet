import type { ThemeType } from '@/app/hooks/use-theme';

interface RoundControlStyles {
  defaultButton: string;
  defaultIcon: string;
  disabledButton: string;
  selectedText: string;
  emphasisButton: string;
  emphasisIcon: string;
}

export function getRoundControlStyles(theme: ThemeType): RoundControlStyles {
  if (theme === 'light') {
    return {
      defaultButton: 'bg-gray-900/10 text-gray-900 hover:bg-gray-900/18',
      defaultIcon: 'text-gray-900',
      disabledButton: 'bg-gray-900/10 text-gray-500 opacity-50 cursor-not-allowed',
      selectedText: 'text-white',
      emphasisButton:
        'border border-white/55 bg-white/82 text-slate-900 shadow-[0_18px_40px_-24px_rgba(15,23,42,0.5)] backdrop-blur-lg supports-[backdrop-filter]:bg-white/72',
      emphasisIcon: 'text-slate-900',
    };
  }

  if (theme === 'glass') {
    return {
      defaultButton: 'bg-white/15 text-white hover:bg-white/25',
      defaultIcon: 'text-white',
      disabledButton: 'bg-white/15 text-white/60 opacity-50 cursor-not-allowed',
      selectedText: 'text-white',
      emphasisButton:
        'border border-white/16 bg-[linear-gradient(180deg,rgba(255,255,255,0.18),rgba(255,255,255,0.07))] text-white shadow-[0_22px_48px_-24px_rgba(15,23,42,0.72),inset_0_1px_0_rgba(255,255,255,0.2),inset_0_-10px_18px_rgba(255,255,255,0.03)] backdrop-blur-2xl supports-[backdrop-filter]:bg-[linear-gradient(180deg,rgba(255,255,255,0.14),rgba(255,255,255,0.05))]',
      emphasisIcon: 'text-white',
    };
  }

  if (theme === 'contrast') {
    return {
      defaultButton: 'bg-black text-white hover:bg-white/8 border border-white/22',
      defaultIcon: 'text-white',
      disabledButton: 'bg-black text-white/60 opacity-50 cursor-not-allowed border border-white/22',
      selectedText: 'text-white',
      emphasisButton:
        'border border-white/34 bg-black text-white shadow-[0_0_0_1px_rgba(255,255,255,0.08)]',
      emphasisIcon: 'text-white',
    };
  }

  return {
    defaultButton: 'bg-white/15 text-white hover:bg-white/25',
    defaultIcon: 'text-white',
    disabledButton: 'bg-white/15 text-white/60 opacity-50 cursor-not-allowed',
    selectedText: 'text-white',
    emphasisButton:
      'border border-white/18 bg-white/14 text-white shadow-[0_18px_40px_-24px_rgba(0,0,0,0.55),inset_0_1px_0_rgba(255,255,255,0.14)] backdrop-blur-xl supports-[backdrop-filter]:bg-white/10',
    emphasisIcon: 'text-white',
  };
}
