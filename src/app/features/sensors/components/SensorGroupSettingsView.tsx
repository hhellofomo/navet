import * as Dialog from '@radix-ui/react-dialog';
import type { LucideIcon } from 'lucide-react';
import { Gauge, Plus, Search, Trash2, X } from 'lucide-react';
import type { Dispatch, ReactNode, RefObject, SetStateAction } from 'react';
import { getThemeSurfaceTokens } from '@/app/components/shared/theme/theme-surface-tokens';
import type { ThemeType } from '@/app/hooks/use-theme';
import type { AvailableSensor, SensorGroupColorConfig } from './sensor-group-settings.types';
import type { SensorIconType, SensorReading } from './sensors/sensor-types';

interface SensorGroupSettingsViewProps {
  groupName: string;
  selectedSensors: SensorReading[];
  maxSensors: number;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  isDropdownOpen: boolean;
  setIsDropdownOpen: (open: boolean) => void;
  highlightedIndex: number;
  setHighlightedIndex: Dispatch<SetStateAction<number>>;
  inputRef: RefObject<HTMLInputElement | null>;
  colors: SensorGroupColorConfig;
  theme: ThemeType;
  filteredSensors: AvailableSensor[];
  iconMap: Record<SensorIconType, LucideIcon>;
  handleAddSensor: (sensor: AvailableSensor) => void;
  handleRemoveSensor: (index: number) => void;
  handleSave: () => void;
  handleCancel: () => void;
  isSensorSelected: (sensorId: string) => boolean;
  CustomScrollbar: React.ComponentType<{ children: ReactNode }>;
}

