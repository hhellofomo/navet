import { closestCenter, DndContext, DragOverlay, useDraggable, useDroppable } from '@dnd-kit/core';
import { rectSortingStrategy, SortableContext, useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import {
  ChevronLeft,
  ChevronRight,
  Columns2,
  EyeOff,
  GripVertical,
  LayoutPanelTop,
  LayoutTemplate,
  PanelTop,
  Plus,
  Rows3,
  Search,
  Wand2,
} from 'lucide-react';
import { type CSSProperties, memo, type ReactNode } from 'react';
import { type CardSize, getCardSpanClass } from '@/app/components/shared/card-size-selector';
import { getThemeSurfaceTokens } from '@/app/components/shared/theme/theme-surface-tokens';
import { useI18n, useTheme } from '@/app/hooks';
import { useBreakpointCols } from '@/app/hooks/use-breakpoint-cols';
import type { DeviceWithType } from '@/app/types/device.types';
import {
  type DragMeta,
  type DropMeta,
  type LibraryCard,
  useHomeDashboardEditor,
} from '../hooks/use-home-dashboard-editor';
import type {
  HomeDashboardLayoutState,
  HomeDashboardSectionSpan,
} from '../hooks/use-home-dashboard-layout';
import { useLibraryPanel } from '../hooks/use-library-panel';
import type { CustomCard } from '../stores/custom-cards-store';
import { DashboardCardItem } from './dashboard-card-item';
import { DashboardEditActions } from './dashboard-edit-actions';
import { DashboardEmptyState } from './dashboard-empty-state';
import { DashboardHeroSection } from './dashboard-hero-section';

interface HomeDashboardOverviewProps {
  deviceMap: Map<string, DeviceWithType>;
  cardSizes: Record<string, CardSize>;
  updateCardSize: (id: string, size: CardSize) => void;
  isEditMode: boolean;
  hiddenEntityCount: number;
  allCustomCards: CustomCard[];
  homeLayout: HomeDashboardLayoutState;
  addHomeCard: (cardId: string, sectionId?: string) => void;
  removeHomeCard: (cardId: string) => void;
  moveHomeCard: (activeId: string, overId: string | null, sectionId?: string) => void;
  setHomeLayoutMode: (mode: HomeDashboardLayoutState['mode']) => void;
  setHomeShowHero: (showHero: boolean) => void;
  addHomeSection: () => string;
  addHomeColumnSection: (targetSectionId?: string) => string;
  renameHomeSection: (sectionId: string, title: string) => void;
  removeHomeSection: (sectionId: string) => void;
  onOpenAddEntityDialog?: () => void;
  onOpenAddCardDialog?: () => void;
  onUpdateCard?: (cardId: string, data: Record<string, unknown>) => void;
  onToggleEditMode?: () => void;
}

const overlayClass: Record<CardSize, string> = {
  'extra-small': 'w-[190px] h-[87px]',
  small: 'w-[190px] h-[190px]',
  medium: 'w-[396px] h-[190px]',
  large: 'w-[396px] h-[396px]',
  hero: 'w-full h-[277px]',
};

const FLOATING_LIBRARY_WIDTH = 360;

function isCustomCard(entry: DeviceWithType | CustomCard): entry is CustomCard {
  return 'createdAt' in entry;
}

function getRenderedSectionSpan(span: HomeDashboardSectionSpan, cols: number): number {
  return Math.min(Math.max(1, span), cols);
}

export const HomeDashboardOverview = memo(function HomeDashboardOverview({
  deviceMap,
  cardSizes,
  updateCardSize,
  isEditMode,
  hiddenEntityCount,
  allCustomCards,
  homeLayout,
  addHomeCard,
  removeHomeCard,
  moveHomeCard,
  setHomeLayoutMode,
  setHomeShowHero,
  addHomeSection,
  addHomeColumnSection,
  renameHomeSection,
  removeHomeSection,
  onOpenAddEntityDialog,
  onOpenAddCardDialog,
  onUpdateCard,
  onToggleEditMode,
}: HomeDashboardOverviewProps) {
  const { t } = useI18n();
  const { theme, accentColor } = useTheme();
  const sectionGridCols = useBreakpointCols();
  const surface = getThemeSurfaceTokens(theme);
  const {
    libraryPanelRef,
    isLibraryVisible,
    isLibraryCollapsed,
    libraryPosition,
    handleStartLibraryDrag,
    toggleLibraryVisibility,
    expandLibrary,
    collapseLibraryToDock,
  } = useLibraryPanel();

  const {
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
  } = useHomeDashboardEditor({
    deviceMap,
    allCustomCards,
    homeLayout,
    cardSizes,
    hiddenEntityCount,
    addHomeCard,
    moveHomeCard,
    addHomeSection,
  });

  const primaryButtonStyle = {
    background: `linear-gradient(135deg, ${accentColor}, ${accentColor}cc)`,
    boxShadow: `0 20px 44px -24px ${accentColor}88`,
  };

  if (!isEditMode) {
    return (
      <HomePresentation
        flowCards={flowCards}
        allCards={allCards}
        cardSizes={cardSizes}
        updateCardSize={updateCardSize}
        onUpdateCard={onUpdateCard}
        showHero={homeLayout.showHero}
        isSectioned={homeLayout.mode === 'sectioned'}
        sectionRows={sectionRows}
        accentColor={accentColor}
        surface={surface}
        emptyTitle={t('dashboard.homeOverview.emptyTitle')}
        emptyDescription={t('dashboard.homeOverview.emptyDescription')}
        onToggleEditMode={onToggleEditMode}
      />
    );
  }

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragStart={(event) => {
        const dragMeta = event.active.data.current as DragMeta | undefined;
        setActiveDragCard(dragMeta?.cardId ?? null);
      }}
      onDragEnd={handleDragEnd}
    >
      <div className="space-y-6 md:space-y-8">
        <DashboardHeroSection
          accentColor={accentColor}
          surface={surface}
          eyebrow={
            <div
              className={`text-[11px] font-semibold uppercase tracking-[0.2em] ${surface.textMuted}`}
            >
              {t('dashboard.homePersonal.eyebrow')}
            </div>
          }
          title={t('dashboard.homePersonal.title')}
          description={t('dashboard.homePersonal.description')}
          actions={
            <>
              {onOpenAddEntityDialog || libraryCards.length > 0 ? (
                <button
                  type="button"
                  onClick={toggleLibraryVisibility}
                  className={
                    isLibraryVisible
                      ? `inline-flex items-center gap-2 rounded-full border px-3 py-2 text-sm font-medium transition-colors ${surface.border} ${surface.hoverBg}`
                      : 'inline-flex items-center gap-2 rounded-full px-3.5 py-2 text-sm font-semibold text-white'
                  }
                  style={isLibraryVisible ? undefined : primaryButtonStyle}
                >
                  {isLibraryVisible ? <EyeOff className="h-4 w-4" /> : <Plus className="h-4 w-4" />}
                  <span className={isLibraryVisible ? surface.textPrimary : undefined}>
                    {!isLibraryVisible ? 'Show card library' : 'Hide card library'}
                  </span>
                </button>
              ) : null}
              {onOpenAddCardDialog ? (
                <button
                  type="button"
                  onClick={onOpenAddCardDialog}
                  className={`inline-flex items-center gap-2 rounded-full border px-3 py-2 text-sm font-medium transition-colors ${surface.border} ${surface.hoverBg}`}
                >
                  <Plus className="h-4 w-4" />
                  <span className={surface.textPrimary}>Add Custom Widget</span>
                </button>
              ) : null}
              <div className="hidden h-8 self-center w-px rounded-full bg-white/24 md:block" />
              <button
                type="button"
                onClick={() => setHomeShowHero(!homeLayout.showHero)}
                className={`inline-flex items-center gap-2 rounded-full border px-3 py-2 text-sm font-medium transition-colors ${surface.border} ${surface.hoverBg}`}
              >
                <PanelTop className="h-4 w-4" />
                <span className={surface.textPrimary}>
                  {homeLayout.showHero
                    ? t('dashboard.homePersonal.hideHero')
                    : t('dashboard.homePersonal.showHero')}
                </span>
              </button>
            </>
          }
          aside={
            <div className="flex flex-wrap gap-2 xl:justify-end">
              {summaryItems.map((item) => (
                <div
                  key={item.label}
                  className={`inline-flex items-center gap-2 rounded-full border px-3 py-2 ${surface.border} ${surface.panelMuted}`}
                >
                  <span className={`text-xs uppercase tracking-[0.16em] ${surface.textMuted}`}>
                    {item.label}
                  </span>
                  <span className={`text-sm font-semibold ${surface.textPrimary}`}>
                    {item.value}
                  </span>
                </div>
              ))}
            </div>
          }
        />

        <div>
          <DashboardEditActions
            isEditMode={isEditMode}
            onRemoveFromLayout={removeHomeCard}
            onSizeChange={updateCardSize}
          >
            <section
              className={`rounded-[28px] border p-5 md:p-6 ${surface.border} ${surface.panel} ${surface.cardShadow}`}
            >
              <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                <div>
                  <h2 className={`text-xl font-semibold ${surface.textPrimary}`}>
                    {t('dashboard.homePersonal.canvasTitle')}
                  </h2>
                  <p className={`mt-1 text-sm ${surface.textSecondary}`}>
                    {homeLayout.mode === 'sectioned'
                      ? t('dashboard.homePersonal.canvasSectioned')
                      : t('dashboard.homePersonal.canvasFlow')}
                  </p>
                </div>

                <div className="flex flex-wrap items-center gap-2">
                  {homeLayout.mode === 'sectioned' ? (
                    <>
                      <button
                        type="button"
                        onClick={() => addHomeSection()}
                        className={`inline-flex items-center gap-2 rounded-full border px-3 py-2 text-sm font-medium transition-colors ${surface.border} ${surface.hoverBg}`}
                      >
                        <Rows3 className="h-4 w-4" />
                        <span className={surface.textPrimary}>Add row</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => addHomeColumnSection()}
                        className={`inline-flex items-center gap-2 rounded-full border px-3 py-2 text-sm font-medium transition-colors ${surface.border} ${surface.hoverBg}`}
                      >
                        <Columns2 className="h-4 w-4" />
                        <span className={surface.textPrimary}>Add column</span>
                      </button>
                    </>
                  ) : null}
                  <div className="hidden h-8 self-center w-px rounded-full bg-white/24 md:block" />
                  <ModeChip
                    active={homeLayout.mode === 'flow'}
                    icon={<LayoutPanelTop className="h-4 w-4" />}
                    label={t('dashboard.homePersonal.mode.flow')}
                    onClick={() => setHomeLayoutMode('flow')}
                    surface={surface}
                    accentColor={accentColor}
                  />
                  <ModeChip
                    active={homeLayout.mode === 'sectioned'}
                    icon={<LayoutTemplate className="h-4 w-4" />}
                    label={t('dashboard.homePersonal.mode.sectioned')}
                    onClick={() => {
                      setHomeLayoutMode('sectioned');
                      if (homeLayout.sections.length === 0) {
                        addHomeSection();
                      }
                    }}
                    surface={surface}
                    accentColor={accentColor}
                  />
                </div>
              </div>

              <div className="mt-6 space-y-6">
                {homeLayout.mode === 'sectioned' ? (
                  homeLayout.sections.length > 0 ? (
                    <div className="space-y-5">
                      {sectionRows.map((row) => (
                        <SectionRowCanvas
                          key={row.map((section) => section.id).join(':')}
                          row={row}
                          sectionGridCols={sectionGridCols}
                          allCards={allCards}
                          cardSizes={cardSizes}
                          updateCardSize={updateCardSize}
                          isEditMode={isEditMode}
                          onUpdateCard={onUpdateCard}
                          onRemoveFromLayout={removeHomeCard}
                          showHero={homeLayout.showHero}
                          onRenameSection={renameHomeSection}
                          onRemoveSection={removeHomeSection}
                          surface={surface}
                        />
                      ))}
                    </div>
                  ) : (
                    <EmptyCanvas
                      label={t('dashboard.homePersonal.noSections')}
                      description={t('dashboard.homePersonal.noSectionsDescription')}
                      surface={surface}
                    />
                  )
                ) : (
                  <FlowCanvas
                    cardIds={flowCards}
                    allCards={allCards}
                    cardSizes={cardSizes}
                    updateCardSize={updateCardSize}
                    isEditMode={isEditMode}
                    onUpdateCard={onUpdateCard}
                    onRemoveFromLayout={removeHomeCard}
                    showHero={homeLayout.showHero}
                    surface={surface}
                  />
                )}
              </div>
            </section>
          </DashboardEditActions>
        </div>
      </div>

      {isLibraryVisible && isLibraryCollapsed ? (
        <button
          type="button"
          onClick={expandLibrary}
          className={`fixed z-40 flex items-center gap-2 rounded-l-2xl border px-3 py-3 ${surface.border} ${surface.panel} ${surface.cardShadow}`}
          style={{
            right: 0,
            top: `${libraryPosition.y + 12}px`,
          }}
          aria-label="Show card library"
        >
          <ChevronLeft className={`h-4 w-4 ${surface.textPrimary}`} />
          <span className={`text-sm font-medium ${surface.textPrimary}`}>
            {t('dashboard.homePersonal.libraryTitle')}
          </span>
        </button>
      ) : null}

      {isLibraryVisible && !isLibraryCollapsed ? (
        <aside
          ref={libraryPanelRef}
          className={`fixed z-40 w-[360px] rounded-[28px] border p-5 md:p-6 ${surface.border} ${surface.panel} ${surface.cardShadow}`}
          style={{
            width: `${FLOATING_LIBRARY_WIDTH}px`,
            left: `${libraryPosition.x}px`,
            top: `${libraryPosition.y}px`,
          }}
        >
          <div className="flex items-start justify-between gap-3">
            <div>
              <h2 className={`text-xl font-semibold ${surface.textPrimary}`}>
                {t('dashboard.homePersonal.libraryTitle')}
              </h2>
              <p className={`mt-1 text-sm ${surface.textSecondary}`}>
                {t('dashboard.homePersonal.libraryDescription')}
              </p>
            </div>
            <div className="ml-auto flex items-center gap-2">
              <button
                type="button"
                onPointerDown={handleStartLibraryDrag}
                className={`rounded-full border p-2 ${surface.border} ${surface.hoverBg}`}
                aria-label="Drag card library"
              >
                <GripVertical className={`h-4 w-4 ${surface.textPrimary}`} />
              </button>
              <button
                type="button"
                onClick={collapseLibraryToDock}
                className={`rounded-full border p-2 ${surface.border} ${surface.hoverBg}`}
                aria-label="Put away card library"
              >
                <ChevronRight className={`h-4 w-4 ${surface.textPrimary}`} />
              </button>
            </div>
          </div>

          <div
            className={`mt-4 flex items-center gap-2 rounded-[18px] border px-3 py-3 ${surface.border} ${surface.panelMuted}`}
          >
            <Search className={`h-4 w-4 shrink-0 ${surface.textMuted}`} />
            <input
              type="text"
              value={libraryQuery}
              onChange={(event) => setLibraryQuery(event.target.value)}
              placeholder={t('dashboard.addEntity.searchPlaceholder')}
              className={`min-w-0 flex-1 bg-transparent text-sm outline-none ${surface.textPrimary}`}
              style={{ caretColor: accentColor }}
            />
          </div>

          <div className="mt-3 space-y-2">
            {filteredLibraryCards.length > 0 ? (
              filteredLibraryCards.map((card) => (
                <LibraryCardRow
                  key={card.id}
                  card={card}
                  surface={surface}
                  onAdd={() => handleAddFromLibrary(card.id)}
                />
              ))
            ) : (
              <div
                className={`rounded-[18px] border border-dashed p-4 text-sm ${surface.borderStrong} ${surface.textSecondary}`}
              >
                {t('dashboard.homePersonal.libraryEmptyDescription')}
              </div>
            )}
          </div>
        </aside>
      ) : null}

      <DragOverlay dropAnimation={null}>
        {activeDragCard && activeDragSize ? (
          <div
            className={`flex items-center justify-center rounded-2xl border border-white/20 bg-white/10 backdrop-blur-xl ${
              overlayClass[
                !homeLayout.showHero && activeDragSize === 'hero' ? 'large' : activeDragSize
              ]
            }`}
          >
            <GripVertical className="h-5 w-5 text-white/60" />
          </div>
        ) : null}
      </DragOverlay>
    </DndContext>
  );
});

