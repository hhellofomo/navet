import type { CardSize } from '@/app/components/shared/card-size-selector';

export interface HVACCardProps {
  id: string;
  name: string;
  room: string;
  initialTemp?: number;
  initialCurrentTemp?: number;
  initialMode?: string;
  initialAction?: string;
  supportedHvacModes?: string[];
  initialState?: boolean;
  size: CardSize;
  onSizeChange: (id: string, size: CardSize) => void;
  isEditMode: boolean;
}
