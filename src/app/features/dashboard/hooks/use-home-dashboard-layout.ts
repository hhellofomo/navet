import { useCallback, useEffect, useMemo, useState } from 'react';
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

function partitionSectionsIntoRows(sections: HomeDashboardSection[]): HomeDashboardSection[][] {
  const rows: HomeDashboardSection[][] = [];
  let currentRow: HomeDashboardSection[] = [];
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

  useEffect(() => {
    setLayout((previous) => {
      const nextCardIds = previous.cardIds.filter((id) => validIdSet.has(id));
      const validSectionIds = new Set(previous.sections.map((section) => section.id));
      const nextAssignments = Object.fromEntries(
        Object.entries(previous.cardSectionAssignments).filter(
          ([cardId, sectionId]) => validIdSet.has(cardId) && validSectionIds.has(sectionId)
        )
      );

      if (
        nextCardIds.length === previous.cardIds.length &&
        Object.keys(nextAssignments).length === Object.keys(previous.cardSectionAssignments).length
      ) {
        return previous;
      }

      return {
        ...previous,
        cardIds: nextCardIds,
        cardSectionAssignments: nextAssignments,
      };
    });
  }, [validIdSet]);

  useEffect(() => {
    storage.set(STORAGE_KEYS.homeDashboardLayout, layout);
  }, [layout]);

  const setMode = useCallback((mode: HomeLayoutMode) => {
    setLayout((previous) => {
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
  }, []);

  const setShowHero = useCallback((showHero: boolean) => {
    setLayout((previous) => ({ ...previous, showHero }));
  }, []);

  const addSection = useCallback(() => {
    const sectionId = createSectionId();

    setLayout((previous) => ({
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
  }, []);

  const addColumnSection = useCallback((targetSectionId?: string) => {
    const sectionId = createSectionId();

    setLayout((previous) => {
      const nextSection: HomeDashboardSection = {
        id: sectionId,
        title: `${SECTION_TITLE_PREFIX} ${previous.sections.length + 1}`,
        span: 1,
      };
      const rows = partitionSectionsIntoRows(previous.sections);

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
      const nextRows = rows.map((row) => [...row]);
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
  }, []);

  const renameSection = useCallback((sectionId: string, title: string) => {
    setLayout((previous) => ({
      ...previous,
      sections: previous.sections.map((section) =>
        section.id === sectionId ? { ...section, title } : section
      ),
    }));
  }, []);

  const removeSection = useCallback((sectionId: string) => {
    setLayout((previous) => {
      const rows = partitionSectionsIntoRows(previous.sections);
      const rowIndex = findRowIndexBySectionId(rows, sectionId);
      if (rowIndex < 0) {
        return previous;
      }

      const nextRows = rows.map((row) => [...row]);
      const targetRow = nextRows[rowIndex].filter((section) => section.id !== sectionId);
      nextRows[rowIndex] = targetRow.length > 0 ? rebalanceRowSections(targetRow) : [];
      const remainingSections = nextRows.flat();
      const fallbackSectionId =
        targetRow[0]?.id ?? remainingSections.find((section) => section.id !== sectionId)?.id;
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
  }, []);

  const addCard = useCallback(
    (cardId: string, sectionId?: string) => {
      if (!validIdSet.has(cardId)) {
        return;
      }

      setLayout((previous) => {
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
    [validIdSet]
  );

  const removeCard = useCallback((cardId: string) => {
    setLayout((previous) => {
      const nextAssignments = { ...previous.cardSectionAssignments };
      delete nextAssignments[cardId];

      return {
        ...previous,
        cardIds: previous.cardIds.filter((id) => id !== cardId),
        cardSectionAssignments: nextAssignments,
      };
    });
  }, []);

  const moveCard = useCallback((activeId: string, overId: string | null, sectionId?: string) => {
    setLayout((previous) => {
      if (!previous.cardIds.includes(activeId)) {
        return previous;
      }

      const withoutActive = previous.cardIds.filter((id) => id !== activeId);
      const nextCardIds = [...withoutActive];

      if (!overId || !withoutActive.includes(overId)) {
        nextCardIds.push(activeId);
      } else {
        nextCardIds.splice(withoutActive.indexOf(overId), 0, activeId);
      }

      return {
        ...previous,
        cardIds: nextCardIds,
        cardSectionAssignments:
          previous.mode === 'sectioned' && sectionId
            ? { ...previous.cardSectionAssignments, [activeId]: sectionId }
            : previous.cardSectionAssignments,
      };
    });
  }, []);

  const assignCardToSection = useCallback((cardId: string, sectionId: string) => {
    setLayout((previous) => ({
      ...previous,
      cardSectionAssignments: { ...previous.cardSectionAssignments, [cardId]: sectionId },
    }));
  }, []);

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