function SectionCanvas({
  sectionId,
  title,
  renderedSpan,
  cardIds,
  allCards,
  cardSizes,
  updateCardSize,
  isEditMode,
  onUpdateCard,
  onRemoveFromLayout,
  showHero,
  onRenameSection,
  onRemoveSection,
  surface,
}: {
  sectionId: string;
  title: string;
  renderedSpan: number;
  cardIds: string[];
  allCards: Map<string, DeviceWithType | CustomCard>;
  cardSizes: Record<string, CardSize>;
  updateCardSize: (id: string, size: CardSize) => void;
  isEditMode: boolean;
  onUpdateCard?: (cardId: string, data: Record<string, unknown>) => void;
  onRemoveFromLayout: (cardId: string) => void;
  showHero: boolean;
  onRenameSection: (sectionId: string, title: string) => void;
  onRemoveSection: (sectionId: string) => void;
  surface: ReturnType<typeof getThemeSurfaceTokens>;
}) {
  return (
    <div
      className={`rounded-[24px] border p-4 ${surface.border} ${surface.panelMuted}`}
      style={{ gridColumn: `span ${renderedSpan} / span ${renderedSpan}` }}
    >
      <div className="mb-4 flex items-center gap-3">
        <input
          type="text"
          value={title}
          onChange={(event) => onRenameSection(sectionId, event.target.value)}
          className={`min-w-0 flex-1 bg-transparent text-lg font-semibold outline-none ${surface.textPrimary}`}
        />
        <button
          type="button"
          onClick={() => onRemoveSection(sectionId)}
          className={`rounded-full border px-3 py-1.5 text-xs font-medium transition-colors ${surface.border} ${surface.textSecondary} ${surface.hoverBg}`}
        >
          Remove
        </button>
      </div>

      <SortableContext
        items={cardIds.map((cardId) => `home-card-${cardId}`)}
        strategy={rectSortingStrategy}
      >
        <HomeContainerDropZone sectionId={sectionId} cardIds={cardIds}>
          {cardIds.length > 0 ? (
            <CardGrid
              cardIds={cardIds}
              sectionId={sectionId}
              allCards={allCards}
              cardSizes={cardSizes}
              updateCardSize={updateCardSize}
              isEditMode={isEditMode}
              onUpdateCard={onUpdateCard}
              onRemoveFromLayout={onRemoveFromLayout}
              showHero={showHero}
            />
          ) : (
            <EmptyCanvas
              label="Drop cards here"
              description="Drag device cards or widgets into this section."
              surface={surface}
              compact
            />
          )}
        </HomeContainerDropZone>
      </SortableContext>
    </div>
  );
}

