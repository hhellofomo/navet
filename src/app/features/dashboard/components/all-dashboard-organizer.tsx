import { Grid2X2, LayoutDashboard, Plus, Sparkles, Wand2 } from 'lucide-react';
import { memo, useMemo } from 'react';
import type { CardSize } from '@/app/components/shared/card-size-selector';
import { getThemeSurfaceTokens } from '@/app/components/shared/theme/theme-surface-tokens';
import { useI18n, useTheme } from '@/app/hooks';
import type { DeviceWithType } from '@/app/types/device.types';
import { RoomSection } from '../all-view-grid/room-section';
import type { AllViewGrouping } from '../all-view-grid/types';
import { useAllViewGrid } from '../all-view-grid/use-all-view-grid';
import type { CustomCard } from '../stores/custom-cards-store';
import { cardTemplates } from './add-card-dialog/templates';
import type { CardType } from './add-card-dialog/types';
import { DashboardCardItem } from './dashboard-card-item';

interface AllDashboardOrganizerProps {
  deviceMap: Map<string, DeviceWithType>;
  rooms: string[];
  cardOrders: Record<string, string[]>;
  isEditMode: boolean;
  cardSizes: Record<string, CardSize>;
  updateCardSize: (id: string, size: CardSize) => void;
  grouping: AllViewGrouping;
  customCards: CustomCard[];
  hiddenEntityCount: number;
  onDeleteCard?: (cardId: string) => void;
  onUpdateCard?: (cardId: string, data: Record<string, unknown>) => void;
  onRemoveEntity?: (entityId: string) => void;
  allowEntityRemoval?: boolean;
  usesHideAction?: boolean;
  onOpenAddCardDialog?: () => void;
  onOpenAddEntityDialog?: () => void;
  onQuickAddCard: (type: CardType, size: CardSize) => void;
  onToggleEditMode: () => void;
  onGroupingChange: (grouping: AllViewGrouping) => void;
}

