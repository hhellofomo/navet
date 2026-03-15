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
      defaultButton: 'bg-gray-100 text-gray-900 hover:bg-gray-200',
      defaultIcon: 'text-gray-900',
      disabledButton: 'bg-gray-100 text-gray-500 opacity-50 cursor-not-allowed',
      selectedText: 'text-white',
      emphasisButton:
        'border border-gray-200 bg-white text-slate-900 shadow-[0_18px_40px_-24px_rgba(15,23,42,0.5)]',
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
      defaultButton: 'bg-black text-white hover:bg-zinc-900 border border-zinc-700',
      defaultIcon: 'text-white',
      disabledButton: 'bg-black text-white/60 opacity-50 cursor-not-allowed border border-zinc-700',
      selectedText: 'text-white',
      emphasisButton: 'border border-zinc-700 bg-black text-white',
      emphasisIcon: 'text-white',
    };
  }

  return {
    defaultButton: 'bg-zinc-800 text-white hover:bg-zinc-700',
    defaultIcon: 'text-white',
    disabledButton: 'bg-zinc-800 text-white/60 opacity-50 cursor-not-allowed',
    selectedText: 'text-white',
    emphasisButton: 'border border-zinc-700 bg-zinc-900 text-white',
    emphasisIcon: 'text-white',
  };
}