export function SensorGroupSettingsView({
  groupName,
  selectedSensors,
  maxSensors,
  searchQuery,
  setSearchQuery,
  isDropdownOpen,
  setIsDropdownOpen,
  highlightedIndex,
  setHighlightedIndex,
  inputRef,
  colors,
  theme,
  filteredSensors,
  iconMap,
  handleAddSensor,
  handleRemoveSensor,
  handleSave,
  handleCancel,
  isSensorSelected,
  CustomScrollbar,
}: SensorGroupSettingsViewProps) {
  const surface = getThemeSurfaceTokens(theme);
  const isGlass = theme === 'glass';

  return (
    <Dialog.Content
      className={`fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[90vw] max-w-md h-[85vh] rounded-3xl border shadow-2xl z-50 overflow-hidden flex flex-col animate-in fade-in zoom-in duration-200 ${
        theme === 'light'
          ? 'bg-gradient-to-br from-white via-gray-50/95 to-white'
          : isGlass
            ? 'bg-gradient-to-br from-white/14 via-slate-900/80 to-slate-950/88 backdrop-blur-2xl'
            : 'bg-gradient-to-br from-gray-900/95 to-gray-950/95 backdrop-blur-xl'
      } ${surface.border}`}
    >
      <div className="flex-1 min-h-0 overflow-hidden">
        <div className="h-full overflow-y-auto overscroll-contain [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
          <div className="p-8">
            {/* Dialog Header */}
            <div className="flex items-start justify-between mb-6">
              <div>
                <Dialog.Title className={`text-xl font-semibold ${surface.textPrimary}`}>
                  {groupName} Settings
                </Dialog.Title>
                <Dialog.Description className={`text-sm mt-1 ${surface.textSecondary}`}>
                  Manage sensors for this group
                </Dialog.Description>
              </div>

              <Dialog.Close asChild>
                <button
                  type="button"
                  onClick={handleCancel}
                  className={`p-2 rounded-lg ${surface.subtleBg} ${surface.hoverBg} transition-all`}
                >
                  <X className={`w-5 h-5 ${surface.textSecondary}`} />
                </button>
              </Dialog.Close>
            </div>

            <div className="space-y-4">
              {/* Selected Sensors Section */}
              <div>
                <h3 className={`text-sm font-semibold mb-3 ${surface.textPrimary}`}>
                  Selected Sensors ({selectedSensors.length}/{maxSensors})
                </h3>

                {selectedSensors.length === 0 ? (
                  <div className={`rounded-2xl p-4 text-center ${surface.subtleBg}`}>
                    <p className={`text-xs ${surface.textSecondary}`}>Search and add sensors below</p>
                  </div>
                ) : (
                  <div className="space-y-2">
                    {selectedSensors.map((sensor, index) => {
                      const Icon = sensor.icon ? iconMap[sensor.icon] : Gauge;
                      return (
                        <div
                          key={`${sensor.label}-${index}`}
                          className={`rounded-2xl p-3 border flex items-center justify-between ${surface.subtleBg} ${surface.border}`}
                        >
                          <div className="flex items-center gap-2 min-w-0 flex-1">
                            <div
                              className={`w-8 h-8 rounded-full ${colors.iconBg} flex items-center justify-center flex-shrink-0`}
                            >
                              <Icon className={`w-4 h-4 ${colors.iconColor}`} />
                            </div>
                            <div className="min-w-0 flex-1">
                              <p className={`text-xs font-medium truncate ${surface.textPrimary}`}>
                                {sensor.label}
                              </p>
                              <p className={`text-xs ${surface.textSecondary}`}>
                                {sensor.value} {sensor.unit}
                              </p>
                            </div>
                          </div>
                          <button
                            type="button"
                            onClick={() => handleRemoveSensor(index)}
                            className="w-7 h-7 rounded-full bg-red-500/20 hover:bg-red-500/30 flex items-center justify-center transition-colors flex-shrink-0"
                            aria-label="Remove sensor"
                          >
                            <Trash2 className="w-3.5 h-3.5 text-red-400" />
                          </button>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>

              {/* Search and Autocomplete Section */}
              <div className="relative">
                <h3 className={`text-sm font-semibold mb-3 ${surface.textPrimary}`}>Add Sensors</h3>

                {/* Search Input */}
                <div className="relative">
                  <Search
                    className={`absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 ${surface.textSecondary}`}
                  />
                  <input
                    ref={inputRef}
                    type="text"
                    value={searchQuery}
                    onChange={(e) => {
                      e.stopPropagation();
                      setSearchQuery(e.target.value);
                      setIsDropdownOpen(true);
                      setHighlightedIndex(-1);
                    }}
                    onPointerDown={(e) => {
                      e.stopPropagation();
                    }}
                    onMouseDown={(e) => {
                      e.stopPropagation();
                    }}
                    onFocus={() => {
                      setIsDropdownOpen(true);
                      setHighlightedIndex(-1);
                    }}
                    onBlur={() => {
                      // Delay closing to allow click on dropdown items
                      setTimeout(() => setIsDropdownOpen(false), 200);
                    }}
                    onKeyDown={(e) => {
                      e.stopPropagation();
                      if (e.key === 'ArrowDown') {
                        e.preventDefault();
                        setHighlightedIndex((prev) =>
                          prev < filteredSensors.length - 1 ? prev + 1 : 0
                        );
                      } else if (e.key === 'ArrowUp') {
                        e.preventDefault();
                        setHighlightedIndex((prev) =>
                          prev > 0 ? prev - 1 : filteredSensors.length - 1
                        );
                      } else if (e.key === 'Enter' && highlightedIndex >= 0) {
                        e.preventDefault();
                        const sensor = filteredSensors[highlightedIndex];
                        if (sensor && !isSensorSelected(sensor.id)) {
                          handleAddSensor(sensor);
                        }
                      } else if (e.key === 'Escape') {
                        setIsDropdownOpen(false);
                        setSearchQuery('');
                        inputRef.current?.blur();
                      }
                    }}
                    placeholder="Search sensors..."
                    className={`w-full ${surface.inputBg} border ${surface.border} rounded-2xl pl-11 pr-4 py-3 text-sm ${surface.textPrimary} ${surface.placeholder} focus:outline-none focus:ring-2 focus:ring-white/20 transition-all`}
                    disabled={selectedSensors.length >= maxSensors}
                    autoComplete="off"
                  />
                </div>

                {/* Autocomplete Dropdown */}
                {isDropdownOpen && (
                  <div
                    className={`mt-2 rounded-2xl shadow-2xl overflow-hidden max-h-64 border ${surface.panel} ${surface.border} ${isGlass ? 'backdrop-blur-2xl' : 'backdrop-blur-xl'}`}
                  >
                    <CustomScrollbar>
                      {filteredSensors.length > 0 ? (
                        <div className="p-2">
                          {filteredSensors.map((sensor, index) => {
                            const Icon = iconMap[sensor.icon];
                            const isSelected = isSensorSelected(sensor.id);
                            const isDisabled = selectedSensors.length >= maxSensors && !isSelected;
                            const isHighlighted = index === highlightedIndex;

                            // Highlight matching text
                            const highlightMatch = (text: string) => {
                              const query = searchQuery.trim();
                              if (!query) return text;
                              const regex = new RegExp(
                                `(${query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`,
                                'gi'
                              );
                              const parts = text.split(regex);
                              return parts.map((part, i) => {
                                const isMatch = part.toLowerCase().includes(query.toLowerCase());
                                // Create a stable key that doesn't rely on array index
                                const key = `${part}-${i}-${isMatch ? 'match' : 'text'}`;
                                return isMatch ? (
                                  <span key={key} className={`${colors.iconColor}`}>
                                    {part}
                                  </span>
                                ) : (
                                  part
                                );
                              });
                            };

                            return (
                              <button
                                type="button"
                                key={sensor.id}
                                onMouseDown={(e) => {
                                  e.preventDefault(); // Prevent blur
                                  handleAddSensor(sensor);
                                }}
                                onMouseEnter={() => setHighlightedIndex(index)}
                                disabled={isDisabled || isSelected}
                                className={`w-full rounded-xl p-3 transition-colors flex items-center gap-3 text-left ${
                                  isSelected
                                    ? `${surface.subtleBg} opacity-50 cursor-not-allowed`
                                    : isDisabled
                                      ? `${surface.subtleBg} opacity-50 cursor-not-allowed`
                                      : isHighlighted
                                        ? `${colors.selected} border border-transparent`
                                        : `${colors.hover} border border-transparent`
                                }`}
                              >
                                <div
                                  className={`w-8 h-8 rounded-full ${colors.iconBg} flex items-center justify-center flex-shrink-0`}
                                >
                                  <Icon className={`w-4 h-4 ${colors.iconColor}`} />
                                </div>
                                <div className="min-w-0 flex-1">
                                  <p className={`text-xs font-medium truncate ${surface.textPrimary}`}>
                                    {highlightMatch(sensor.label)}
                                  </p>
                                  <p className={`text-xs ${surface.textSecondary}`}>
                                    {sensor.value} {sensor.unit} · {sensor.category}
                                  </p>
                                </div>
                                {isSelected ? (
                                  <span className={`text-xs flex-shrink-0 ${surface.textMuted}`}>Added</span>
                                ) : !isDisabled ? (
                                  <Plus className={`w-4 h-4 flex-shrink-0 ${surface.textMuted}`} />
                                ) : null}
                              </button>
                            );
                          })}
                        </div>
                      ) : (
                        <div className="p-6 text-center">
                          <p className={`text-xs ${surface.textSecondary}`}>
                            No sensors match "{searchQuery}"
                          </p>
                        </div>
                      )}
                    </CustomScrollbar>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer Actions */}
      <div className={`p-6 border-t flex gap-3 ${surface.border}`}>
        <button
          type="button"
          onClick={handleCancel}
          className={`flex-1 py-3 px-4 rounded-2xl ${surface.subtleBg} ${surface.hoverBg} ${surface.textPrimary} font-medium transition-colors`}
        >
          Cancel
        </button>
        <button
          type="button"
          onClick={handleSave}
          className={`flex-1 py-3 px-4 rounded-2xl ${colors.iconBg} ${colors.hover} text-white font-medium transition-colors`}
        >
          Save Changes
        </button>
      </div>
    </Dialog.Content>
  );
}
