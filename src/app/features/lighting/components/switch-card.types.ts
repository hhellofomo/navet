import type { CardSize } from '@/app/components/shared/card-size-selector';
import type { DeviceMetric } from '@/app/types/device.types';

export interface SwitchCardProps {
  id: string;
  name: string;
  size: CardSize;
  room: string;
  initialState?: boolean;
  entityType?: string;
  serviceDomain?: string;
  serviceAction?: string;
  power?: number;
  voltage?: number;
  energy?: number;
  metrics?: DeviceMetric[];
  isEditMode?: boolean;
}
