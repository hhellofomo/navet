import * as Dialog from '@radix-ui/react-dialog';
import type { LucideIcon } from 'lucide-react';
import { Plus, Search, Trash2, X } from 'lucide-react';
import type { RefObject } from 'react';
import type { SensorIconType } from './sensors/sensor-types';

interface SensorReading {
  label: string;
  value: string;
  unit: string;
  icon?: SensorIconType;
}

interface AvailableSensor {
  id: string;
  label: string;
  value: string;
  unit: string;
  icon: SensorIconType;
  category: 'energy' | 'climate' | 'environmental' | 'other';
}

interface ColorConfig {
  iconBg: string;
  iconColor: string;
  hover: string;
  selected: string;
}

interface SensorGroupSettingsViewProps {
  groupName: string;
  selectedSensors: SensorReading[];
  maxSensors: number;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  isDropdownOpen: boolean;
  setIsDropdownOpen: (open: boolean) => void;
  highlightedIndex: number;
  setHighlightedIndex: (index: number) => void;
  inputRef: RefObject<HTMLInputElement>;
  colors: ColorConfig;
  filteredSensors: AvailableSensor[];
  iconMap: Record<SensorIconType, LucideIcon>;
  handleAddSensor: (sensor: AvailableSensor) => void;
  handleRemoveSensor: (index: number) => void;
  handleSave: () => void;
  handleCancel: () => void;
  isSensorSelected: (sensorId: string) => boolean;
  CustomScrollbar: React.ComponentType<{ children: React.ReactNode }>;
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
  filteredSensors,
  iconMap,
  handleAddSensor,
  handleRemoveSensor,
  handleSave,
  handleCancel,
  isSensorSelected,
  CustomScrollbar,
}: SensorGroupSettingsViewProps) {
  return (
    <Dialog.Content className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[90vw] max-w-md h-[85vh] bg-gradient-to-br from-gray-900/95 to-gray-950/95 backdrop-blur-xl rounded-3xl border border-white/10 shadow-2xl z-50 overflow-hidden flex flex-col animate-in fade-in zoom-in duration-200">
      <div className="flex-1 min-h-0 overflow-hidden">
        <div className="h-full overflow-y-auto overscroll-contain [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
          <div className="p-8">
            {/* Dialog Header */}
            <div className="flex items-start justify-between mb-6">
              <div>
                <Dialog.Title className="text-xl font-semibold text-white">
                  {groupName} Settings
                </Dialog.Title>
                <Dialog.Description className="text-sm mt-1 text-gray-300">
                  Manage sensors for this group
                </Dialog.Description>
              </div>

              <Dialog.Close asChild>
                <button
                  type="button"
                  onClick={handleCancel}
                  className="p-2 rounded-lg bg-white/10 hover:bg-white/20 transition-all"
                >
                  <X className="w-5 h-5 text-gray-300" />
                </button>
              </Dialog.Close>
            </div>

            <div className="space-y-4">
              {/* Selected Sensors Section */}
              <div>
                <h3 className="text-sm font-semibold text-white mb-3">
                  Selected Sensors ({selectedSensors.length}/{maxSensors})
                </h3>

                {selectedSensors.length === 0 ? (
                  <div className="bg-white/5 rounded-2xl p-4 text-center">
                    <p className="text-xs text-gray-300">Search and add sensors below</p>
                  </div>
                ) : (
                  <div className="space-y-2">
                    {selectedSensors.map((sensor, index) => {
                      const Icon = sensor.icon ? iconMap[sensor.icon] : Gauge;
                      return (
                        <div
                          key={`${sensor.label}-${index}`}
                          className="bg-white/5 rounded-2xl p-3 border border-white/10 flex items-center justify-between"
                        >
                          <div className="flex items-center gap-2 min-w-0 flex-1">
                            <div
                              className={`w-8 h-8 rounded-full ${colors.iconBg} flex items-center justify-center flex-shrink-0`}
                            >
                              <Icon className={`w-4 h-4 ${colors.iconColor}`} />
                            </div>
                            <div className="min-w-0 flex-1">
                              <p className="text-xs font-medium text-white truncate">
                                {sensor.label}
                              </p>
                              <p className="text-xs text-gray-300">
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
                <h3 className="text-sm font-semibold text-white mb-3">Add Sensors</h3>

                {/* Search Input */}
                <div className="relative">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-300" />
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
                    className="w-full bg-white/5 border border-white/10 rounded-2xl pl-11 pr-4 py-3 text-sm text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-white/20 transition-all"
                    disabled={selectedSensors.length >= maxSensors}
                    autoComplete="off"
                  />
                </div>

                {/* Autocomplete Dropdown */}
                {isDropdownOpen && (
                  <div className="mt-2 bg-gray-900/95 backdrop-blur-xl border border-white/10 rounded-2xl shadow-2xl overflow-hidden max-h-64">
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
                                    ? 'bg-white/5 opacity-50 cursor-not-allowed'
                                    : isDisabled
                                      ? 'bg-white/5 opacity-50 cursor-not-allowed'
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
                                  <p className="text-xs font-medium text-white truncate">
                                    {highlightMatch(sensor.label)}
                                  </p>
                                  <p className="text-xs text-gray-300">
                                    {sensor.value} {sensor.unit} · {sensor.category}
                                  </p>
                                </div>
                                {isSelected ? (
                                  <span className="text-xs text-gray-500 flex-shrink-0">Added</span>
                                ) : !isDisabled ? (
                                  <Plus className="w-4 h-4 text-white/60 flex-shrink-0" />
                                ) : null}
                              </button>
                            );
                          })}
                        </div>
                      ) : (
                        <div className="p-6 text-center">
                          <p className="text-xs text-gray-300">No sensors match "{searchQuery}"</p>
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
      <div className="p-6 border-t border-white/10 flex gap-3">
        <button
          type="button"
          onClick={handleCancel}
          className="flex-1 py-3 px-4 rounded-2xl bg-white/5 hover:bg-white/10 text-white font-medium transition-colors"
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

function Gauge() {
  return (
    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <title>Gauge</title>
      <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
    </svg>
  );
}
