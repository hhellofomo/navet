import * as ScrollArea from '@radix-ui/react-scroll-area';
import { memo, type ReactNode } from 'react';

interface CustomScrollbarProps {
  children: ReactNode;
  isOn?: boolean;
  className?: string;
}

export const CustomScrollbar = memo(function CustomScrollbar({
  children,
  isOn = false,
  className = '',
}: CustomScrollbarProps) {
  return (
    <ScrollArea.Root className={`h-full overflow-hidden ${className}`}>
      <ScrollArea.Viewport className="w-full h-full">{children}</ScrollArea.Viewport>
      <ScrollArea.Scrollbar className="hidden" orientation="vertical">
        <ScrollArea.Thumb
          className={`flex-1 rounded-full relative transition-colors duration-500 ${
            isOn ? 'bg-orange-500/40 hover:bg-orange-500/60' : 'bg-gray-500/40 hover:bg-gray-500/60'
          }`}
        />
      </ScrollArea.Scrollbar>
    </ScrollArea.Root>
  );
});
