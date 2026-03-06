import { memo, useState } from 'react';
import { Maximize2 } from 'lucide-react';
import * as Popover from '@radix-ui/react-popover';

export type CardSize = 'small' | 'medium' | 'large';

interface CardSizeSelectorProps {
  currentSize: CardSize;
  onSizeChange: (size: CardSize) => void;
  allowedSizes?: CardSize[];
}

// iOS Widget Sizes based on Apple's Human Interface Guidelines
const sizes: { value: CardSize; label: string; description: string; dimensions: string; preview: string }[] = [
  { 
    value: 'small', 
    label: 'Small', 
    description: '170×170 pt',
    dimensions: '1×1 grid',
    preview: 'w-7 h-7'
  },
  { 
    value: 'medium', 
    label: 'Medium', 
    description: '364×170 pt',
    dimensions: '2×1 grid',
    preview: 'w-14 h-7'
  },
  { 
    value: 'large', 
    label: 'Large', 
    description: '364×382 pt',
    dimensions: '2×2 grid',
    preview: 'w-14 h-14'
  },
];

export const CardSizeSelector = memo(function CardSizeSelector({ currentSize, onSizeChange, allowedSizes }: CardSizeSelectorProps) {
  const [open, setOpen] = useState(false);

  const availableSizes = allowedSizes ? sizes.filter(size => allowedSizes.includes(size.value)) : sizes;

  return (
    <Popover.Root open={open} onOpenChange={setOpen}>
      <Popover.Trigger asChild>
        <button 
          className="absolute top-3 right-3 z-50 p-2 rounded-xl bg-black/50 backdrop-blur-md border border-white/10 hover:bg-black/70 transition-all duration-200 group cursor-pointer"
          onClick={(e) => e.stopPropagation()}
        >
          <Maximize2 className="w-4 h-4 text-white group-hover:scale-110 transition-transform" />
        </button>
      </Popover.Trigger>
      <Popover.Portal>
        <Popover.Content 
          className="bg-[#1c1c1e]/98 backdrop-blur-xl border border-white/10 rounded-2xl p-3 shadow-2xl z-50 min-w-[260px]"
          sideOffset={8}
        >
          <div className="space-y-1.5">
            <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2 px-1">Widget Size</h3>
            {availableSizes.map((size) => (
              <button
                key={size.value}
                onClick={(e) => {
                  e.stopPropagation();
                  onSizeChange(size.value);
                  setOpen(false); // Close popover after selection
                }}
                className={`w-full flex items-center gap-3 p-3 rounded-xl transition-all duration-200 ${ 
                  currentSize === size.value
                    ? 'bg-orange-500/20 border border-orange-500/40' 
                    : 'bg-white/[0.03] border border-white/[0.06] hover:bg-white/[0.06]'
                }`}
              >
                <div className="flex items-center justify-center w-16 h-16 bg-black/30 rounded-lg border border-white/5">
                  <div className={`bg-gradient-to-br from-orange-400 to-orange-600 rounded-md shadow-lg ${size.preview}`}></div>
                </div>
                <div className="flex-1 text-left">
                  <div className={`text-sm font-semibold mb-0.5 ${currentSize === size.value ? 'text-white' : 'text-gray-200'}`}>
                    {size.label}
                  </div>
                  <div className="text-xs text-gray-500">{size.dimensions}</div>
                  <div className="text-[10px] text-gray-600">{size.description}</div>
                </div>
                {currentSize === size.value && (
                  <div className="w-1.5 h-1.5 bg-orange-500 rounded-full animate-pulse"></div>
                )}
              </button>
            ))}
          </div>
          <Popover.Arrow className="fill-[#1c1c1e]" />
        </Popover.Content>
      </Popover.Portal>
    </Popover.Root>
  );
});

// Helper function to get grid span classes based on iOS widget size
export function getCardSpanClass(size: CardSize): string {
  switch (size) {
    case 'small':
      return 'col-span-1 row-span-1'; // 170×170 pt
    case 'medium':
      return 'col-span-2 row-span-1'; // 364×170 pt (2.14× width) - always 2 columns wide
    case 'large':
      return 'col-span-2 row-span-2'; // 364×382 pt (2.25× height) - always 2 columns wide
    default:
      return 'col-span-1 row-span-1';
  }
}