function SectionRowCanvas({
  row,
  sectionGridCols,
  allCards,
  cardSizes,
  updateCardSize,
  isEditMode,
  onUpdateCard,
  onRemoveFromLayout,
  showHero,
  onRenameSection,
  onRemoveSection,
  surface,
}: {
  row: Array<{
    id: string;
    title: string;
    span: HomeDashboardSectionSpan;
    cardIds: string[];
  }>;
  sectionGridCols: number;
  allCards: Map<string, DeviceWithType | CustomCard>;
  cardSizes: Record<string, CardSize>;
  updateCardSize: (id: string, size: CardSize) => void;
  isEditMode: boolean;
  onUpdateCard?: (cardId: string, data: Record<string, unknown>) => void;
  onRemoveFromLayout: (cardId: string) => void;
  showHero: boolean;
  onRenameSection: (sectionId: string, title: string) => void;
  onRemoveSection: (sectionId: string) => void;
  surface: ReturnType<typeof getThemeSurfaceTokens>;
}) {
  return (
    <div className="space-y-3">
      <div
        className="grid gap-5"
        style={
          {
            '--home-section-cols': sectionGridCols,
            gridTemplateColumns: 'repeat(var(--home-section-cols), minmax(0, 1fr))',
          } as CSSProperties
        }
      >
        {row.map((section) => (
          <SectionCanvas
            key={section.id}
            sectionId={section.id}
            title={section.title}
            renderedSpan={getRenderedSectionSpan(section.span, sectionGridCols)}
            cardIds={section.cardIds}
            allCards={allCards}
            cardSizes={cardSizes}
            updateCardSize={updateCardSize}
            isEditMode={isEditMode}
            onUpdateCard={onUpdateCard}
            onRemoveFromLayout={onRemoveFromLayout}
            showHero={showHero}
            onRenameSection={onRenameSection}
            onRemoveSection={onRemoveSection}
            surface={surface}
          />
        ))}
      </div>
    </div>
  );
}

