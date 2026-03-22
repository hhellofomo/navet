import { type SetStateAction, useCallback, useMemo, useState } from 'react';
import { STORAGE_KEYS } from '@/app/constants/storage-keys';
import { storage } from '@/app/utils/storage';

export type HomeLayoutMode = 'flow' | 'sectioned';
export type HomeDashboardSectionSpan = number;

export interface HomeDashboardSection {
  id: string;
  title: string;
  span: HomeDashboardSectionSpan;
  stackUnder?: string;
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
const MIN_SECTION_COLUMNS = 1;
const TOTAL_SECTION_COLUMNS = 8;
const MAX_SECTIONS_PER_ROW = 4;
const FULL_ROW_SPAN = TOTAL_SECTION_COLUMNS;
const CUSTOM_CARD_ID_PREFIX = 'custom-';

function createSectionId() {
  return `home-section-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}

function normalizeSectionSpan(span: unknown): HomeDashboardSectionSpan {
  if (typeof span === 'number' && Number.isInteger(span)) {
    return Math.min(TOTAL_SECTION_COLUMNS, Math.max(MIN_SECTION_COLUMNS, span));
  }

  return FULL_ROW_SPAN;
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
          stackUnder: typeof section.stackUnder === 'string' ? section.stackUnder : undefined,
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

function getTopLevelSections(sections: HomeDashboardSection[]) {
  const sectionIds = new Set(sections.map((section) => section.id));
  return sections.filter((section) => !section.stackUnder || !sectionIds.has(section.stackUnder));
}

function getSectionBlock(
  sections: HomeDashboardSection[],
  sectionId: string
): HomeDashboardSection[] {
  const block: HomeDashboardSection[] = [];
  const descendantsByParent = new Map<string, HomeDashboardSection[]>();

  for (const section of sections) {
    if (!section.stackUnder) {
      continue;
    }

    const children = descendantsByParent.get(section.stackUnder);
    if (children) {
      children.push(section);
    } else {
      descendantsByParent.set(section.stackUnder, [section]);
    }
  }

  const appendSection = (targetId: string) => {
    const section = sections.find((candidate) => candidate.id === targetId);
    if (!section) {
      return;
    }

    block.push(section);
    for (const child of descendantsByParent.get(targetId) ?? []) {
      appendSection(child.id);
    }
  };

  appendSection(sectionId);
  return block;
}

function mergeTopLevelSections(
  previousSections: HomeDashboardSection[],
  nextTopLevelSections: HomeDashboardSection[]
) {
  const previousTopLevelIds = new Set(
    getTopLevelSections(previousSections).map((section) => section.id)
  );
  const blocks = new Map<string, HomeDashboardSection[]>();

  for (const topLevelSection of getTopLevelSections(previousSections)) {
    blocks.set(topLevelSection.id, getSectionBlock(previousSections, topLevelSection.id));
  }

  return nextTopLevelSections.flatMap((section) => {
    if (!previousTopLevelIds.has(section.id)) {
      return [section];
    }

    const block = blocks.get(section.id) ?? [section];
    return block.map((entry) =>
      entry.id === section.id ? { ...entry, span: section.span } : entry
    );
  });
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
                  span: FULL_ROW_SPAN,
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
          span: FULL_ROW_SPAN,
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
          span: MIN_SECTION_COLUMNS,
        };
        const topLevelSections = getTopLevelSections(previous.sections);
        const rows = partitionSectionRows(topLevelSections);

        if (rows.length === 0) {
          return {
            ...previous,
            sections: [{ ...nextSection, span: FULL_ROW_SPAN }],
          };
        }

        const rowIndex = targetSectionId
          ? findRowIndexBySectionId(rows, targetSectionId)
          : rows.length - 1;
        const targetRowIndex = rowIndex >= 0 ? rowIndex : rows.length - 1;
        const nextRows = rows.map((row: HomeDashboardSection[]) => [...row]);
        const targetRow = nextRows[targetRowIndex] ?? [];

        if (targetRow.length >= MAX_SECTIONS_PER_ROW) {
          nextRows.splice(targetRowIndex + 1, 0, [{ ...nextSection, span: FULL_ROW_SPAN }]);
        } else {
          nextRows[targetRowIndex] = rebalanceRowSections([...targetRow, nextSection]);
        }

        const nextTopLevelSections = nextRows.flat();

        return {
          ...previous,
          sections: mergeTopLevelSections(previous.sections, nextTopLevelSections),
        };
      });

      return sectionId;
    },
    [persistLayout]
  );

  const addSectionBelow = useCallback(
    (targetSectionId: string) => {
      const sectionId = createSectionId();

      persistLayout((previous) => {
        const targetSection = previous.sections.find((section) => section.id === targetSectionId);
        if (!targetSection) {
          return previous;
        }

        const nextSection: HomeDashboardSection = {
          id: sectionId,
          title: `${SECTION_TITLE_PREFIX} ${previous.sections.length + 1}`,
          span: targetSection.span,
          stackUnder: targetSection.id,
        };
        const targetIndex = previous.sections.findIndex(
          (section) => section.id === targetSectionId
        );

        return {
          ...previous,
          sections: [
            ...previous.sections.slice(0, targetIndex + 1),
            nextSection,
            ...previous.sections.slice(targetIndex + 1),
          ],
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
        const rows = partitionSectionRows(getTopLevelSections(previous.sections));
        const rowIndex = findRowIndexBySectionId(rows, sectionId);
        const targetSection = previous.sections.find((section) => section.id === sectionId);
        if (!targetSection) {
          return previous;
        }
        const fallbackStackUnder = targetSection.stackUnder;
        const strippedSections = previous.sections
          .filter((section) => section.id !== sectionId)
          .map((section) =>
            section.stackUnder === sectionId
              ? { ...section, stackUnder: fallbackStackUnder }
              : section
          );
        const isTopLevelSection = !targetSection.stackUnder;
        const topLevelSections = getTopLevelSections(strippedSections);
        const nextRows = isTopLevelSection
          ? rows.map((row: HomeDashboardSection[]) => [...row])
          : partitionSectionRows(topLevelSections);

        if (isTopLevelSection && rowIndex >= 0) {
          const targetRow = nextRows[rowIndex].filter(
            (section: HomeDashboardSection) => section.id !== sectionId
          );
          nextRows[rowIndex] = targetRow.length > 0 ? rebalanceRowSections(targetRow) : [];
        }

        const rebalancedTopLevelSections = isTopLevelSection ? nextRows.flat() : topLevelSections;
        const remainingSections = mergeTopLevelSections(
          strippedSections,
          rebalancedTopLevelSections
        );
        const fallbackSectionId = remainingSections.find(
          (section: HomeDashboardSection) => section.id !== sectionId
        )?.id;
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
      if (!validIdSet.has(cardId) && !cardId.startsWith(CUSTOM_CARD_ID_PREFIX)) {
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

  return {
    layout,
    setMode,
    setShowHero,
    addSection,
    addColumnSection,
    addSectionBelow,
    renameSection,
    removeSection,
    addCard,
    removeCard,
    moveCard,
  };
}
