import { X } from 'lucide-react';
import { useEditModeContext } from '@/app/contexts/edit-mode-context';
import type { CustomCard } from '@/app/stores';
import { CalendarWidget, NewsWidget, NoteWidget, PhotoFrameWidget, WeatherWidget } from './widgets';

interface WidgetCardProps {
  card: CustomCard;
  onDelete?: (cardId: string) => void;
  onUpdate?: (cardId: string, data: Record<string, unknown>) => void;
}

export function WidgetCard({ card, onDelete, onUpdate }: WidgetCardProps) {
  const { isEditMode } = useEditModeContext();

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onDelete && confirm('Delete this widget?')) {
      onDelete(card.id);
    }
  };

  const handleNoteChange = (note: string) => {
    if (onUpdate) {
      onUpdate(card.id, { note });
    }
  };

  let widgetContent: React.ReactNode;
  switch (card.type) {
    case 'calendar':
      widgetContent = <CalendarWidget size={card.size} />;
      break;
    case 'news':
      widgetContent = <NewsWidget size={card.size} />;
      break;
    case 'weather':
      widgetContent = <WeatherWidget size={card.size} />;
      break;
    case 'photo':
      widgetContent = <PhotoFrameWidget size={card.size} />;
      break;
    case 'note':
      widgetContent = (
        <NoteWidget
          size={card.size}
          initialNote={card.data?.note as string}
          onNoteChange={handleNoteChange}
        />
      );
      break;
    default:
      widgetContent = null;
  }

  return (
    <div className="relative h-full">
      {widgetContent}

      {/* Delete button in edit mode */}
      {isEditMode && onDelete && (
        <button
          type="button"
          onClick={handleDelete}
          className="absolute top-2 right-2 w-6 h-6 rounded-full bg-red-500 hover:bg-red-600 flex items-center justify-center transition-all shadow-lg z-10"
          aria-label="Delete widget"
        >
          <X className="w-4 h-4 text-white" />
        </button>
      )}
    </div>
  );
}
