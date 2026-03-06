import { memo, type ReactNode } from 'react';
import { useTheme } from '../../contexts/theme-context';

interface CardWrapperProps {
	children: ReactNode;
	onClick?: () => void;
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
		<div
			onClick={!isDisabled ? onClick : undefined}
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
