import { Search, X } from 'lucide-react';
import { useEffect, useMemo, useRef, useState } from 'react';
import { EntityRoomSelector } from '@/app/components/shared/entity-room-selector';
import { getThemeColorValue } from '@/app/components/shared/theme/theme-colors';
import { getThemeSurfaceTokens } from '@/app/components/shared/theme/theme-surface-tokens';
import { getDeviceTypeLabel } from '@/app/constants/device-type-labels';
import { useI18n, useTheme } from '@/app/hooks';
import { getDeviceRoomLabel } from '@/app/utils/device-location';
import { ENTITY_LIST_HEIGHT, ENTITY_LIST_OVERSCAN, ENTITY_ROW_HEIGHT } from './constants';
import type { AddEntityDialogProps } from './types';

export function AddEntityDialog({
  open,
  onClose,
  onAddEntity,
  currentRoom,
  deviceMap,
  addedEntityIds,
  visibleEntityIds,
  title = 'Add Entity',
  description,
  actionLabel = 'Add',
}: AddEntityDialogProps) {
  const { t } = useI18n();
  const { theme, primaryColor } = useTheme();
  const surface = getThemeSurfaceTokens(theme);
  const [query, setQuery] = useState('');
  const [scrollTop, setScrollTop] = useState(0);
  const listRef = useRef<HTMLDivElement | null>(null);

  const bgColor = theme === 'light' ? 'bg-white' : surface.panel;
  const textColor = surface.textPrimary;
  const mutedColor = surface.textSecondary;
  const borderColor = surface.border;
  const cardBg = surface.panelMuted;
  const hoverBg = surface.hoverBg;
  const inputBg = surface.inputBg;

  const availableDevices = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();
    const visibleIdSet = visibleEntityIds ? new Set(visibleEntityIds) : null;

    return Array.from(deviceMap.values())
      .filter((device) => (visibleIdSet ? visibleIdSet.has(device.id) : true))
      .filter((device) => !addedEntityIds.includes(device.id))
      .filter((device) => currentRoom === 'All' || getDeviceRoomLabel(device) === currentRoom)
      .filter((device) => {
        if (!normalizedQuery) {
          return true;
        }

        const label = typeof device.name === 'string' ? device.name : device.id;
        const room = getDeviceRoomLabel(device);
        const type = getDeviceTypeLabel(device.type, t);

        return `${label} ${room} ${type}`.toLowerCase().includes(normalizedQuery);
      })
      .sort((left, right) => {
        const leftRoom = getDeviceRoomLabel(left);
        const rightRoom = getDeviceRoomLabel(right);
        const roomComparison = leftRoom.localeCompare(rightRoom);

        if (roomComparison !== 0) {
          return roomComparison;
        }

        const leftName = typeof left.name === 'string' ? left.name : left.id;
        const rightName = typeof right.name === 'string' ? right.name : right.id;
        return leftName.localeCompare(rightName);
      });
  }, [addedEntityIds, currentRoom, deviceMap, query, t, visibleEntityIds]);

  const listResetKey = `${open}:${currentRoom}:${query}:${visibleEntityIds?.join(',') ?? ''}`;

  // biome-ignore lint/correctness/useExhaustiveDependencies: this effect intentionally resets virtualization state when the list identity changes
  useEffect(() => {
    setScrollTop(0);
    listRef.current?.scrollTo({ top: 0 });
  }, [listResetKey]);

  const visibleCount = Math.ceil(ENTITY_LIST_HEIGHT / ENTITY_ROW_HEIGHT);
  const startIndex = Math.max(0, Math.floor(scrollTop / ENTITY_ROW_HEIGHT) - ENTITY_LIST_OVERSCAN);
  const endIndex = Math.min(
    availableDevices.length,
    startIndex + visibleCount + ENTITY_LIST_OVERSCAN * 2
  );
  const virtualDevices = availableDevices.slice(startIndex, endIndex);
  const topSpacerHeight = startIndex * ENTITY_ROW_HEIGHT;
  const totalHeight = availableDevices.length * ENTITY_ROW_HEIGHT;

  if (!open) return null;

  return (
    <div
      className={`fixed inset-0 z-50 flex items-center justify-center p-4 ${surface.dialogBackdrop}`}
    >
      <div
        className={`${bgColor} rounded-2xl border ${borderColor} w-full max-w-2xl max-h-[80vh] overflow-hidden`}
        style={{ boxShadow: '0 20px 60px rgba(0, 0, 0, 0.3)' }}
      >
        <div className="flex items-center justify-between p-6 border-b border-white/10">
          <div>
            <h2 className={`text-xl font-semibold ${textColor}`}>{title}</h2>
            <p className={`text-sm ${mutedColor} mt-1`}>
              {description ??
                (currentRoom === 'All'
                  ? t('dashboard.addEntity.defaultDescriptionAll')
                  : t('dashboard.addEntity.defaultDescriptionRoom', { room: currentRoom }))}
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className={`w-8 h-8 rounded-full ${cardBg} ${hoverBg} flex items-center justify-center transition-colors`}
          >
            <X className={`w-4 h-4 ${mutedColor}`} />
          </button>
        </div>

        <div className="p-6 border-b border-white/10">
          <div className="relative">
            <Search className={`absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 ${mutedColor}`} />
            <input
              type="text"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder={t('dashboard.addEntity.searchPlaceholder')}
              className={`w-full rounded-xl border ${borderColor} ${inputBg} pl-10 pr-4 py-3 text-sm ${textColor} focus:outline-none`}
              style={{ caretColor: getThemeColorValue(primaryColor) }}
            />
          </div>
        </div>

        <div
          ref={listRef}
          className="overflow-y-auto p-6 pt-4"
          style={{ maxHeight: `${ENTITY_LIST_HEIGHT}px` }}
          onScroll={(event) => setScrollTop(event.currentTarget.scrollTop)}
        >
          {availableDevices.length > 0 ? (
            <div className="relative" style={{ height: totalHeight || ENTITY_LIST_HEIGHT }}>
              <div
                className="absolute inset-x-0 top-0 space-y-3"
                style={{ transform: `translateY(${topSpacerHeight}px)` }}
              >
                {virtualDevices.map((device) => {
                  const name = typeof device.name === 'string' ? device.name : device.id;
                  const room = getDeviceRoomLabel(device);
                  const typeLabel = getDeviceTypeLabel(device.type, t);

                  return (
                    <div
                      key={device.id}
                      className={`flex h-[76px] items-center justify-between gap-4 rounded-xl border ${borderColor} ${cardBg} p-4`}
                    >
                      <div className="min-w-0">
                        <p className={`text-sm font-medium ${textColor} truncate`}>{name}</p>
                        <p className={`text-xs ${mutedColor} truncate mt-1`}>
                          {typeLabel} · {room}
                        </p>
                      </div>
                      <div className="flex items-center gap-2">
                        <EntityRoomSelector
                          entityId={device.id}
                          label={t('dashboard.addEntity.roomLabel')}
                          compact
                        />
                        <button
                          type="button"
                          onClick={() => onAddEntity(device.id)}
                          className="px-3 py-2 rounded-lg text-xs font-medium text-white"
                          style={{ backgroundColor: getThemeColorValue(primaryColor) }}
                        >
                          {actionLabel}
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ) : (
            <div className={`rounded-xl border ${borderColor} ${cardBg} p-8 text-center`}>
              <p className={`text-sm font-medium ${textColor}`}>
                {t('dashboard.addEntity.emptyTitle')}
              </p>
              <p className={`text-xs ${mutedColor} mt-2`}>
                {visibleEntityIds
                  ? t('dashboard.addEntity.emptyHidden')
                  : t('dashboard.addEntity.emptyDefault')}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
