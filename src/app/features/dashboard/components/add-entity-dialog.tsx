import { Search, X } from 'lucide-react';
import { useMemo, useState } from 'react';
import { getDeviceTypeLabel } from '@/app/constants/device-type-labels';
import { useTheme } from '@/app/hooks';
import type { DeviceWithType } from '@/app/types/device.types';
import { getDeviceRoomLabel } from '@/app/utils/device-location';
import { getThemeColorValue } from '@/app/utils/theme-colors';

interface AddEntityDialogProps {
  open: boolean;
  onClose: () => void;
  onAddEntity: (entityId: string) => void;
  currentRoom: string;
  deviceMap: Map<string, DeviceWithType>;
  addedEntityIds: string[];
}

export function AddEntityDialog({
  open,
  onClose,
  onAddEntity,
  currentRoom,
  deviceMap,
  addedEntityIds,
}: AddEntityDialogProps) {
  const { theme, primaryColor } = useTheme();
  const [query, setQuery] = useState('');

  const bgColor = theme === 'light' ? 'bg-white' : 'bg-gray-900';
  const textColor = theme === 'light' ? 'text-gray-900' : 'text-white';
  const mutedColor = theme === 'light' ? 'text-gray-600' : 'text-gray-300';
  const borderColor = theme === 'light' ? 'border-gray-200' : 'border-white/10';
  const cardBg = theme === 'light' ? 'bg-gray-50' : 'bg-white/5';
  const hoverBg = theme === 'light' ? 'hover:bg-gray-100' : 'hover:bg-white/10';
  const inputBg = theme === 'light' ? 'bg-gray-100' : 'bg-white/5';

  const availableDevices = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();

    return Array.from(deviceMap.values())
      .filter((device) => !addedEntityIds.includes(device.id))
      .filter((device) => currentRoom === 'All' || getDeviceRoomLabel(device) === currentRoom)
      .filter((device) => {
        if (!normalizedQuery) {
          return true;
        }

        const label = typeof device.name === 'string' ? device.name : device.id;
        const room = getDeviceRoomLabel(device);
        const type = getDeviceTypeLabel(device.type);

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
  }, [addedEntityIds, currentRoom, deviceMap, query]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div
        className={`${bgColor} rounded-2xl border ${borderColor} w-full max-w-2xl max-h-[80vh] overflow-hidden`}
        style={{ boxShadow: '0 20px 60px rgba(0, 0, 0, 0.3)' }}
      >
        <div className="flex items-center justify-between p-6 border-b border-white/10">
          <div>
            <h2 className={`text-xl font-semibold ${textColor}`}>Add Entity</h2>
            <p className={`text-sm ${mutedColor} mt-1`}>
              {currentRoom === 'All'
                ? 'Choose which Home Assistant entities should appear on the dashboard'
                : `Choose entities for ${currentRoom}`}
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
              placeholder="Search entities"
              className={`w-full rounded-xl border ${borderColor} ${inputBg} pl-10 pr-4 py-3 text-sm ${textColor} focus:outline-none`}
              style={{ caretColor: getThemeColorValue(primaryColor) }}
            />
          </div>
        </div>

        <div className="max-h-[420px] overflow-y-auto p-6 pt-4 space-y-3">
          {availableDevices.length > 0 ? (
            availableDevices.map((device) => {
              const name = typeof device.name === 'string' ? device.name : device.id;
              const room = getDeviceRoomLabel(device);
              const typeLabel = getDeviceTypeLabel(device.type);

              return (
                <div
                  key={device.id}
                  className={`flex items-center justify-between gap-4 rounded-xl border ${borderColor} ${cardBg} p-4`}
                >
                  <div className="min-w-0">
                    <p className={`text-sm font-medium ${textColor} truncate`}>{name}</p>
                    <p className={`text-xs ${mutedColor} truncate mt-1`}>
                      {typeLabel} · {room}
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => onAddEntity(device.id)}
                    className="px-3 py-2 rounded-lg text-xs font-medium text-white"
                    style={{ backgroundColor: getThemeColorValue(primaryColor) }}
                  >
                    Add
                  </button>
                </div>
              );
            })
          ) : (
            <div className={`rounded-xl border ${borderColor} ${cardBg} p-8 text-center`}>
              <p className={`text-sm font-medium ${textColor}`}>No entities available</p>
              <p className={`text-xs ${mutedColor} mt-2`}>
                Try another search or switch to a different room.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
