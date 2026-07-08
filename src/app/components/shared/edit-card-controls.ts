import type { CardSize } from './card-size';

export type EditControlVariant = 'neutral' | 'destructive';
export type EditControlPlacement = 'top-left' | 'top-right';

export function getEditControlLayout(size: CardSize) {
  if (size === 'extra-small') {
    return {
      isCompact: true,
      topLeftPosition: 'top-3 left-3.5',
      topRightPosition: 'top-3 right-3.5',
      buttonSize: 'h-7 w-7',
      iconSize: 'w-3.5 h-3.5',
    };
  }

  const isCompact = size !== 'large';

  return {
    isCompact,
    topLeftPosition: isCompact ? 'top-4 left-4' : 'top-5 left-5',
    topRightPosition: isCompact ? 'top-4 right-4' : 'top-5 right-5',
    buttonSize: isCompact ? 'h-8 w-8' : 'h-10 w-10',
    iconSize: isCompact ? 'w-4 h-4' : 'w-5 h-5',
  };
}

export function getEditControlButtonClass(variant: EditControlVariant = 'neutral') {
  const baseClass =
    'rounded-full backdrop-blur-md border border-white/10 flex items-center justify-center shadow-lg transition-all duration-200';

  if (variant === 'destructive') {
    return `${baseClass} bg-red-500 hover:bg-red-600 text-white`;
  }

  return `${baseClass} bg-black/50 hover:bg-black/65 text-white`;
}
