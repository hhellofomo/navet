import { memo, useState, useRef, useCallback } from 'react';
import * as Dialog from '@radix-ui/react-dialog';
import { X, Plus, Trash2, Zap, Thermometer, Droplets, Gauge, TrendingUp, TrendingDown, Activity, Wind, Sun, Search } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import { CustomScrollbar } from './shared/custom-scrollbar';
import type { SensorIconType } from './grouped-sensor-card';

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

interface SensorGroupSettingsDialogProps {
  isOpen: boolean;
  onClose: () => void;
  groupName: string;
  currentSensors: SensorReading[];
  maxSensors: number;
  accentColor: 'teal' | 'blue' | 'purple' | 'amber' | 'emerald';
  onSensorsUpdate: (sensors: SensorReading[]) => void;
}

const iconMap: Record<SensorIconType, LucideIcon> = {
  zap: Zap,
  thermometer: Thermometer,
  droplets: Droplets,
  gauge: Gauge,
  'trend-up': TrendingUp,
  'trend-down': TrendingDown,
  activity: Activity,
  wind: Wind,
  sun: Sun,
};

// Available sensors that can be added
const AVAILABLE_SENSORS: AvailableSensor[] = [
  // Energy sensors
  { id: 'energy-today', label: 'Today', value: '12.4', unit: 'kWh', icon: 'zap', category: 'energy' },
  { id: 'energy-current', label: 'Current', value: '2.3', unit: 'kW', icon: 'activity', category: 'energy' },
  { id: 'energy-bathroom', label: 'Bathroom', value: '450', unit: 'W', icon: 'zap', category: 'energy' },
  { id: 'energy-kitchen', label: 'Kitchen', value: '1.2', unit: 'kW', icon: 'zap', category: 'energy' },
  { id: 'energy-bedroom', label: 'Bedroom', value: '320', unit: 'W', icon: 'zap', category: 'energy' },
  { id: 'energy-living', label: 'Living Room', value: '890', unit: 'W', icon: 'zap', category: 'energy' },
  { id: 'energy-week', label: 'This Week', value: '84.2', unit: 'kWh', icon: 'trend-up', category: 'energy' },
  { id: 'energy-month', label: 'This Month', value: '342', unit: 'kWh', icon: 'trend-up', category: 'energy' },
  
  // Climate sensors
  { id: 'temp-indoor', label: 'Temperature', value: '21', unit: '°C', icon: 'thermometer', category: 'climate' },
  { id: 'humidity-indoor', label: 'Humidity', value: '55', unit: '%', icon: 'droplets', category: 'climate' },
  { id: 'temp-outdoor', label: 'Outdoor Temp', value: '18', unit: '°C', icon: 'thermometer', category: 'climate' },
  { id: 'humidity-outdoor', label: 'Outdoor Humidity', value: '72', unit: '%', icon: 'droplets', category: 'climate' },
  { id: 'temp-bedroom', label: 'Bedroom Temp', value: '19', unit: '°C', icon: 'thermometer', category: 'climate' },
  { id: 'humidity-bedroom', label: 'Bedroom Humidity', value: '48', unit: '%', icon: 'droplets', category: 'climate' },
  
  // Environmental sensors
  { id: 'air-quality', label: 'Air Quality', value: 'Good', unit: '', icon: 'wind', category: 'environmental' },
  { id: 'wind-speed', label: 'Wind Speed', value: '12', unit: 'km/h', icon: 'wind', category: 'environmental' },
  { id: 'uv-index', label: 'UV Index', value: '5', unit: '', icon: 'sun', category: 'environmental' },
  { id: 'pressure', label: 'Pressure', value: '1013', unit: 'hPa', icon: 'gauge', category: 'environmental' },
  { id: 'co2', label: 'CO2 Level', value: '420', unit: 'ppm', icon: 'wind', category: 'environmental' },
  
  // Other sensors
  { id: 'noise-level', label: 'Noise Level', value: '42', unit: 'dB', icon: 'activity', category: 'other' },
  { id: 'light-level', label: 'Light Level', value: '450', unit: 'lux', icon: 'sun', category: 'other' },
];

const colorMap = {
  teal: {
    iconBg: 'bg-teal-500/20',
    iconColor: 'text-teal-400',
    hover: 'hover:bg-teal-500/10',
    selected: 'bg-teal-500/20 border-teal-500/40',
  },
  blue: {
    iconBg: 'bg-blue-500/20',
    iconColor: 'text-blue-400',
    hover: 'hover:bg-blue-500/10',
    selected: 'bg-blue-500/20 border-blue-500/40',
  },
  purple: {
    iconBg: 'bg-purple-500/20',
    iconColor: 'text-purple-400',
    hover: 'hover:bg-purple-500/10',
    selected: 'bg-purple-500/20 border-purple-500/40',
  },
  amber: {
    iconBg: 'bg-amber-500/20',
    iconColor: 'text-amber-400',
    hover: 'hover:bg-amber-500/10',
    selected: 'bg-amber-500/20 border-amber-500/40',
  },
  emerald: {
    iconBg: 'bg-emerald-500/20',
    iconColor: 'text-emerald-400',
    hover: 'hover:bg-emerald-500/10',
    selected: 'bg-emerald-500/20 border-emerald-500/40',
  },
};

