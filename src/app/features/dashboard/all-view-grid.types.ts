import type { CardSize } from '@/app/components/shared/card-size-selector';
import type { DeviceWithType } from '@/app/types/device.types';
import type { CustomCard } from './stores/custom-cards-store';

export interface AllViewGridProps {
  deviceMap: Map<string, DeviceWithType>;
  rooms: string[];
  cardOrders: Record<string, string[]>;
  isEditMode: boolean;
  cardSizes: Record<string, CardSize>;
  updateCardSize: (id: string, size: CardSize) => void;
  customCards?: CustomCard[];
  onDeleteCard?: (cardId: string) => void;
  onUpdateCard?: (cardId: string, data: Record<string, unknown>) => void;
  onRemoveEntity?: (entityId: string) => void;
  allowEntityRemoval?: boolean;
  usesHideAction?: boolean;
}

export interface RoomSectionData {
  room: string;
  orderedRoomIds: string[];
  totalItems: number;
}
