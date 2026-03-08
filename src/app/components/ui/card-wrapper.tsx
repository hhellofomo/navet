import {
  type HTMLAttributes,
  memo,
  type KeyboardEvent as ReactKeyboardEvent,
  type MouseEvent as ReactMouseEvent,
  type ReactNode,
} from 'react';
import { useTheme } from '../../contexts/theme-context';

interface CardWrapperProps {
  children: ReactNode;
  onClick?: (event: ReactMouseEvent<HTMLDivElement> | ReactKeyboardEvent<HTMLDivElement>) => void;
  className?: string;
  isDisabled?: boolean;
  lightOverlayClassName?: string;
  showShadow?: boolean;
  interactionProps?: HTMLAttributes<HTMLDivElement> & {
    'aria-label'?: string;
    'aria-pressed'?: boolean;
    'aria-disabled'?: boolean;
    tabIndex?: number;
    role?: string;
  };
}

/**
 * Reusable card wrapper component
 * Provides consistent card styling and behavior
 */
export const CardWrapper = memo(function CardWrapper({
  children,
  onClick,
  className = '',
  isDisabled = false,
  lightOverlayClassName,
  showShadow = true,
  interactionProps,
}: CardWrapperProps) {
  const { theme } = useTheme();
  const { className: interactionClassName, ...restInteractionProps } = interactionProps || {};

  return (
    // biome-ignore lint/a11y/noStaticElementInteractions: This wrapper intentionally uses a div with button semantics because nested controls make a native button invalid.
    <div
      role={interactionProps?.role || 'button'}
      aria-disabled={interactionProps?.['aria-disabled'] ?? (!onClick || isDisabled)}
      tabIndex={interactionProps?.tabIndex ?? (onClick && !isDisabled ? 0 : -1)}
      onClick={!isDisabled ? onClick : undefined}
      onKeyDown={(e) => {
        interactionProps?.onKeyDown?.(e);
        if (e.defaultPrevented) {
          return;
        }
        if (onClick && !isDisabled && (e.key === 'Enter' || e.key === ' ')) {
          e.preventDefault();
          onClick(e);
        }
      }}
      className={`relative h-full backdrop-blur-xl rounded-3xl border overflow-hidden transition-all duration-500 ${onClick && !isDisabled ? 'cursor-pointer' : ''} ${theme === 'light' && showShadow ? 'shadow-lg' : ''} ${interactionClassName || ''} ${className}`}
      {...restInteractionProps}
    >
      {children}
      {/* Light theme frosted overlay - rendered after children's glow layers for correct z-stacking */}
      {theme === 'light' && (
        <div
          className={`absolute inset-0 z-[1] pointer-events-none ${lightOverlayClassName || 'bg-white/60'}`}
        />
      )}
    </div>
  );
});
