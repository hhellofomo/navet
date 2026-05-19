import { Plus, Tv } from 'lucide-react';
import { useCallback, useMemo, useState } from 'react';
import { toast } from 'sonner';
import { useShallow } from 'zustand/react/shallow';
import { DashboardEmptyState } from '@/app/components/patterns';
import { InteractivePill } from '@/app/components/primitives/interactive-pill';
import { getThemeSurfaceTokens } from '@/app/components/shared/theme/theme-surface-tokens';
import { ALL_ROOMS_ID } from '@/app/constants/rooms';
import { AddEntityDialog, useDashboardEntitiesStore } from '@/app/features/dashboard';
import { useDevices, useEditMode, useI18n, useTheme } from '@/app/hooks';
import type { DeviceWithType } from '@/app/types/device.types';
import { EntityGrid } from './entity-grid';
import { SectionCustomizeShell } from './section-customize-shell';

export function MediaSection() {
  const { t } = useI18n();
  const { theme } = useTheme();
  const surface = getThemeSurfaceTokens(theme);
  const devices = useDevices();
  const { isEditMode, toggleEditMode } = useEditMode();
  const [isAddEntityDialogOpen, setIsAddEntityDialogOpen] = useState(false);
  const { hiddenEntityIds, hideEntity, showEntity } = useDashboardEntitiesStore(
    useShallow((state) => ({
      hiddenEntityIds: state.hiddenEntityIds,
      hideEntity: state.hideEntity,
      showEntity: state.showEntity,
    }))
  );
  const hiddenEntityIdSet = useMemo(() => new Set(hiddenEntityIds), [hiddenEntityIds]);
  const allMediaDevices = useMemo(
    () => devices.media.map((d) => ({ ...d, type: 'media' as const })),
    [devices.media]
  );
  const allMediaDeviceMap = useMemo(
    () => new Map(allMediaDevices.map((device) => [device.id, device])),
    [allMediaDevices]
  );
  const hiddenMediaEntityIds = useMemo(
    () =>
      allMediaDevices
        .filter((device) => hiddenEntityIdSet.has(device.id))
        .map((device) => device.id),
    [allMediaDevices, hiddenEntityIdSet]
  );
  const mediaDevices = useMemo(
    () => allMediaDevices.filter((device) => !hiddenEntityIdSet.has(device.id)),
    [allMediaDevices, hiddenEntityIdSet]
  );
  const handleRemoveEntity = useCallback(
    (entityId: string) => {
      hideEntity(entityId);
      toast.success(t('dashboard.feedback.entityRemoved'), {
        id: 'dashboard-entity-removed',
      });
    },
    [hideEntity, t]
  );
  const handleAddEntity = useCallback(
    (entityId: string) => {
      showEntity(entityId);
      toast.success(t('dashboard.feedback.entityAdded'));
    },
    [showEntity, t]
  );
  const openAddEntityDialog = useCallback(() => setIsAddEntityDialogOpen(true), []);
  const closeAddEntityDialog = useCallback(() => setIsAddEntityDialogOpen(false), []);

  const playerType = t('media.type.player');
  const speakerType = t('media.type.speaker');
  const receiverType = t('media.type.receiver');
  const soundbarType = t('media.type.soundbar');
  const tvType = t('media.type.tv');
  const audioTitle = t('sections.media.audio.title');
  const audioSingular = t('sections.media.audio.singular');
  const audioPlural = t('sections.media.audio.plural');
  const tvTitle = t('sections.media.tv.title');
  const tvSingular = t('sections.media.tv.singular');
  const tvPlural = t('sections.media.tv.plural');

  const sections = useMemo(() => {
    const audioTypes = new Set([playerType, speakerType, receiverType, soundbarType]);
    const audioDevices: DeviceWithType[] = [];
    const tvDevices: DeviceWithType[] = [];
    const otherGroups = new Map<string, DeviceWithType[]>();

    for (const device of mediaDevices) {
      const typeLabel =
        typeof device.entityType === 'string' && device.entityType.trim()
          ? device.entityType
          : playerType;

      if (audioTypes.has(typeLabel)) {
        audioDevices.push(device);
        continue;
      }

      if (typeLabel === tvType) {
        tvDevices.push(device);
        continue;
      }

      const existing = otherGroups.get(typeLabel);
      if (existing) {
        existing.push(device);
      } else {
        otherGroups.set(typeLabel, [device]);
      }
    }

    const groupedSections: Array<{
      key: string;
      title: string;
      singularLabel: string;
      pluralLabel: string;
      devices: DeviceWithType[];
    }> = [];

    if (audioDevices.length > 0) {
      groupedSections.push({
        key: 'audio',
        title: audioTitle,
        singularLabel: audioSingular,
        pluralLabel: audioPlural,
        devices: audioDevices,
      });
    }

    if (tvDevices.length > 0) {
      groupedSections.push({
        key: 'tv',
        title: tvTitle,
        singularLabel: tvSingular,
        pluralLabel: tvPlural,
        devices: tvDevices,
      });
    }

    for (const [label, groupedDevices] of otherGroups) {
      const groupTitle = groupedDevices.length > 1 ? `${label}s` : label;

      groupedSections.push({
        key: label,
        title: groupTitle,
        singularLabel: label,
        pluralLabel: groupTitle,
        devices: groupedDevices,
      });
    }

    return groupedSections;
  }, [
    audioPlural,
    audioSingular,
    audioTitle,
    mediaDevices,
    playerType,
    receiverType,
    soundbarType,
    speakerType,
    tvPlural,
    tvSingular,
    tvTitle,
    tvType,
  ]);

  if (allMediaDevices.length === 0) {
    return (
      <div className="flex h-full items-center justify-center p-6">
        <DashboardEmptyState
          icon={Tv}
          title={t('sections.media.emptyTitle')}
          description={t('sections.media.emptyDescription')}
          className="w-full max-w-md"
        />
      </div>
    );
  }

  const addHiddenEntityAction =
    isEditMode && hiddenMediaEntityIds.length > 0 ? (
      <InteractivePill
        intent="action"
        size="small"
        onClick={openAddEntityDialog}
        className={`${surface.subtleBg} ${surface.hoverBg}`}
      >
        <Plus className={`h-4 w-4 ${surface.textSecondary}`} />
        <span className={`hidden text-sm font-medium md:inline ${surface.textSecondary}`}>
          {t('dashboard.addEntity.title')}
        </span>
      </InteractivePill>
    ) : null;

  return (
    <SectionCustomizeShell
      isEditMode={isEditMode}
      onToggle={toggleEditMode}
      className="relative space-y-8"
      actions={addHiddenEntityAction}
    >
      {sections.length > 0 ? (
        sections.map((section) => (
          <EntityGrid
            key={section.key}
            devices={section.devices}
            rawDevices={devices}
            title={section.title}
            singularLabel={section.singularLabel}
            pluralLabel={section.pluralLabel}
            isEditMode={isEditMode}
            cardSizeStorageKey="mediaSectionCardSizes"
            onRemoveEntity={handleRemoveEntity}
            allowEntityRemoval
            usesHideAction
          />
        ))
      ) : (
        <div className="flex h-full items-center justify-center p-6 pt-14">
          <DashboardEmptyState
            icon={Tv}
            title={t('sections.media.emptyTitle')}
            description={t('dashboard.addEntity.descriptionWithHidden')}
            actionIcon={Plus}
            actionLabel={t('dashboard.addEntity.title')}
            onAction={openAddEntityDialog}
            className="w-full max-w-md"
          />
        </div>
      )}

      {isAddEntityDialogOpen ? (
        <AddEntityDialog
          open={isAddEntityDialogOpen}
          onClose={closeAddEntityDialog}
          onAddEntity={handleAddEntity}
          currentRoom={ALL_ROOMS_ID}
          deviceMap={allMediaDeviceMap}
          addedEntityIds={[]}
          visibleEntityIds={hiddenMediaEntityIds}
          title={t('dashboard.addEntity.title')}
          description={t('dashboard.addEntity.descriptionWithHidden')}
          actionLabel={t('dashboard.addEntity.action')}
        />
      ) : null}
    </SectionCustomizeShell>
  );
}