function FlowCanvas({
  cardIds,
  allCards,
  cardSizes,
  updateCardSize,
  isEditMode,
  onUpdateCard,
  onRemoveFromLayout,
  showHero,
  surface,
}: {
  cardIds: string[];
  allCards: Map<string, DeviceWithType | CustomCard>;
  cardSizes: Record<string, CardSize>;
  updateCardSize: (id: string, size: CardSize) => void;
  isEditMode: boolean;
  onUpdateCard?: (cardId: string, data: Record<string, unknown>) => void;
  onRemoveFromLayout: (cardId: string) => void;
  showHero: boolean;
  surface: ReturnType<typeof getThemeSurfaceTokens>;
}) {
  return (
    <SortableContext
      items={cardIds.map((cardId) => `home-card-${cardId}`)}
      strategy={rectSortingStrategy}
    >
      <HomeContainerDropZone cardIds={cardIds}>
        {cardIds.length > 0 ? (
          <CardGrid
            cardIds={cardIds}
            allCards={allCards}
            cardSizes={cardSizes}
            updateCardSize={updateCardSize}
            isEditMode={isEditMode}
            onUpdateCard={onUpdateCard}
            onRemoveFromLayout={onRemoveFromLayout}
            showHero={showHero}
          />
        ) : (
          <EmptyCanvas
            label="Start with an empty canvas"
            description="Drag cards in from the library and keep only what belongs on your home view."
            surface={surface}
          />
        )}
      </HomeContainerDropZone>
    </SortableContext>
  );
}

