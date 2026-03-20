import { memo, useCallback, useMemo, useState } from 'react';
import { useAuth } from '@/app/contexts/auth-context';
import { useHomeAssistant } from '@/app/hooks';
import { homeAssistantService } from '@/app/services/home-assistant.service';
import { homeAssistantSelectors } from '@/app/stores/selectors';
import { CameraSettingsDialog } from './camera-settings-dialog';
import type { CameraCardProps } from './types';
import { CameraCardView } from './view';

export const CameraCardContainer = memo(function CameraCardContainer({
  id,
  name,
  room,
  entityPicture: initialEntityPicture,
  size,
  onSizeChange,
  isEditMode,
}: CameraCardProps) {
  const { config } = useAuth();
  const liveEntity = useHomeAssistant(homeAssistantSelectors.entity(id));
  const entityRegistry = useHomeAssistant(homeAssistantSelectors.entityRegistry);
  const allEntities = useHomeAssistant(homeAssistantSelectors.entities);
  const [refreshKey, setRefreshKey] = useState(0);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  const liveAttrs = liveEntity?.attributes as Record<string, unknown> | undefined;
  const rawEntityPicture =
    typeof liveAttrs?.entity_picture === 'string' ? liveAttrs.entity_picture : initialEntityPicture;

  const baseSnapshotUrl = rawEntityPicture?.startsWith('/')
    ? `${config?.url ?? ''}${rawEntityPicture}`
    : rawEntityPicture;

  // Append cache-busting param so refresh forces a new frame from HA
  const snapshotUrl = baseSnapshotUrl
    ? `${baseSnapshotUrl}${baseSnapshotUrl.includes('?') ? '&' : '?'}_t=${refreshKey}`
    : undefined;

  const isUnavailable = liveEntity?.state === 'unavailable';
  const isOff = !liveEntity || isUnavailable;

  // Discover sibling entities from the same HA device (switches, selects, numbers)
  const siblingEntities = useMemo(() => {
    const deviceId = entityRegistry.find((e) => e.entity_id === id)?.device_id;
    if (!deviceId || !allEntities) return [];

    return entityRegistry
      .filter((e) => {
        if (e.device_id !== deviceId || e.entity_id === id) return false;
        const domain = e.entity_id.split('.')[0];
        return domain === 'switch' || domain === 'select' || domain === 'number';
      })
      .map((e) => ({ id: e.entity_id, entity: allEntities[e.entity_id] }))
      .filter((e) => e.entity !== undefined) as {
      id: string;
      entity: NonNullable<typeof allEntities>[string];
    }[];
  }, [id, entityRegistry, allEntities]);

  const handleRefresh = useCallback(() => {
    setRefreshKey((k) => k + 1);
  }, []);

  const handleTogglePower = useCallback(async () => {
    await homeAssistantService.updateCamera(id, isOff ? 'on' : 'off');
  }, [id, isOff]);

  return (
    <>
      <CameraCardView
        id={id}
        name={name}
        room={room}
        snapshotUrl={snapshotUrl}
        isUnavailable={isUnavailable}
        isOff={isOff}
        size={size}
        onSizeChange={onSizeChange}
        isEditMode={isEditMode}
        onRefresh={handleRefresh}
        onTogglePower={handleTogglePower}
        onOpenSettings={() => setIsSettingsOpen(true)}
      />

      {isSettingsOpen && (
        <CameraSettingsDialog
          entityId={id}
          name={name}
          room={room}
          isOpen={isSettingsOpen}
          onOpenChange={setIsSettingsOpen}
          siblingEntities={siblingEntities}
        />
      )}
    </>
  );
});
