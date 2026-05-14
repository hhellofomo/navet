import type { HassEntities } from 'home-assistant-js-websocket';
import { getName, resolveEntityRoom } from '@/app/hooks/ha-entity-utils';
import type {
  HomeAssistantAreaRegistryEntry,
  HomeAssistantDeviceRegistryEntry,
  HomeAssistantEntityRegistryEntry,
} from '@/app/services/home-assistant.service';
import type { AutomationRoutine, QuickActionRoutine, TaskRoutineData } from '../types';
import { mapAutomationTasks } from './map-automation-tasks';

interface MapTaskRoutinesOptions {
  entities: HassEntities | null;
  areas: HomeAssistantAreaRegistryEntry[];
  deviceRegistry: HomeAssistantDeviceRegistryEntry[];
  entityRegistry: HomeAssistantEntityRegistryEntry[];
  locale?: string;
}

function createRegistryRoomMaps({
  areas,
  deviceRegistry,
  entityRegistry,
}: Pick<MapTaskRoutinesOptions, 'areas' | 'deviceRegistry' | 'entityRegistry'>) {
  const areaMap = new Map(areas.map((area) => [area.area_id, area.name]));
  const entityRegistryMap = new Map(
    entityRegistry.map((entry) => [
      entry.entity_id,
      { area_id: entry.area_id, device_id: entry.device_id },
    ])
  );
  const deviceRegistryMap = new Map(
    deviceRegistry.map((entry) => [entry.id, { area_id: entry.area_id }])
  );

  return { areaMap, entityRegistryMap, deviceRegistryMap };
}

export function mapTaskRoutines({
  entities,
  areas,
  deviceRegistry,
  entityRegistry,
  locale,
}: MapTaskRoutinesOptions): TaskRoutineData {
  if (!entities) {
    return { automations: [], quickActions: [] };
  }

  const { areaMap, entityRegistryMap, deviceRegistryMap } = createRegistryRoomMaps({
    areas,
    deviceRegistry,
    entityRegistry,
  });

  const automations: AutomationRoutine[] = mapAutomationTasks({
    entities,
    areas,
    deviceRegistry,
    entityRegistry,
    locale,
  }).map((task) => ({ ...task, type: 'automation' }));

  const quickActions: QuickActionRoutine[] = Object.entries(entities)
    .filter(([entityId]) => entityId.startsWith('scene.') || entityId.startsWith('script.'))
    .map(([entityId, entity]) => {
      const type: QuickActionRoutine['type'] = entityId.startsWith('scene.') ? 'scene' : 'script';

      return {
        id: entityId,
        type,
        name: getName(entity),
        room: resolveEntityRoom(entityId, entity, areaMap, entityRegistryMap, deviceRegistryMap),
        state: entity.state,
      };
    })
    .sort((left, right) => {
      if (left.type !== right.type) {
        return left.type === 'scene' ? -1 : 1;
      }

      return left.name.localeCompare(right.name, locale, { sensitivity: 'base' });
    });

  return { automations, quickActions };
}
