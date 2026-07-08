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

const BatteryOverviewWidget = lazy(async () => {
  const module = await import('./widgets/battery-overview-widget');
  return { default: module.BatteryOverviewWidget };
});

const ButtonWidget = lazy(async () => {
  const module = await import('./widgets/button-widget');
  return { default: module.ButtonWidget };
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
      widgetContent = (
        <PhotoFrameWidget
          size={card.size}
          cardId={card.id}
          photoUrls={card.data?.photoUrls as string[] | undefined}
          onUpdateUrls={
            onUpdate ? (urls) => onUpdate(card.id, { ...card.data, photoUrls: urls }) : undefined
          }
          isEditMode={isEditMode}
        />
      );
      break;
    case 'note':
      widgetContent = (
        <NoteWidget initialNote={card.data?.note as string} onNoteChange={handleNoteChange} />
      );
      break;
    case 'battery':
      widgetContent = <BatteryOverviewWidget size={card.size} />;
      break;
    case 'button':
      widgetContent = (
        <ButtonWidget
          size={card.size}
          data={card.data as { label?: string; service?: string; entityId?: string } | undefined}
          onUpdate={onUpdate ? (data) => onUpdate(card.id, { ...card.data, ...data }) : undefined}
          isEditMode={isEditMode}
        />
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
