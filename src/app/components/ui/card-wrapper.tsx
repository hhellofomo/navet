import { memo, type ReactNode } from 'react';
import { useTheme } from '../../contexts/theme-context';

interface CardWrapperProps {
	children: ReactNode;
	onClick?: (event: React.MouseEvent<HTMLDivElement> | React.KeyboardEvent<HTMLDivElement>) => void;
	className?: string;
	isDisabled?: boolean;
	lightOverlayClassName?: string;
	showShadow?: boolean;
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
}: CardWrapperProps) {
	const { theme } = useTheme();

	return (
		// biome-ignore lint/a11y/useSemanticElements: This wrapper may contain nested interactive controls, so a semantic button element is not valid here.
		<div
			role="button"
			aria-disabled={!onClick || isDisabled}
			tabIndex={onClick && !isDisabled ? 0 : -1}
			onClick={!isDisabled ? onClick : undefined}
			onKeyDown={(e) => {
				if (onClick && !isDisabled && (e.key === 'Enter' || e.key === ' ')) {
					e.preventDefault();
					onClick(e);
				}
			}}
			className={`relative h-full backdrop-blur-xl rounded-3xl border overflow-hidden transition-all duration-500 ${onClick && !isDisabled ? 'cursor-pointer' : ''} ${theme === 'light' && showShadow ? 'shadow-lg' : ''} ${className}`}
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