function CardGrid({
  cardIds,
  sectionId,
  allCards,
  cardSizes,
  updateCardSize,
  isEditMode,
  onUpdateCard,
  onRemoveFromLayout,
  showHero,
  sortable = true,
}: {
  cardIds: string[];
  sectionId?: string;
  allCards: Map<string, DeviceWithType | CustomCard>;
  cardSizes: Record<string, CardSize>;
  updateCardSize: (id: string, size: CardSize) => void;
  isEditMode: boolean;
  onUpdateCard?: (cardId: string, data: Record<string, unknown>) => void;
  onRemoveFromLayout: (cardId: string) => void;
  showHero: boolean;
  sortable?: boolean;
}) {
  return (
    <div className="grid w-full grid-flow-row-dense grid-cols-2 auto-rows-[87px] gap-2 md:grid-cols-4 md:gap-3 xl:grid-cols-6 lg:gap-4 2xl:grid-cols-8">
      {cardIds.map((cardId) => {
        const entry = allCards.get(cardId);
        if (!entry) {
          return null;
        }

        const storedSize = cardSizes[cardId] ?? entry.size;
        const size = !showHero && storedSize === 'hero' ? 'large' : storedSize;
        const spanClass =
          !isCustomCard(entry) && entry.type === 'media' && size === 'large'
            ? 'col-span-1 row-span-4'
            : getCardSpanClass(size);

        return (
          <HomeCardSlot
            key={cardId}
            sortable={sortable}
            cardId={cardId}
            sectionId={sectionId}
            className={spanClass}
            content={
              !isCustomCard(entry) ? (
                <DashboardCardItem
                  id={cardId}
                  device={entry}
                  size={size}
                  isEditMode={isEditMode}
                  handleSizeChange={updateCardSize}
                  onRemoveFromLayout={onRemoveFromLayout}
                  allowHeroSizes={showHero}
                />
              ) : (
                <DashboardCardItem
                  id={cardId}
                  card={entry}
                  size={size}
                  isEditMode={isEditMode}
                  handleSizeChange={updateCardSize}
                  onUpdateCard={onUpdateCard}
                  onRemoveFromLayout={onRemoveFromLayout}
                  allowHeroSizes={showHero}
                />
              )
            }
          />
        );
      })}
    </div>
  );
}

