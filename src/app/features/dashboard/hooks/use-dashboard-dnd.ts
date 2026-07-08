import {
  type DragEndEvent,
  type DragOverEvent,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import { useCallback } from 'react';

interface UseDashboardDndParams {
  cardOrders: Record<string, string[]>;
  getCardRoom: (cardId: string) => string | null;
  moveCard: (room: string, oldIndex: number, newIndex: number) => void;
}

export function useDashboardDnd({ cardOrders, getCardRoom, moveCard }: UseDashboardDndParams) {
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    })
  );

  const handleDragOver = useCallback(
    (event: DragOverEvent) => {
      const { active, over } = event;

      if (!over || active.id === over.id) {
        return;
      }

      const activeId = active.id as string;
      const overId = over.id as string;
      const room = getCardRoom(activeId);
      if (!room || room !== getCardRoom(overId)) {
        return;
      }

      const roomCardIds = cardOrders[room] || [];
      const oldIndex = roomCardIds.indexOf(activeId);
      const newIndex = roomCardIds.indexOf(overId);

      if (oldIndex !== -1 && newIndex !== -1) {
        moveCard(room, oldIndex, newIndex);
      }
    },
    [cardOrders, getCardRoom, moveCard]
  );

  const handleDragEnd = useCallback((_event: DragEndEvent) => {}, []);

  return {
    handleDragEnd,
    handleDragOver,
    sensors,
  };
}
