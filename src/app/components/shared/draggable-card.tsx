import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import type { CSSProperties } from 'react';

interface DraggableCardProps {
	id: string;
	index: number;
	isEditMode: boolean;
	isSortable?: boolean;
	children: React.ReactNode;
	className?: string;
}

export function DraggableCard({
	id,
	_index,
	isEditMode,
	isSortable = isEditMode,
	children,
	className = '',
}: DraggableCardProps) {
	const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
		id,
		disabled: !isSortable,
	});

	// Only apply drag transform when actually moving (non-zero transform values)
	// This prevents inline styles from overriding the CSS wiggle animation
	const hasTransform = transform && (transform.x !== 0 || transform.y !== 0);

	const style: CSSProperties = hasTransform
		? {
				transform: CSS.Transform.toString(transform),
				transition,
			}
		: {};

	return (
		<div
			ref={setNodeRef}
			style={style}
			{...(isSortable ? attributes : {})}
			{...(isSortable ? listeners : {})}
			className={`h-full relative transition-opacity duration-200 ${className} ${
				isDragging ? 'opacity-40 z-50' : 'opacity-100'
			} ${isEditMode && !isDragging ? 'cursor-move animate-wiggle' : ''} ${isEditMode ? 'active:cursor-grabbing' : ''}`}
		>
			{children}
		</div>
	);
}