function HomePresentation({
  flowCards,
  sectionRows,
  allCards,
  cardSizes,
  updateCardSize,
  onUpdateCard,
  showHero,
  isSectioned,
  accentColor,
  surface,
  emptyTitle,
  emptyDescription,
  onToggleEditMode,
}: {
  flowCards: string[];
  sectionRows: Array<
    Array<{
      id: string;
      title: string;
      span: HomeDashboardSectionSpan;
      cardIds: string[];
    }>
  >;
  allCards: Map<string, DeviceWithType | CustomCard>;
  cardSizes: Record<string, CardSize>;
  updateCardSize: (id: string, size: CardSize) => void;
  onUpdateCard?: (cardId: string, data: Record<string, unknown>) => void;
  showHero: boolean;
  isSectioned: boolean;
  accentColor: string;
  surface: ReturnType<typeof getThemeSurfaceTokens>;
  emptyTitle: string;
  emptyDescription: string;
  onToggleEditMode?: () => void;
}) {
  const sectionGridCols = useBreakpointCols();
  const hasCards =
    flowCards.length > 0 ||
    sectionRows.some((row) => row.some((section) => section.cardIds.length > 0));

  if (!hasCards) {
    return (
      <div className="py-4">
        <DashboardEmptyState
          title={emptyTitle}
          description={emptyDescription}
          surface={surface}
          accentColor={accentColor}
          actionLabel="Edit dashboard"
          onAction={onToggleEditMode}
          actionIcon={Wand2}
          className="mx-auto max-w-3xl"
        />
      </div>
    );
  }

  if (!isSectioned) {
    return (
      <CardGrid
        cardIds={flowCards}
        allCards={allCards}
        cardSizes={cardSizes}
        updateCardSize={updateCardSize}
        isEditMode={false}
        onUpdateCard={onUpdateCard}
        onRemoveFromLayout={() => {}}
        showHero={showHero}
        sortable={false}
      />
    );
  }

  return (
    <div className="space-y-7 md:space-y-8">
      {sectionRows.map((row) => {
        const visibleSections = row.filter((section) => section.cardIds.length > 0);
        if (visibleSections.length === 0) {
          return null;
        }

        return (
          <div
            key={row.map((section) => section.id).join(':')}
            className="grid gap-6"
            style={
              {
                '--home-section-cols': sectionGridCols,
                gridTemplateColumns: 'repeat(var(--home-section-cols), minmax(0, 1fr))',
              } as CSSProperties
            }
          >
            {visibleSections.map((section) => (
              <div
                key={section.id}
                style={{
                  gridColumn: `span ${getRenderedSectionSpan(section.span, sectionGridCols)} / span ${getRenderedSectionSpan(section.span, sectionGridCols)}`,
                }}
              >
                <div className="mb-3 flex items-center gap-3">
                  <h2
                    className={`text-sm font-semibold uppercase tracking-[0.14em] ${surface.textMuted}`}
                  >
                    {section.title}
                  </h2>
                  <div className={`h-px flex-1 ${surface.borderStrong}`} />
                </div>
                <CardGrid
                  cardIds={section.cardIds}
                  allCards={allCards}
                  cardSizes={cardSizes}
                  updateCardSize={updateCardSize}
                  isEditMode={false}
                  onUpdateCard={onUpdateCard}
                  onRemoveFromLayout={() => {}}
                  showHero={showHero}
                  sortable={false}
                />
              </div>
            ))}
          </div>
        );
      })}
      {flowCards.length > 0 ? (
        <CardGrid
          cardIds={flowCards}
          allCards={allCards}
          cardSizes={cardSizes}
          updateCardSize={updateCardSize}
          isEditMode={false}
          onUpdateCard={onUpdateCard}
          onRemoveFromLayout={() => {}}
          showHero={showHero}
          sortable={false}
        />
      ) : null}
    </div>
  );
}

