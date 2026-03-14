import { lazy, Suspense } from 'react';
import { RSSFeedCard } from '@/app/features/rss';
import type { CustomCard } from '../stores/custom-cards-store';

const NoteWidget = lazy(async () => {
  const module = await import('./widgets/note-widget');
  return { default: module.NoteWidget };
});

const PhotoFrameWidget = lazy(async () => {
  const module = await import('./widgets/photo-frame-widget');
  return { default: module.PhotoFrameWidget };
});

interface WidgetCardProps {
  card: CustomCard;
  isEditMode: boolean;
  onDelete?: (cardId: string) => void;
  onUpdate?: (cardId: string, data: Record<string, unknown>) => void;
}

function WidgetFallback() {
  return <div className="h-full rounded-2xl border border-white/10 bg-white/5 animate-pulse" />;
}

export function WidgetCard({ card, isEditMode, onDelete: _onDelete, onUpdate }: WidgetCardProps) {
  const handleNoteChange = (note: string) => {
    if (onUpdate) {
      onUpdate(card.id, { note });
    }
  };

  let widgetContent: React.ReactNode;
  switch (card.type) {
    case 'rss':
      widgetContent = <RSSFeedCard cardId={card.id} inEditMode={isEditMode} size={card.size} />;
      break;
    case 'photo':
      widgetContent = <PhotoFrameWidget size={card.size} />;
      break;
    case 'note':
      widgetContent = (
        <NoteWidget initialNote={card.data?.note as string} onNoteChange={handleNoteChange} />
      );
      break;
    default:
      widgetContent = null;
  }

  return (
    <div className="relative h-full">
      <Suspense fallback={<WidgetFallback />}>{widgetContent}</Suspense>
    </div>
  );
}