export const AllDashboardOrganizer = memo(function AllDashboardOrganizer({
  deviceMap,
  rooms,
  cardOrders,
  isEditMode,
  cardSizes,
  updateCardSize,
  grouping,
  customCards,
  hiddenEntityCount,
  onDeleteCard,
  onUpdateCard,
  onRemoveEntity,
  allowEntityRemoval = false,
  usesHideAction = false,
  onOpenAddCardDialog,
  onOpenAddEntityDialog,
  onQuickAddCard,
  onToggleEditMode,
  onGroupingChange,
}: AllDashboardOrganizerProps) {
  const { t } = useI18n();
  const { theme, accentColor } = useTheme();
  const surface = getThemeSurfaceTokens(theme);
  const { customCardMap, handleSizeChange, roomSections } = useAllViewGrid({
    cardOrders,
    customCards,
    deviceMap,
    grouping,
    rooms,
    updateCardSize,
  });

  const homescreenCards = useMemo(
    () => customCards.filter((card) => card.room === 'All'),
    [customCards]
  );

  const homescreenCardIds = useMemo(() => {
    const validCardIds = new Set(homescreenCards.map((card) => card.id));
    const orderedHomeIds = (cardOrders.All ?? []).filter((id) => validCardIds.has(id));
    const missingIds = homescreenCards
      .map((card) => card.id)
      .filter((id) => !orderedHomeIds.includes(id));
    return [...orderedHomeIds, ...missingIds];
  }, [cardOrders.All, homescreenCards]);

  const deviceSections = useMemo(
    () =>
      roomSections
        .map((section) => {
          const orderedIds = section.orderedIds.filter((id) => !customCardMap.has(id));
          return {
            ...section,
            orderedIds,
            totalItems: orderedIds.length,
          };
        })
        .filter((section) => section.totalItems > 0),
    [customCardMap, roomSections]
  );

  const summaryItems = [
    { label: t('dashboard.organizer.stats.homescreenCards'), value: homescreenCards.length },
    { label: t('dashboard.organizer.stats.devices'), value: deviceMap.size },
    { label: t('dashboard.organizer.stats.rooms'), value: rooms.length },
    { label: t('dashboard.organizer.stats.hidden'), value: hiddenEntityCount },
  ];

  const groupingOptions: Array<{ value: AllViewGrouping; label: string }> = [
    { value: 'custom', label: t('dashboard.roomNav.grouping.custom') },
    { value: 'room', label: t('dashboard.roomNav.grouping.room') },
    { value: 'type', label: t('dashboard.roomNav.grouping.type') },
    { value: 'none', label: t('dashboard.roomNav.grouping.none') },
  ];

  const primaryButtonStyle = {
    background: `linear-gradient(135deg, ${accentColor}, ${accentColor}cc)`,
    boxShadow: `0 20px 44px -24px ${accentColor}88`,
  };

  return (
    <div className="space-y-6 md:space-y-8">
      <section
        className={`relative overflow-hidden rounded-[28px] border p-5 md:p-7 ${surface.border} ${surface.panel} ${surface.cardShadow}`}
      >
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 opacity-90"
          style={{
            background: `radial-gradient(circle at top left, ${accentColor}30, transparent 34%), radial-gradient(circle at bottom right, ${accentColor}14, transparent 28%)`,
          }}
        />

        <div className="relative grid gap-6 xl:grid-cols-[minmax(0,1.35fr)_22rem] xl:items-start">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/6 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.2em] text-white/72">
              <Sparkles className="h-3.5 w-3.5" />
              {t('dashboard.organizer.eyebrow')}
            </div>

            <h1
              className={`mt-4 max-w-3xl text-2xl font-semibold tracking-tight md:text-4xl ${surface.textPrimary}`}
            >
              {t('dashboard.organizer.title')}
            </h1>
            <p className={`mt-3 max-w-2xl text-sm leading-6 md:text-base ${surface.textSecondary}`}>
              {t('dashboard.organizer.description')}
            </p>

            <div className="mt-5 flex flex-wrap gap-3">
              <button
                type="button"
                onClick={onOpenAddCardDialog}
                className="inline-flex items-center gap-2 rounded-full px-4 py-2.5 text-sm font-semibold text-white transition-transform hover:scale-[1.01] active:scale-[0.99]"
                style={primaryButtonStyle}
              >
                <Plus className="h-4 w-4" />
                {t('dashboard.roomNav.addCard')}
              </button>

              <button
                type="button"
                onClick={onOpenAddEntityDialog}
                className={`inline-flex items-center gap-2 rounded-full border px-4 py-2.5 text-sm font-medium transition-colors ${surface.border} ${surface.textPrimary} ${surface.hoverBg}`}
              >
                <LayoutDashboard className="h-4 w-4" />
                {t('dashboard.addEntity.title')}
              </button>

              <button
                type="button"
                onClick={onToggleEditMode}
                className={`inline-flex items-center gap-2 rounded-full border px-4 py-2.5 text-sm font-medium transition-colors ${surface.border} ${surface.textPrimary} ${surface.hoverBg}`}
              >
                <Wand2 className="h-4 w-4" />
                {isEditMode ? t('dashboard.roomNav.doneEditing') : t('dashboard.roomNav.customize')}
              </button>
            </div>
          </div>

          <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-1">
            {summaryItems.map((item) => (
              <div
                key={item.label}
                className={`rounded-[22px] border px-4 py-4 ${surface.border} ${surface.panelMuted}`}
              >
                <div className={`text-xs uppercase tracking-[0.18em] ${surface.textMuted}`}>
                  {item.label}
                </div>
                <div className={`mt-2 text-3xl font-semibold ${surface.textPrimary}`}>
                  {item.value}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section
        className={`rounded-[28px] border p-5 md:p-6 ${surface.border} ${surface.panel} ${surface.cardShadow}`}
      >
        <div className="flex flex-col gap-2 md:flex-row md:items-end md:justify-between">
          <div>
            <h2 className={`text-xl font-semibold ${surface.textPrimary}`}>
              {t('dashboard.organizer.quickAddTitle')}
            </h2>
            <p className={`mt-1 text-sm ${surface.textSecondary}`}>
              {t('dashboard.organizer.quickAddDescription')}
            </p>
          </div>

          <button
            type="button"
            onClick={onOpenAddCardDialog}
            className={`inline-flex items-center gap-2 rounded-full border px-4 py-2 text-sm font-medium transition-colors ${surface.border} ${surface.textPrimary} ${surface.hoverBg}`}
          >
            <Grid2X2 className="h-4 w-4" />
            {t('dashboard.organizer.openLibrary')}
          </button>
        </div>

        <div className="mt-5 grid gap-3 md:grid-cols-2 xl:grid-cols-5">
          {cardTemplates.map((template) => (
            <button
              key={template.id}
              type="button"
              onClick={() => onQuickAddCard(template.id, template.defaultSize)}
              className={`group rounded-[22px] border p-4 text-left transition-all ${surface.border} ${surface.panelMuted} ${surface.hoverBg}`}
            >
              <div
                className="flex h-11 w-11 items-center justify-center rounded-2xl text-white"
                style={{ backgroundColor: `${accentColor}22`, color: accentColor }}
              >
                {template.icon}
              </div>
              <div className={`mt-4 text-sm font-semibold ${surface.textPrimary}`}>
                {t(template.nameKey)}
              </div>
              <p className={`mt-1 text-xs leading-relaxed ${surface.textSecondary}`}>
                {t(template.descriptionKey)}
              </p>
              <div
                className={`mt-4 inline-flex items-center gap-2 text-xs font-medium ${surface.textSubtle}`}
              >
                <Plus className="h-3.5 w-3.5" />
                {t('dashboard.organizer.addThisCard')}
              </div>
            </button>
          ))}
        </div>
      </section>

      <section
        className={`rounded-[28px] border p-5 md:p-6 ${surface.border} ${surface.panel} ${surface.cardShadow}`}
      >
        <div className="flex flex-col gap-2 md:flex-row md:items-end md:justify-between">
          <div>
            <h2 className={`text-xl font-semibold ${surface.textPrimary}`}>
              {t('dashboard.organizer.homescreenTitle')}
            </h2>
            <p className={`mt-1 text-sm ${surface.textSecondary}`}>
              {t('dashboard.organizer.homescreenDescription')}
            </p>
          </div>

          <button
            type="button"
            onClick={onOpenAddCardDialog}
            className={`inline-flex items-center gap-2 rounded-full border px-4 py-2 text-sm font-medium transition-colors ${surface.border} ${surface.textPrimary} ${surface.hoverBg}`}
          >
            <Plus className="h-4 w-4" />
            {t('dashboard.organizer.addHomescreenCard')}
          </button>
        </div>

        {homescreenCardIds.length > 0 ? (
          <div className="mt-5 grid w-full grid-flow-row-dense grid-cols-2 auto-rows-[87px] gap-2 md:grid-cols-4 md:gap-3 xl:grid-cols-6 lg:gap-4 2xl:grid-cols-8">
            {homescreenCardIds.map((id) => {
              const card = customCardMap.get(id);
              if (!card) {
                return null;
              }

              const size = cardSizes[card.id] || card.size;

              return (
                <DashboardCardItem
                  key={card.id}
                  id={card.id}
                  card={card}
                  size={size}
                  isEditMode={isEditMode}
                  handleSizeChange={handleSizeChange}
                  onDeleteCard={onDeleteCard}
                  onUpdateCard={onUpdateCard}
                />
              );
            })}
          </div>
        ) : (
          <div
            className={`mt-5 rounded-[24px] border border-dashed p-8 text-center ${surface.borderStrong} ${surface.panelMuted}`}
          >
            <div
              className="mx-auto flex h-14 w-14 items-center justify-center rounded-3xl"
              style={{ backgroundColor: `${accentColor}18`, color: accentColor }}
            >
              <LayoutDashboard className="h-6 w-6" />
            </div>
            <h3 className={`mt-4 text-lg font-semibold ${surface.textPrimary}`}>
              {t('dashboard.organizer.homescreenEmptyTitle')}
            </h3>
            <p className={`mx-auto mt-2 max-w-xl text-sm leading-6 ${surface.textSecondary}`}>
              {t('dashboard.organizer.homescreenEmptyDescription')}
            </p>
            <div className="mt-5 flex flex-wrap justify-center gap-3">
              <button
                type="button"
                onClick={onOpenAddCardDialog}
                className="inline-flex items-center gap-2 rounded-full px-4 py-2.5 text-sm font-semibold text-white"
                style={primaryButtonStyle}
              >
                <Plus className="h-4 w-4" />
                {t('dashboard.roomNav.addCard')}
              </button>
              <button
                type="button"
                onClick={() => onQuickAddCard('note', 'small')}
                className={`inline-flex items-center gap-2 rounded-full border px-4 py-2.5 text-sm font-medium transition-colors ${surface.border} ${surface.textPrimary} ${surface.hoverBg}`}
              >
                <Sparkles className="h-4 w-4" />
                {t('dashboard.organizer.startWithNote')}
              </button>
            </div>
          </div>
        )}
      </section>

      <section
        className={`rounded-[28px] border p-5 md:p-6 ${surface.border} ${surface.panel} ${surface.cardShadow}`}
      >
        <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <h2 className={`text-xl font-semibold ${surface.textPrimary}`}>
              {t('dashboard.organizer.deviceLibraryTitle')}
            </h2>
            <p className={`mt-1 text-sm ${surface.textSecondary}`}>
              {t('dashboard.organizer.deviceLibraryDescription')}
            </p>
          </div>

          <div className="flex flex-wrap gap-2">
            {groupingOptions.map((option) => {
              const isActive = grouping === option.value;
              return (
                <button
                  type="button"
                  key={option.value}
                  onClick={() => onGroupingChange(option.value)}
                  className={`rounded-full border px-3.5 py-2 text-sm font-medium transition-all ${surface.border} ${isActive ? 'text-white shadow-sm' : `${surface.textSecondary} ${surface.hoverBg}`}`}
                  style={
                    isActive
                      ? { backgroundColor: accentColor, borderColor: accentColor }
                      : undefined
                  }
                >
                  {option.label}
                </button>
              );
            })}
          </div>
        </div>

        {deviceSections.length > 0 ? (
          <div className="mt-6 space-y-8">
            {deviceSections.map((section) => (
              <RoomSection
                key={section.key}
                title={section.title}
                orderedIds={section.orderedIds}
                totalItems={section.totalItems}
                mutedTitle={section.mutedTitle}
                showHeader={section.showHeader}
                textColor={surface.textPrimary}
                textSecondary={surface.textSecondary}
                isEditMode={isEditMode}
                cardSizes={cardSizes}
                deviceMap={deviceMap}
                customCardMap={customCardMap}
                handleSizeChange={handleSizeChange}
                onDeleteCard={onDeleteCard}
                onUpdateCard={onUpdateCard}
                onRemoveEntity={onRemoveEntity}
                allowEntityRemoval={allowEntityRemoval}
                usesHideAction={usesHideAction}
              />
            ))}
          </div>
        ) : (
          <div
            className={`mt-5 rounded-[24px] border border-dashed p-8 text-center ${surface.borderStrong} ${surface.panelMuted}`}
          >
            <h3 className={`text-lg font-semibold ${surface.textPrimary}`}>
              {t('dashboard.organizer.deviceLibraryEmptyTitle')}
            </h3>
            <p className={`mx-auto mt-2 max-w-xl text-sm leading-6 ${surface.textSecondary}`}>
              {t('dashboard.organizer.deviceLibraryEmptyDescription')}
            </p>
            {onOpenAddEntityDialog ? (
              <button
                type="button"
                onClick={onOpenAddEntityDialog}
                className={`mt-5 inline-flex items-center gap-2 rounded-full border px-4 py-2.5 text-sm font-medium transition-colors ${surface.border} ${surface.textPrimary} ${surface.hoverBg}`}
              >
                <Plus className="h-4 w-4" />
                {t('dashboard.addEntity.title')}
              </button>
            ) : null}
          </div>
        )}
      </section>
    </div>
  );
});