function HomeContainerDropZone({
  children,
  sectionId,
  cardIds,
}: {
  children: ReactNode;
  sectionId?: string;
  cardIds: string[];
}) {
  const { setNodeRef, isOver } = useDroppable({
    id: sectionId ? `home-container-${sectionId}` : 'home-container-flow',
    data: { type: 'container', sectionId } satisfies DropMeta,
  });

  return (
    <div
      ref={setNodeRef}
      className={isOver && cardIds.length === 0 ? 'rounded-[24px] ring-1 ring-white/20' : undefined}
    >
      {children}
    </div>
  );
}

function SortableHomeCard({
  cardId,
  sectionId,
  className,
  children,
}: {
  cardId: string;
  sectionId?: string;
  className: string;
  children: ReactNode;
}) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: `home-card-${cardId}`,
    data: { source: 'home', cardId, sectionId, type: 'card' } as DragMeta & DropMeta,
  });

  return (
    <div
      ref={setNodeRef}
      style={{
        transform: CSS.Transform.toString(transform),
        transition,
      }}
      className={`${className} relative h-full ${isDragging ? 'opacity-40' : ''}`}
      data-card-id={cardId}
    >
      <button
        type="button"
        aria-label="Drag card"
        className="absolute bottom-2 left-1/2 z-50 -translate-x-1/2 cursor-grab touch-none rounded-full p-1 opacity-40 hover:opacity-80 active:cursor-grabbing"
        {...attributes}
        {...listeners}
      >
        <GripVertical className="h-4 w-4 text-white" />
      </button>
      {children}
    </div>
  );
}

