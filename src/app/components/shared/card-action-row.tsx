import { type LucideIcon, MoreHorizontal } from 'lucide-react';
import type { ReactNode } from 'react';
import { getThemeSurfaceTokens } from '@/app/components/shared/theme/theme-surface-tokens';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/app/components/ui/dropdown-menu';
import type { ThemeType } from '@/app/hooks/use-theme';

type CardActionRowSize = 'small' | 'medium' | 'large';

interface CardActionOverflowItem {
  key: string;
  label: string;
  onSelect: () => void;
  icon?: LucideIcon;
  disabled?: boolean;
}

interface CardActionRowProps {
  theme: ThemeType;
  size?: CardActionRowSize;
  leftContent?: ReactNode;
  rightContent?: ReactNode;
  overflowItems?: CardActionOverflowItem[];
}

function getActionButtonClasses(theme: ThemeType) {
  const surface = getThemeSurfaceTokens(theme);
  return theme === 'light'
    ? 'bg-gray-900/10 text-gray-900 hover:bg-gray-900/20'
    : `${surface.subtleBg} text-white ${surface.hoverBg}`;
}

function getActionButtonSize(size: CardActionRowSize) {
  if (size === 'small') {
    return {
      button: 'h-7 w-7',
      icon: 'h-3 w-3',
    };
  }

  if (size === 'medium') {
    return {
      button: 'h-8 w-8',
      icon: 'h-3.5 w-3.5',
    };
  }

  return {
    button: 'h-10 w-10',
    icon: 'h-5 w-5',
  };
}

export function CardActionRow({
  theme,
  size = 'medium',
  leftContent,
  rightContent,
  overflowItems = [],
}: CardActionRowProps) {
  return (
    <div className="flex items-center gap-2">
      <div className="flex min-w-0 flex-1 items-center gap-2">
        {leftContent}
        {overflowItems.length > 0 && (
          <CardActionOverflowMenu theme={theme} size={size} items={overflowItems} />
        )}
      </div>
      {rightContent}
    </div>
  );
}

function CardActionOverflowMenu({
  theme,
  size,
  items,
}: {
  theme: ThemeType;
  size: CardActionRowSize;
  items: CardActionOverflowItem[];
}) {
  const buttonClasses = getActionButtonClasses(theme);
  const actionSize = getActionButtonSize(size);
  const surface = getThemeSurfaceTokens(theme);
  const menuSurface =
    theme === 'light'
      ? 'border-gray-200/80 bg-white/95 text-gray-900'
      : `${surface.border} ${surface.panel} text-white`;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button
          type="button"
          aria-label="More actions"
          className={`${actionSize.button} shrink-0 rounded-full ${buttonClasses} flex items-center justify-center transition-all duration-300 hover:scale-105 active:scale-95`}
          onClick={(event) => event.stopPropagation()}
        >
          <MoreHorizontal className={actionSize.icon} />
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align="end"
        sideOffset={10}
        className={`rounded-2xl border p-2 shadow-2xl backdrop-blur-xl ${menuSurface}`}
        onClick={(event) => event.stopPropagation()}
      >
        {items.map((item) => {
          const Icon = item.icon;

          return (
            <DropdownMenuItem
              key={item.key}
              disabled={item.disabled}
              onClick={(event) => {
                event.stopPropagation();
                item.onSelect();
              }}
              className="rounded-xl px-3 py-2"
            >
              {Icon ? <Icon className="h-4 w-4" /> : null}
              <span>{item.label}</span>
            </DropdownMenuItem>
          );
        })}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
