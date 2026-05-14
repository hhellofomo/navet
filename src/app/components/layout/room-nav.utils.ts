import { ALL_ROOMS_ID } from '@/app/constants/rooms';

export function getVisibleRoomNavRooms(rooms: string[]): string[] {
  return [ALL_ROOMS_ID, ...rooms];
}
