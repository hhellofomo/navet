import { type SetStateAction, useCallback, useEffect, useMemo, useState } from 'react';
import { STORAGE_KEYS } from '@/app/constants/storage-keys';
import { storage } from '@/app/utils/storage';

export type HomeLayoutMode = 'flow' | 'sectioned';
export type HomeDashboardSectionSpan = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8;

export interface HomeDashboardSection {
  id: string;
  title: string;
  span: HomeDashboardSectionSpan;
}

export interface HomeDashboardLayoutState {
  mode: HomeLayoutMode;
  showHero: boolean;
  cardIds: string[];
  sections: HomeDashboardSection[];
  cardSectionAssignments: Record<string, string>;
}

const DEFAULT_LAYOUT: HomeDashboardLayoutState = {
  mode: 'flow',
  showHero: true,
  cardIds: [],
  sections: [],
  cardSectionAssignments: {},
};

const SECTION_TITLE_PREFIX = 'Section';
const TOTAL_SECTION_COLUMNS = 8;
const MAX_SECTIONS_PER_ROW = 4;

function createSectionId() {
  return `home-section-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}

function normalizeSectionSpan(span: unknown): HomeDashboardSectionSpan {
  if (typeof span === 'number' && Number.isInteger(span) && span >= 1 && span <= 8) {
    return span as HomeDashboardSectionSpan;
  }

  if (span === 'full') {
    return 8;
  }

  if (span === 'half') {
    return 4;
  }

  return 4;
}

function buildBalancedSpans(
  count: number,
  width = TOTAL_SECTION_COLUMNS
): HomeDashboardSectionSpan[] {
  if (count <= 1) {
    return [width as HomeDashboardSectionSpan];
  }

  const leftCount = Math.floor(count / 2);
  const rightCount = count - leftCount;
  const leftWidth = Math.ceil(width / 2);
  const rightWidth = Math.floor(width / 2);

  return [
    ...buildBalancedSpans(leftCount, leftWidth),
    ...buildBalancedSpans(rightCount, rightWidth),
  ].sort((left, right) => right - left) as HomeDashboardSectionSpan[];
}

function rebalanceRowSections(sections: HomeDashboardSection[]): HomeDashboardSection[] {
  const spans = buildBalancedSpans(sections.length);
  return sections.map((section, index) => ({
    ...section,
    span: spans[index] ?? 1,
  }));
}

export function partitionSectionRows<T extends { span: HomeDashboardSectionSpan }>(
  sections: T[]
): T[][] {
  const rows: T[][] = [];
  let currentRow: T[] = [];
  let currentWidth = 0;

  for (const section of sections) {
    if (
      currentRow.length > 0 &&
      (currentWidth + section.span > TOTAL_SECTION_COLUMNS ||
        currentRow.length >= MAX_SECTIONS_PER_ROW)
    ) {
      rows.push(currentRow);
      currentRow = [];
      currentWidth = 0;
    }

    currentRow.push(section);
    currentWidth += section.span;

    if (currentWidth >= TOTAL_SECTION_COLUMNS) {
      rows.push(currentRow);
      currentRow = [];
      currentWidth = 0;
    }
  }

  if (currentRow.length > 0) {
    rows.push(currentRow);
  }

  return rows;
}

function findRowIndexBySectionId(rows: HomeDashboardSection[][], sectionId: string): number {
  return rows.findIndex((row) => row.some((section) => section.id === sectionId));
}

function getCardGroupKey(cardId: string, assignments: Record<string, string>) {
  return assignments[cardId] ?? '__flow__';
}

function normalizeLayout(value: unknown): HomeDashboardLayoutState {
  if (typeof value !== 'object' || value === null) {
    return DEFAULT_LAYOUT;
  }

  const candidate = value as Partial<HomeDashboardLayoutState>;
  const sections = Array.isArray(candidate.sections)
    ? candidate.sections
        .filter(
          (section): section is HomeDashboardSection =>
            typeof section?.id === 'string' && typeof section?.title === 'string'
        )
        .map((section) => ({
          ...section,
          span: normalizeSectionSpan(section.span),
        }))
    : [];

  return {
    mode: candidate.mode === 'sectioned' ? 'sectioned' : 'flow',
    showHero: candidate.showHero !== false,
    cardIds: Array.isArray(candidate.cardIds)
      ? candidate.cardIds.filter((id): id is string => typeof id === 'string')
      : [],
    sections,
    cardSectionAssignments:
      candidate.cardSectionAssignments &&
      typeof candidate.cardSectionAssignments === 'object' &&
      !Array.isArray(candidate.cardSectionAssignments)
        ? Object.fromEntries(
            Object.entries(candidate.cardSectionAssignments).filter(
              ([cardId, sectionId]) => typeof cardId === 'string' && typeof sectionId === 'string'
            )
          )
        : {},
  };
}

export function useHomeDashboardLayout(validCardIds: string[]) {
  const validIdSet = useMemo(() => new Set(validCardIds), [validCardIds]);
  const [layout, setLayout] = useState<HomeDashboardLayoutState>(() =>
    normalizeLayout(storage.get(STORAGE_KEYS.homeDashboardLayout, DEFAULT_LAYOUT))
  );
  const persistLayout = useCallback((updater: SetStateAction<HomeDashboardLayoutState>) => {
    setLayout((previous) => {
      const next = typeof updater === 'function' ? updater(previous) : updater;
      storage.set(STORAGE_KEYS.homeDashboardLayout, next);
      return next;
    });
  }, []);

  useEffect(() => {
    storage.set(STORAGE_KEYS.homeDashboardLayout, layout);
  }, [layout]);

  const setMode = useCallback(
    (mode: HomeLayoutMode) => {
      persistLayout((previous) => {
        if (mode !== 'sectioned') {
          return { ...previous, mode };
        }

        const sections =
          previous.sections.length > 0
            ? previous.sections
            : [
                {
                  id: createSectionId(),
                  title: `${SECTION_TITLE_PREFIX} 1`,
                  span: 8 as HomeDashboardSectionSpan,
                },
              ];
        const firstSectionId = sections[0]?.id;

        return {
          ...previous,
          mode,
          sections,
          cardSectionAssignments: firstSectionId
            ? Object.fromEntries(
                previous.cardIds.map((cardId) => [
                  cardId,
                  previous.cardSectionAssignments[cardId] ?? firstSectionId,
                ])
              )
            : previous.cardSectionAssignments,
        };
      });
    },
    [persistLayout]
  );

  const setShowHero = useCallback(
    (showHero: boolean) => {
      persistLayout((previous) => ({ ...previous, showHero }));
    },
    [persistLayout]
  );

  const addSection = useCallback(() => {
    const sectionId = createSectionId();

    persistLayout((previous) => ({
      ...previous,
      sections: [
        ...previous.sections,
        {
          id: sectionId,
          title: `${SECTION_TITLE_PREFIX} ${previous.sections.length + 1}`,
          span: 8,
        },
      ],
    }));

    return sectionId;
  }, [persistLayout]);

  const addColumnSection = useCallback(
    (targetSectionId?: string) => {
      const sectionId = createSectionId();

      persistLayout((previous) => {
        const nextSection: HomeDashboardSection = {
          id: sectionId,
          title: `${SECTION_TITLE_PREFIX} ${previous.sections.length + 1}`,
          span: 1,
        };
        const rows = partitionSectionRows(previous.sections);

        if (rows.length === 0) {
          return {
            ...previous,
            sections: [{ ...nextSection, span: 8 }],
          };
        }

        const rowIndex = targetSectionId
          ? findRowIndexBySectionId(rows, targetSectionId)
          : rows.length - 1;
        const targetRowIndex = rowIndex >= 0 ? rowIndex : rows.length - 1;
        const nextRows = rows.map((row: HomeDashboardSection[]) => [...row]);
        const targetRow = nextRows[targetRowIndex] ?? [];

        if (targetRow.length >= MAX_SECTIONS_PER_ROW) {
          nextRows.splice(targetRowIndex + 1, 0, [{ ...nextSection, span: 8 }]);
        } else {
          nextRows[targetRowIndex] = rebalanceRowSections([...targetRow, nextSection]);
        }

        return {
          ...previous,
          sections: nextRows.flat(),
        };
      });

      return sectionId;
    },
    [persistLayout]
  );

  const renameSection = useCallback(
    (sectionId: string, title: string) => {
      persistLayout((previous) => ({
        ...previous,
        sections: previous.sections.map((section) =>
          section.id === sectionId ? { ...section, title } : section
        ),
      }));
    },
    [persistLayout]
  );

  const removeSection = useCallback(
    (sectionId: string) => {
      persistLayout((previous) => {
        const rows = partitionSectionRows(previous.sections);
        const rowIndex = findRowIndexBySectionId(rows, sectionId);
        if (rowIndex < 0) {
          return previous;
        }

        const nextRows = rows.map((row: HomeDashboardSection[]) => [...row]);
        const targetRow = nextRows[rowIndex].filter(
          (section: HomeDashboardSection) => section.id !== sectionId
        );
        nextRows[rowIndex] = targetRow.length > 0 ? rebalanceRowSections(targetRow) : [];
        const remainingSections = nextRows.flat();
        const fallbackSectionId =
          targetRow[0]?.id ??
          remainingSections.find((section: HomeDashboardSection) => section.id !== sectionId)?.id;
        const nextAssignments = Object.fromEntries(
          Object.entries(previous.cardSectionAssignments).flatMap(([cardId, assigned]) => {
            if (assigned !== sectionId) {
              return [[cardId, assigned]];
            }

            return fallbackSectionId ? [[cardId, fallbackSectionId]] : [];
          })
        );

        return {
          ...previous,
          sections: remainingSections,
          cardSectionAssignments: nextAssignments,
        };
      });
    },
    [persistLayout]
  );

  const addCard = useCallback(
    (cardId: string, sectionId?: string) => {
      if (!validIdSet.has(cardId)) {
        return;
      }

      persistLayout((previous) => {
        const cardIds = previous.cardIds.includes(cardId)
          ? previous.cardIds
          : [...previous.cardIds, cardId];

        return {
          ...previous,
          cardIds,
          cardSectionAssignments:
            sectionId && previous.mode === 'sectioned'
              ? { ...previous.cardSectionAssignments, [cardId]: sectionId }
              : previous.cardSectionAssignments,
        };
      });
    },
    [persistLayout, validIdSet]
  );

  const removeCard = useCallback(
    (cardId: string) => {
      persistLayout((previous) => {
        const nextAssignments = { ...previous.cardSectionAssignments };
        delete nextAssignments[cardId];

        return {
          ...previous,
          cardIds: previous.cardIds.filter((id) => id !== cardId),
          cardSectionAssignments: nextAssignments,
        };
      });
    },
    [persistLayout]
  );

  const moveCard = useCallback(
    (activeId: string, overId: string | null, sectionId?: string) => {
      persistLayout((previous) => {
        if (!previous.cardIds.includes(activeId)) {
          return previous;
        }

        const nextAssignments =
          previous.mode === 'sectioned' && sectionId
            ? { ...previous.cardSectionAssignments, [activeId]: sectionId }
            : previous.cardSectionAssignments;
        const withoutActive = previous.cardIds.filter((id) => id !== activeId);

        if (previous.mode !== 'sectioned') {
          const nextCardIds = [...withoutActive];

          if (!overId || !withoutActive.includes(overId)) {
            nextCardIds.push(activeId);
          } else {
            nextCardIds.splice(withoutActive.indexOf(overId), 0, activeId);
          }

          return {
            ...previous,
            cardIds: nextCardIds,
            cardSectionAssignments: nextAssignments,
          };
        }

        const targetGroup = getCardGroupKey(activeId, nextAssignments);
        const grouped = new Map<string, string[]>();

        for (const cardId of withoutActive) {
          const group = getCardGroupKey(cardId, nextAssignments);
          const cards = grouped.get(group);
          if (cards) {
            cards.push(cardId);
          } else {
            grouped.set(group, [cardId]);
          }
        }

        const targetCards = [...(grouped.get(targetGroup) ?? [])];
        if (!overId || !targetCards.includes(overId)) {
          targetCards.push(activeId);
        } else {
          targetCards.splice(targetCards.indexOf(overId), 0, activeId);
        }
        grouped.set(targetGroup, targetCards);

        const nextCardIds = withoutActive.reduce<string[]>((result, originalCardId) => {
          const group = getCardGroupKey(originalCardId, nextAssignments);
          const remainingCards = grouped.get(group);
          const nextCardId = remainingCards?.shift();

          if (nextCardId) {
            result.push(nextCardId);
          }

          return result;
        }, []);

        for (const remainingCards of grouped.values()) {
          nextCardIds.push(...remainingCards);
        }

        return {
          ...previous,
          cardIds: nextCardIds,
          cardSectionAssignments: nextAssignments,
        };
      });
    },
    [persistLayout]
  );

  const assignCardToSection = useCallback(
    (cardId: string, sectionId: string) => {
      persistLayout((previous) => ({
        ...previous,
        cardSectionAssignments: { ...previous.cardSectionAssignments, [cardId]: sectionId },
      }));
    },
    [persistLayout]
  );

  return {
    layout,
    setMode,
    setShowHero,
    addSection,
    addColumnSection,
    renameSection,
    removeSection,
    addCard,
    removeCard,
    moveCard,
    assignCardToSection,
  };
}
