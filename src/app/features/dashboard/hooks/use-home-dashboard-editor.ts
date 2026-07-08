import {
  type DragEndEvent,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import { sortableKeyboardCoordinates } from '@dnd-kit/sortable';
import { useMemo, useState } from 'react';
import type { CardSize } from '@/app/components/shared/card-size-selector';
import { getDeviceTypeLabel } from '@/app/constants/device-type-labels';
import { useI18n } from '@/app/hooks';
import type { DeviceWithType } from '@/app/types/device.types';
import type { CustomCard } from '../stores/custom-cards-store';
import type {
  HomeDashboardLayoutState,
  HomeDashboardSectionSpan,
} from './use-home-dashboard-layout';

export type LibraryCard = {
  id: string;
  title: string;
  subtitle: string;
  meta: string;
  kind: 'device' | 'widget';
};

export type DragMeta =
  | { source: 'library'; cardId: string }
  | { source: 'home'; cardId: string; sectionId?: string };

export type DropMeta =
  | { type: 'card'; cardId: string; sectionId?: string }
  | { type: 'container'; sectionId?: string };

const widgetTypeLabels: Record<CustomCard['type'], string> = {
  rss: 'RSS widget',
  photo: 'Photo widget',
  note: 'Note widget',
  battery: 'Battery widget',
  button: 'Button widget',
};

const MAX_SECTIONS_PER_ROW = 4;

function partitionSectionRows<T extends { span: HomeDashboardSectionSpan }>(sections: T[]): T[][] {
  const rows: T[][] = [];
  let currentRow: T[] = [];
  let currentWidth = 0;

  for (const section of sections) {
    if (
      currentRow.length > 0 &&
      (currentWidth + section.span > 8 || currentRow.length >= MAX_SECTIONS_PER_ROW)
    ) {
      rows.push(currentRow);
      currentRow = [];
      currentWidth = 0;
    }

    currentRow.push(section);
    currentWidth += section.span;

    if (currentWidth >= 8) {
      rows.push(currentRow);
      currentRow = [];
      currentWidth = 0;
    }
  }

  if (currentRow.length > 0) rows.push(currentRow);

  return rows;
}

interface UseHomeDashboardEditorParams {
  deviceMap: Map<string, DeviceWithType>;
  allCustomCards: CustomCard[];
  homeLayout: HomeDashboardLayoutState;
  cardSizes: Record<string, CardSize>;
  hiddenEntityCount: number;
  addHomeCard: (cardId: string, sectionId?: string) => void;
  moveHomeCard: (activeId: string, overId: string | null, sectionId?: string) => void;
  addHomeSection: () => string;
}

export function useHomeDashboardEditor({
  deviceMap,
  allCustomCards,
  homeLayout,
  cardSizes,
  hiddenEntityCount,
  addHomeCard,
  moveHomeCard,
  addHomeSection,
}: UseHomeDashboardEditorParams) {
  const { t } = useI18n();
  const [activeDragCard, setActiveDragCard] = useState<string | null>(null);
  const [libraryQuery, setLibraryQuery] = useState('');

  const allCards = useMemo(() => {
    const cards = new Map<string, DeviceWithType | CustomCard>();
    for (const [id, device] of deviceMap) cards.set(id, device);
    for (const card of allCustomCards) cards.set(card.id, card);
    return cards;
  }, [allCustomCards, deviceMap]);

  const selectedIds = useMemo(
    () => homeLayout.cardIds.filter((id) => allCards.has(id)),
    [allCards, homeLayout.cardIds]
  );

  const selectedIdSet = useMemo(() => new Set(selectedIds), [selectedIds]);

  const libraryCards = useMemo<LibraryCard[]>(() => {
    const deviceCards: LibraryCard[] = [...deviceMap.values()].map((device) => ({
      id: device.id,
      title: typeof device.name === 'string' ? device.name : device.id,
      subtitle: typeof device.room === 'string' ? device.room : '',
      meta:
        ('entityType' in device && typeof device.entityType === 'string' && device.entityType) ||
        getDeviceTypeLabel(device.type, t),
      kind: 'device',
    }));
    const widgetCards: LibraryCard[] = allCustomCards.map((card) => ({
      id: card.id,
      title: card.data?.title && typeof card.data.title === 'string' ? card.data.title : card.type,
      subtitle: widgetTypeLabels[card.type],
      meta: card.id,
      kind: 'widget',
    }));
    return [...deviceCards, ...widgetCards].filter((card) => !selectedIdSet.has(card.id));
  }, [allCustomCards, deviceMap, selectedIdSet, t]);

  const sectionIds = useMemo(
    () => new Set(homeLayout.sections.map((s) => s.id)),
    [homeLayout.sections]
  );

  const sectionCards = useMemo(
    () =>
      homeLayout.sections.map((section) => ({
        ...section,
        cardIds: selectedIds.filter((id) => homeLayout.cardSectionAssignments[id] === section.id),
      })),
    [homeLayout.cardSectionAssignments, homeLayout.sections, selectedIds]
  );

  const sectionRows = useMemo(() => partitionSectionRows(sectionCards), [sectionCards]);

  const flowCards = useMemo(
    () =>
      selectedIds.filter((id) => {
        const assignedSectionId = homeLayout.cardSectionAssignments[id];
        return !assignedSectionId || !sectionIds.has(assignedSectionId);
      }),
    [homeLayout.cardSectionAssignments, sectionIds, selectedIds]
  );

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 8 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );

  const activeDragSize = useMemo<CardSize | null>(() => {
    if (!activeDragCard) return null;
    const entry = allCards.get(activeDragCard);
    const resolvedSize = cardSizes[activeDragCard];
    if (resolvedSize) return resolvedSize;
    if (entry && 'size' in entry) return entry.size as CardSize;
    return 'small';
  }, [activeDragCard, allCards, cardSizes]);

  const handleDragEnd = (event: DragEndEvent) => {
    const activeMeta = event.active.data.current as DragMeta | undefined;
    const overMeta = event.over?.data.current as DropMeta | undefined;

    setActiveDragCard(null);

    if (!activeMeta || !overMeta) return;

    const targetSectionId = overMeta.sectionId;
    const overCardId = overMeta.type === 'card' ? overMeta.cardId : null;

    if (activeMeta.source === 'library') {
      addHomeCard(activeMeta.cardId, targetSectionId);
      moveHomeCard(activeMeta.cardId, overCardId, targetSectionId);
      return;
    }

    if (activeMeta.cardId === overCardId) return;

    moveHomeCard(activeMeta.cardId, overCardId, targetSectionId);
  };

  const filteredLibraryCards = useMemo(() => {
    const normalizedQuery = libraryQuery.trim().toLowerCase();
    if (!normalizedQuery) return libraryCards.slice(0, 5);
    return libraryCards
      .filter((card) =>
        `${card.title} ${card.subtitle} ${card.meta} ${card.kind} ${card.id}`
          .toLowerCase()
          .includes(normalizedQuery)
      )
      .slice(0, 5);
  }, [libraryCards, libraryQuery]);

  const handleAddFromLibrary = (cardId: string) => {
    if (homeLayout.mode !== 'sectioned') {
      addHomeCard(cardId);
      return;
    }
    const firstSectionId = homeLayout.sections[0]?.id ?? addHomeSection();
    addHomeCard(cardId, firstSectionId);
  };

  const summaryItems = [
    { label: t('dashboard.homePersonal.stats.cards'), value: selectedIds.length },
    { label: t('dashboard.homePersonal.stats.available'), value: libraryCards.length },
    { label: t('dashboard.homePersonal.stats.widgets'), value: allCustomCards.length },
    { label: t('dashboard.homePersonal.stats.hidden'), value: hiddenEntityCount },
  ];

  return {
    allCards,
    flowCards,
    sectionRows,
    activeDragCard,
    setActiveDragCard,
    activeDragSize,
    sensors,
    handleDragEnd,
    libraryCards,
    libraryQuery,
    setLibraryQuery,
    filteredLibraryCards,
    handleAddFromLibrary,
    summaryItems,
  };
}
