import type { LucideIcon } from 'lucide-react';
import type { ButtonHTMLAttributes } from 'react';
import type { CardSize } from '@/app/components/shared/card-size-selector';

export type CoverState = 'open' | 'closed' | 'opening' | 'closing';

export type DeviceClass =
  | 'blind'
  | 'shade'
  | 'curtain'
  | 'garage'
  | 'gate'
  | 'awning'
  | 'shutter'
  | 'door';

export interface CoverCardProps {
  id: string;
  name: string;
  room: string;
  initialPosition?: number;
  initialDeviceClass?: DeviceClass;
  size: CardSize;
  onSizeChange: (id: string, size: CardSize) => void;
  isEditMode: boolean;
}

export interface DeviceClassConfig {
  label: string;
  icon: LucideIcon;
}

export type CoverIconButtonProps = Pick<
  ButtonHTMLAttributes<HTMLButtonElement>,
  'aria-label' | 'onClick' | 'onPointerDown'
>;