function HomeCardSlot({
  sortable,
  cardId,
  sectionId,
  className,
  content,
}: {
  sortable: boolean;
  cardId: string;
  sectionId?: string;
  className: string;
  content: ReactNode;
}) {
  if (!sortable) {
    return content;
  }

  return (
    <SortableHomeCard cardId={cardId} sectionId={sectionId} className={className}>
      {content}
    </SortableHomeCard>
  );
}

function LibraryCardRow({
  card,
  surface,
  onAdd,
}: {
  card: LibraryCard;
  surface: ReturnType<typeof getThemeSurfaceTokens>;
  onAdd: () => void;
}) {
  const { attributes, listeners, setNodeRef, isDragging } = useDraggable({
    id: `library-card-${card.id}`,
    data: { source: 'library', cardId: card.id } satisfies DragMeta,
  });

  return (
    <div
      ref={setNodeRef}
      className={`flex w-full items-center gap-3 rounded-[22px] border p-3 text-left transition-colors ${surface.border} ${surface.panelMuted} ${surface.hoverBg} ${isDragging ? 'opacity-50' : ''}`}
      {...attributes}
      {...listeners}
    >
      <div className={`flex h-11 w-11 items-center justify-center rounded-2xl ${surface.subtleBg}`}>
        <GripVertical className={`h-4 w-4 ${surface.textMuted}`} />
      </div>
      <div className="min-w-0 flex-1">
        <div className={`truncate text-sm font-semibold ${surface.textPrimary}`}>{card.title}</div>
        <div className={`truncate text-xs ${surface.textSecondary}`}>
          {card.meta} · {card.subtitle}
        </div>
        <div className={`truncate text-[11px] ${surface.textMuted}`}>{card.id}</div>
      </div>
      <button
        type="button"
        onClick={(event) => {
          event.stopPropagation();
          onAdd();
        }}
        className={`rounded-full border px-3 py-1.5 text-xs font-medium transition-colors ${surface.border} ${surface.textPrimary} ${surface.hoverBg}`}
      >
        Add
      </button>
    </div>
  );
}

function ModeChip({
  active,
  icon,
  label,
  onClick,
  surface,
  accentColor,
}: {
  active: boolean;
  icon: ReactNode;
  label: string;
  onClick: () => void;
  surface: ReturnType<typeof getThemeSurfaceTokens>;
  accentColor: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`inline-flex items-center gap-2 rounded-full border px-3 py-2 text-sm font-medium transition-colors ${surface.border} ${surface.hoverBg}`}
      style={
        active
          ? {
              borderColor: `${accentColor}55`,
              backgroundColor: `${accentColor}12`,
            }
          : undefined
      }
    >
      {icon}
      <span className={surface.textPrimary}>{label}</span>
    </button>
  );
}

function EmptyCanvas({
  label,
  description,
  surface,
  compact = false,
}: {
  label: string;
  description: string;
  surface: ReturnType<typeof getThemeSurfaceTokens>;
  compact?: boolean;
}) {
  return (
    <DashboardEmptyState
      title={label}
      description={description}
      surface={surface}
      accentColor="#9fb0ff"
      compact={compact}
    />
  );
}
