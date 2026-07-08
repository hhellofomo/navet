import type { CardSize } from './card-size-selector';

export type EditControlVariant = 'neutral' | 'destructive';

export function getEditControlLayout(size: CardSize) {
  const isCompact = size === 'extra-small' || size === 'small';

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
