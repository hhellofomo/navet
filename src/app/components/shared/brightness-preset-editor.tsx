import {
	DndContext,
	type DragEndEvent,
	KeyboardSensor,
	PointerSensor,
	useSensor,
	useSensors,
} from '@dnd-kit/core';
import {
	arrayMove,
	rectSortingStrategy,
	SortableContext,
	sortableKeyboardCoordinates,
	useSortable,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import type { LucideIcon } from 'lucide-react';
import { ArrowRightLeft, GripVertical } from 'lucide-react';
import { memo } from 'react';
import { Button } from '@/app/components/ui/button';
import type { BrightnessPresetKey } from '@/app/stores/light-preset-store';

interface BrightnessPresetEditorItem {
	icon: LucideIcon;
	brightness: number;
	key: BrightnessPresetKey;
	label: string;
}

interface BrightnessPresetEditorProps {
	presets: BrightnessPresetEditorItem[];
	isOn: boolean;
	onPresetValueChange: (key: BrightnessPresetKey, value: number) => void;
	onPresetOrderChange: (keys: BrightnessPresetKey[]) => void;
	onScopeToggle?: () => void;
	scopeLabel?: string;
	scopeHint?: string;
}

export const BrightnessPresetEditor = memo(function BrightnessPresetEditor({
	presets,
	isOn,
	onPresetValueChange,
	onPresetOrderChange,
	onScopeToggle,
	scopeLabel,
	scopeHint,
}: BrightnessPresetEditorProps) {
	const sensors = useSensors(
		useSensor(PointerSensor, {
			activationConstraint: {
				distance: 6,
			},
		}),
		useSensor(KeyboardSensor, {
			coordinateGetter: sortableKeyboardCoordinates,
		})
	);

	const handleDragEnd = (event: DragEndEvent) => {
		const { active, over } = event;
		if (!over || active.id === over.id) {
			return;
		}

		const oldIndex = presets.findIndex((preset) => preset.key === active.id);
		const newIndex = presets.findIndex((preset) => preset.key === over.id);
		if (oldIndex === -1 || newIndex === -1) {
			return;
		}

		onPresetOrderChange(
			arrayMove(
				presets.map((preset) => preset.key),
				oldIndex,
				newIndex
			)
		);
	};

	return (
		<div>
			<div className="mb-4 flex items-center justify-between gap-3">
				<span
					className={`text-sm font-medium transition-colors duration-500 ${isOn ? 'text-gray-300' : 'text-gray-500'}`}
				>
					Edit Brightness Presets
				</span>
				{onScopeToggle && scopeLabel ? (
					<Button
						type="button"
						variant="ghost"
						size="sm"
						onClick={onScopeToggle}
						aria-label={scopeHint ? `${scopeLabel}. ${scopeHint}` : scopeLabel}
						title={scopeHint ? `${scopeLabel}. ${scopeHint}` : scopeLabel}
						className={`h-8 rounded-full border px-3 text-xs shadow-sm ${
							isOn
								? 'border-white/10 bg-white/5 text-gray-100 hover:bg-white/10 hover:text-white'
								: 'border-white/10 bg-white/5 text-gray-300 hover:bg-white/10 hover:text-white'
						}`}
					>
						<ArrowRightLeft className="h-3.5 w-3.5" aria-hidden="true" />
						{scopeLabel}
					</Button>
				) : null}
			</div>

			<DndContext sensors={sensors} onDragEnd={handleDragEnd}>
				<SortableContext items={presets.map((preset) => preset.key)} strategy={rectSortingStrategy}>
					<div className="space-y-3">
						{presets.map((preset) => (
							<BrightnessPresetEditorRow
								key={preset.key}
								preset={preset}
								isOn={isOn}
								onPresetValueChange={onPresetValueChange}
							/>
						))}
					</div>
				</SortableContext>
			</DndContext>
		</div>
	);
});

interface BrightnessPresetEditorRowProps {
	preset: BrightnessPresetEditorItem;
	isOn: boolean;
	onPresetValueChange: (key: BrightnessPresetKey, value: number) => void;
}

const BrightnessPresetEditorRow = memo(function BrightnessPresetEditorRow({
	preset,
	isOn,
	onPresetValueChange,
}: BrightnessPresetEditorRowProps) {
	const { attributes, listeners, setNodeRef, transform, transition } = useSortable({
		id: preset.key,
	});
	const IconComponent = preset.icon;

	return (
		<div
			ref={setNodeRef}
			style={{
				transform: CSS.Transform.toString(transform),
				transition,
			}}
			className="flex items-center gap-3"
		>
			<button
				type="button"
				aria-label={`Reorder ${preset.label} preset`}
				className={`flex h-9 w-5 touch-none items-center justify-center rounded-md transition-colors ${
					isOn
						? 'text-white/55 hover:text-white/85 cursor-grab active:cursor-grabbing'
						: 'text-gray-500 cursor-grab active:cursor-grabbing'
				}`}
				{...attributes}
				{...listeners}
			>
				<GripVertical className="h-4 w-4" aria-hidden="true" />
			</button>
			<div className="flex items-center gap-2 min-w-0 flex-1">
				<div className="w-9 h-9 rounded-full bg-white/10 flex items-center justify-center">
					<IconComponent className="w-4 h-4 text-white" aria-hidden="true" />
				</div>
				<div className="min-w-0">
					<div className={`text-sm font-medium ${isOn ? 'text-white' : 'text-gray-400'}`}>
						{preset.label}
					</div>
				</div>
			</div>
			<label className="sr-only" htmlFor={`brightness-preset-${preset.key}`}>
				{preset.label} brightness preset
			</label>
			<input
				id={`brightness-preset-${preset.key}`}
				type="number"
				min={1}
				max={100}
				step={1}
				value={preset.brightness}
				onChange={(e) => {
					const nextValue = Number.parseInt(e.target.value, 10);
					if (!Number.isNaN(nextValue)) {
						onPresetValueChange(preset.key, nextValue);
					}
				}}
				className={`w-20 rounded-xl border px-3 py-2 text-sm font-semibold transition-colors ${
					isOn
						? 'border-white/15 bg-white/10 text-white'
						: 'border-white/10 bg-white/5 text-gray-400'
				}`}
			/>
			<span className={`text-xs ${isOn ? 'text-gray-300' : 'text-gray-500'}`}>%</span>
		</div>
	);
});