export const SensorGroupSettingsDialog = memo(function SensorGroupSettingsDialog({
  isOpen,
  onClose,
  groupName,
  currentSensors,
  maxSensors,
  accentColor,
  onSensorsUpdate,
}: SensorGroupSettingsDialogProps) {
  const [selectedSensors, setSelectedSensors] = useState<SensorReading[]>(currentSensors);
  const [searchQuery, setSearchQuery] = useState('');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [highlightedIndex, setHighlightedIndex] = useState(-1);
  const inputRef = useRef<HTMLInputElement>(null);
  const colors = colorMap[accentColor];

  // Filter sensors based on search query — searches label, category, unit, and id
  const filteredSensors = AVAILABLE_SENSORS.filter(sensor => {
    const query = searchQuery.toLowerCase().trim();
    if (!query) return true; // Show all when no query
    return (
      sensor.label.toLowerCase().includes(query) ||
      sensor.category.toLowerCase().includes(query) ||
      sensor.unit.toLowerCase().includes(query) ||
      sensor.id.toLowerCase().includes(query)
    );
  });

  const handleAddSensor = useCallback((sensor: AvailableSensor) => {
    if (selectedSensors.length >= maxSensors) return;
    
    // Check if already selected
    const alreadySelected = selectedSensors.some(s => 
      AVAILABLE_SENSORS.find(as => as.id === sensor.id && as.label === s.label)
    );
    if (alreadySelected) return;
    
    const newSensor: SensorReading = {
      label: sensor.label,
      value: sensor.value,
      unit: sensor.unit,
      icon: sensor.icon,
    };
    
    setSelectedSensors([...selectedSensors, newSensor]);
    setSearchQuery('');
    setHighlightedIndex(-1);
    // Keep dropdown open and refocus input for quick multi-add
    setTimeout(() => inputRef.current?.focus(), 0);
  }, [selectedSensors, maxSensors]);

  const handleRemoveSensor = (index: number) => {
    const newSensors = selectedSensors.filter((_, i) => i !== index);
    setSelectedSensors(newSensors);
  };

  const handleSave = () => {
    onSensorsUpdate(selectedSensors);
    onClose();
  };

  const handleCancel = () => {
    setSelectedSensors(currentSensors);
    setSearchQuery('');
    setIsDropdownOpen(false);
    setHighlightedIndex(-1);
    onClose();
  };

  const isSensorSelected = (sensorId: string) => {
    return selectedSensors.some(s => 
      AVAILABLE_SENSORS.find(as => as.id === sensorId && as.label === s.label)
    );
  };

  return (
    <Dialog.Root open={isOpen} onOpenChange={(open) => { if (!open) handleCancel(); }}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 animate-in fade-in" />
        <Dialog.Content 
          className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[90vw] max-w-md h-[85vh] bg-gradient-to-br from-gray-900/95 to-gray-950/95 backdrop-blur-xl rounded-3xl border border-white/10 shadow-2xl z-50 overflow-hidden flex flex-col animate-in fade-in zoom-in duration-200"
        >
          <div className="flex-1 min-h-0 overflow-hidden">
            <div className="h-full overflow-y-auto overscroll-contain [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
              <div className="p-8">
                {/* Dialog Header */}
                <div className="flex items-start justify-between mb-6">
                  <div>
                    <Dialog.Title className="text-xl font-semibold text-white">
                      {groupName} Settings
                    </Dialog.Title>
                    <Dialog.Description className="text-sm mt-1 text-gray-400">
                      Manage sensors for this group
                    </Dialog.Description>
                  </div>
                  
                  <Dialog.Close asChild>
                    <button
                      onClick={handleCancel}
                      className="p-2 rounded-lg bg-white/10 hover:bg-white/20 transition-all"
                    >
                      <X className="w-5 h-5 text-gray-400" />
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
                      <p className="text-xs text-gray-400">Search and add sensors below</p>
                    </div>
                  ) : (
                    <div className="space-y-2">
                      {selectedSensors.map((sensor, index) => {
                        const Icon = sensor.icon ? iconMap[sensor.icon] : Gauge;
                        return (
                          <div
                            key={index}
                            className="bg-white/5 rounded-2xl p-3 border border-white/10 flex items-center justify-between"
                          >
                            <div className="flex items-center gap-2 min-w-0 flex-1">
                              <div className={`w-8 h-8 rounded-full ${colors.iconBg} flex items-center justify-center flex-shrink-0`}>
                                <Icon className={`w-4 h-4 ${colors.iconColor}`} />
                              </div>
                              <div className="min-w-0 flex-1">
                                <p className="text-xs font-medium text-white truncate">{sensor.label}</p>
                                <p className="text-xs text-gray-400">
                                  {sensor.value} {sensor.unit}
                                </p>
                              </div>
                            </div>
                            <button
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
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
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
                          setHighlightedIndex(prev => 
                            prev < filteredSensors.length - 1 ? prev + 1 : 0
                          );
                        } else if (e.key === 'ArrowUp') {
                          e.preventDefault();
                          setHighlightedIndex(prev => 
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
                                const regex = new RegExp(`(${query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'gi');
                                const parts = text.split(regex);
                                return parts.map((part, i) => 
                                  regex.test(part) 
                                    ? <span key={i} className={`${colors.iconColor}`}>{part}</span>
                                    : part
                                );
                              };
                              
                              return (
                                <button
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
                                  <div className={`w-8 h-8 rounded-full ${colors.iconBg} flex items-center justify-center flex-shrink-0`}>
                                    <Icon className={`w-4 h-4 ${colors.iconColor}`} />
                                  </div>
                                  <div className="min-w-0 flex-1">
                                    <p className="text-xs font-medium text-white truncate">{highlightMatch(sensor.label)}</p>
                                    <p className="text-xs text-gray-400">
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
                            <p className="text-xs text-gray-400">No sensors match "{searchQuery}"</p>
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
              onClick={handleCancel}
              className="flex-1 py-3 px-4 rounded-2xl bg-white/5 hover:bg-white/10 text-white font-medium transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              className={`flex-1 py-3 px-4 rounded-2xl ${colors.iconBg} ${colors.hover} text-white font-medium transition-colors`}
            >
              Save Changes
            </button>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
});