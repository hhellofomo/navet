import type { CardSize } from '@/app/components/shared/card-size-selector';

export interface CameraCardProps {
  id: string;
  name: string;
  room: string;
  entityPicture?: string;
  size: CardSize;
  onSizeChange: (id: string, size: CardSize) => void;
  isEditMode: boolean;
}
