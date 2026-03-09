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
import { GripVertical } from 'lucide-react';
import { memo } from 'react';
import { Checkbox } from '@/app/components/ui/checkbox';
import { Label } from '@/app/components/ui/label';
import type { BrightnessPresetKey } from '@/app/features/lighting';

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
  onlyApplyToThisLight?: boolean;
  onOnlyApplyToThisLightChange?: (checked: boolean) => void;
}

export const BrightnessPresetEditor = memo(function BrightnessPresetEditor({
  presets,
  isOn,
  onPresetValueChange,
  onPresetOrderChange,
  onlyApplyToThisLight = false,
  onOnlyApplyToThisLightChange,
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
      <div className="mb-4">
        <span
          className={`text-sm font-medium transition-colors duration-500 ${isOn ? 'text-gray-300' : 'text-gray-500'}`}
        >
          Edit Brightness Presets
        </span>
      </div>

      {onOnlyApplyToThisLightChange ? (
        <div
          className={`mb-4 flex items-start gap-3 rounded-2xl border px-4 py-3 ${
            isOn ? 'border-white/10 bg-white/5' : 'border-white/10 bg-white/5'
          }`}
        >
          <Checkbox
            id="brightness-preset-scope"
            checked={onlyApplyToThisLight}
            onCheckedChange={(checked) => onOnlyApplyToThisLightChange(checked === true)}
            aria-label="Only apply brightness preset changes to this light"
            className="mt-0.5"
          />
          <div className="min-w-0 flex-1">
            <Label
              htmlFor="brightness-preset-scope"
              className={`text-sm ${isOn ? 'text-gray-100' : 'text-gray-300'}`}
            >
              Only apply to this light
            </Label>
            <p className={`mt-1 text-xs ${isOn ? 'text-gray-300' : 'text-gray-500'}`}>
              Leave this off to update brightness preset values and ordering for all lights.
            </p>
          </div>
        </div>
      ) : null}

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
          <div className={`text-sm font-medium ${isOn ? 'text-white' : 'text-gray-300'}`}>
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
            : 'border-white/10 bg-white/5 text-gray-300'
        }`}
      />
      <span className={`text-xs ${isOn ? 'text-gray-300' : 'text-gray-500'}`}>%</span>
    </div>
  );
});
