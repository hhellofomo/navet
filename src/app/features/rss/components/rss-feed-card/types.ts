import type { CardSize } from '@/app/components/shared/card-size-selector';

export interface RSSItem {
  id: string;
  title: string;
  source: string;
  timeAgo: string;
  url: string;
  excerpt?: string;
  imageUrl?: string;
}

export interface RSSFeedCardProps {
  inEditMode?: boolean;
  size?: CardSize;
  onSizeChange?: (size: CardSize) => void;
}
