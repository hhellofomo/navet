import * as Dialog from '@radix-ui/react-dialog';
import { Power, Settings2 } from 'lucide-react';
import { memo, useEffect, useMemo, useState } from 'react';
import { toast } from 'sonner';
import type { CardSize } from '@/app/components/shared/card-size-selector';
import { EntityCardHeaderIcon } from '@/app/components/shared/entity-card-header-icon';
import { useEntityCardInteractionController } from '@/app/components/shared/entity-card-interaction-controller';
import { STORAGE_KEYS } from '@/app/constants/storage-keys';
import { iconMap } from '@/app/features/sensors/components/sensors/sensor-types';
import { useHomeAssistant, useTheme } from '@/app/hooks';
import { homeAssistantService } from '@/app/services/home-assistant.service';
import type { DeviceMetric } from '@/app/types/device.types';
import { storage } from '@/app/utils/storage';

interface SwitchCardProps {
  id: string;
  name: string;
  size: CardSize;
  room: string;
  initialState?: boolean;
  entityType?: string;
  power?: number; // Current power in watts
  voltage?: number; // Voltage
  energy?: number; // Energy consumption in kWh
  metrics?: DeviceMetric[];
  isEditMode?: boolean;
}

function normalizeStoredMetricLabels(value: unknown): string[] {
  if (Array.isArray(value)) {
    return value.filter((label): label is string => typeof label === 'string');
  }

  if (typeof value === 'string' && value.length > 0) {
    return [value];
  }

  return [];
}

function areMetricLabelListsEqual(left: string[], right: string[]) {
  return left.length === right.length && left.every((label, index) => label === right[index]);
}

export const SwitchCard = memo(function SwitchCard({
  id,
  name,
  size,
  initialState = false,
  entityType = 'Switch',
  power,
  voltage,
  energy,
  metrics,
  isEditMode = false,
}: Omit<SwitchCardProps, 'room'>) {
  const [isOn, setIsOn] = useState(initialState);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const { entities } = useHomeAssistant();
  const { colors, theme } = useTheme();
  const liveEntity = entities?.[id];

  useEffect(() => {
    if (liveEntity) {
      setIsOn(liveEntity.state === 'on');
      return;
    }

    setIsOn(initialState);
  }, [initialState, liveEntity]);

  const formatPower = (watts?: number) => {
    if (!watts) return null;
    if (watts >= 1000) return `${(watts / 1000).toFixed(1)} kW`;
    return `${watts} W`;
  };

  const fallbackMetrics = useMemo<DeviceMetric[]>(
    () => [
      ...(power != null
        ? [
            {
              label: 'Power',
              value: power,
              unit: 'W',
              icon: 'zap' as const,
              category: 'measurement' as const,
            },
          ]
        : []),
      ...(voltage != null
        ? [
            {
              label: 'Voltage',
              value: voltage,
              unit: 'V',
              icon: 'gauge' as const,
              category: 'measurement' as const,
            },
          ]
        : []),
      ...(energy != null
        ? [
            {
              label: 'Energy',
              value: energy,
              unit: 'kWh',
              icon: 'activity' as const,
              category: 'measurement' as const,
            },
          ]
        : []),
    ],
    [energy, power, voltage]
  );
  const allMetrics = useMemo(
    () => (metrics?.length ? metrics : fallbackMetrics),
    [fallbackMetrics, metrics]
  );
  const availableMetrics = useMemo(
    () => allMetrics.filter((metric) => isOn || metric.category === 'configuration'),
    [allMetrics, isOn]
  );
  const metricPreferenceKey = `${STORAGE_KEYS.switchCardMetricPreferences}:${id}`;
  const metricLimit = useMemo(() => {
    switch (size) {
      case 'extra-small':
        return 1;
      case 'small':
        return 2;
      case 'medium':
        return 3;
      case 'large':
        return 4;
      default:
        return 2;
    }
  }, [size]);
  const [selectedMetricLabels, setSelectedMetricLabels] = useState<string[]>(() =>
    normalizeStoredMetricLabels(storage.get<unknown>(metricPreferenceKey, []))
  );

  useEffect(() => {
    setSelectedMetricLabels(
      normalizeStoredMetricLabels(storage.get<unknown>(metricPreferenceKey, []))
    );
  }, [metricPreferenceKey]);

  useEffect(() => {
    const availableMetricLabels = new Set(availableMetrics.map((metric) => metric.label));
    const nextLabels = selectedMetricLabels.filter((label) => availableMetricLabels.has(label));

    if (nextLabels.length === 0) {
      const fallbackLabels = availableMetrics.slice(0, metricLimit).map((metric) => metric.label);
      if (!areMetricLabelListsEqual(selectedMetricLabels, fallbackLabels)) {
        setSelectedMetricLabels(fallbackLabels);
      }
      return;
    }

    if (nextLabels.length > metricLimit) {
      const truncatedLabels = nextLabels.slice(0, metricLimit);
      if (!areMetricLabelListsEqual(selectedMetricLabels, truncatedLabels)) {
        setSelectedMetricLabels(truncatedLabels);
      }
      return;
    }

    if (!areMetricLabelListsEqual(selectedMetricLabels, nextLabels)) {
      setSelectedMetricLabels(nextLabels);
    }
  }, [availableMetrics, metricLimit, selectedMetricLabels]);

  useEffect(() => {
    storage.set(metricPreferenceKey, selectedMetricLabels);
  }, [metricPreferenceKey, selectedMetricLabels]);

  const selectedMetrics = availableMetrics
    .filter((metric) => selectedMetricLabels.includes(metric.label))
    .slice(0, metricLimit);
  const hasMetrics = availableMetrics.length > 0;
  const hasControlsDialog = hasMetrics;

  const cardColors = isOn
    ? colors.switch.on
    : {
        gradient: colors.light.gradient,
        border: colors.light.border,
        iconBg: colors.light.iconBg,
        accent: theme === 'light' ? 'text-gray-300' : 'text-gray-500',
        glow: colors.light.glow,
      };
  const textColor =
    theme === 'light'
      ? isOn
        ? 'text-gray-900'
        : 'text-gray-500'
      : isOn
        ? 'text-white'
        : 'text-gray-500';
  const valueColor = theme === 'light' ? 'text-gray-900' : 'text-white';
  const labelColor = theme === 'light' ? 'text-gray-600' : 'text-gray-300';
  const settingsButtonClass =
    theme === 'light'
      ? 'bg-gray-100 hover:bg-gray-200 text-gray-900'
      : 'bg-white/10 hover:bg-white/20 text-white';
  const dialogSurface =
    theme === 'light'
      ? 'bg-white/95 border-gray-200/80 text-gray-900'
      : 'bg-gray-950/95 border-white/10 text-white';
  const cardInteraction = useEntityCardInteractionController({
    ariaLabel: `${name} switch`,
    ariaPressed: isOn,
    isEditMode,
    onToggle: () => {
      const nextIsOn = !isOn;
      setIsOn(nextIsOn);
      void homeAssistantService.updateSwitch(id, nextIsOn ? 'on' : 'off').catch((error) => {
        setIsOn(!nextIsOn);
        toast.error(error instanceof Error ? error.message : 'Failed to update switch');
      });
    },
    onOpenControls: () => {
      if (hasControlsDialog) {
        setIsDialogOpen(true);
      }
    },
    onOpenSettings: () => {
      if (hasControlsDialog) {
        setIsDialogOpen(true);
      }
    },
  });
  const showSettingsButton =
    hasControlsDialog && cardInteraction.interactionMode !== 'control-first';

  const formatMetricValue = (metric: DeviceMetric) =>
    typeof metric.value === 'number'
      ? metric.label === 'Power'
        ? formatPower(metric.value)
        : `${metric.value.toFixed(metric.unit === 'kWh' ? 2 : 0)}${metric.unit ? ` ${metric.unit}` : ''}`
      : metric.value;
  const renderMetricIcon = (metric: DeviceMetric, className: string) => {
    const Icon = iconMap[metric.icon] ?? Power;
    return <Icon className={className} />;
  };
  const handleMetricToggle = (metricLabel: string) => {
    setSelectedMetricLabels((current) => {
      if (current.includes(metricLabel)) {
        const next = current.filter((label) => label !== metricLabel);
        return next.length > 0 ? next : current;
      }

      if (current.length >= metricLimit) {
        return [...current.slice(1), metricLabel];
      }

      return [...current, metricLabel];
    });
  };

  return (
    <>
      <div
        {...cardInteraction.cardProps}
        className={`relative h-full w-full bg-gradient-to-br ${cardColors.gradient} backdrop-blur-xl rounded-3xl p-4 border ${cardColors.border} overflow-hidden transition-all duration-500 ${
          isEditMode
            ? 'cursor-move active:cursor-grabbing'
            : 'cursor-pointer hover:scale-[1.02] active:scale-[0.98]'
        } ${!isOn ? 'grayscale opacity-40' : ''} ${theme === 'light' && isOn ? 'shadow-lg' : ''}`}
      >
        <div
          className={`absolute inset-0 bg-gradient-to-br ${cardColors.glow} to-transparent transition-all duration-500`}
        ></div>

        {/* Light theme frosted overlay */}
        {theme === 'light' && <div className="absolute inset-0 bg-white/60" />}

        <div className="relative h-full flex flex-col">
          <div className="mb-2 flex items-start gap-3">
            <EntityCardHeaderIcon
              IconComponent={Power}
              isActive={isOn}
              size="small"
              ariaLabel={cardInteraction.iconButtonProps['aria-label']}
              onClick={cardInteraction.iconButtonProps.onClick}
            />
            <div className="min-w-0 flex-1">
              <h3
                className={`font-semibold text-xs ${textColor} transition-colors duration-500 truncate text-left`}
              >
                {name}
              </h3>
              <p className="text-[10px] text-gray-300 truncate mt-0.5 text-left">{entityType}</p>
            </div>
            {showSettingsButton && (
              <button
                {...cardInteraction.settingsButtonProps}
                className={`flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-full transition-colors ${settingsButtonClass}`}
              >
                <Settings2 className="h-3.5 w-3.5" />
              </button>
            )}
          </div>

          <div className="flex-1"></div>

          {/* Metrics display */}
          {selectedMetrics.length > 0 && (
            <div className="space-y-0.5">
              {selectedMetrics.map((metric) => {
                return (
                  <div
                    key={metric.label}
                    className="flex items-center justify-between gap-2 text-xs"
                  >
                    <span className={`${labelColor} min-w-0 flex items-center gap-1 pr-2`}>
                      {renderMetricIcon(metric, 'h-3 w-3 flex-shrink-0')}
                      <span className="truncate">{metric.label}</span>
                    </span>
                    <span className={`${valueColor} flex-shrink-0 whitespace-nowrap font-medium`}>
                      {formatMetricValue(metric)}
                    </span>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      <Dialog.Root open={hasControlsDialog ? isDialogOpen : false} onOpenChange={setIsDialogOpen}>
        <Dialog.Portal>
          <Dialog.Overlay className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm" />
          <Dialog.Content
            className={`fixed left-1/2 top-1/2 z-50 w-[90vw] max-w-md -translate-x-1/2 -translate-y-1/2 rounded-[28px] border p-6 shadow-2xl ${dialogSurface}`}
          >
            <Dialog.Title className="text-xl font-semibold">{name}</Dialog.Title>
            <Dialog.Description className={`mt-1 text-sm ${labelColor}`}>
              {entityType}
            </Dialog.Description>

            <div className="mt-6 space-y-4">
              {hasMetrics && (
                <div
                  className={`rounded-2xl p-4 ${theme === 'light' ? 'bg-gray-100' : 'bg-white/5'}`}
                >
                  <p className={`text-xs uppercase tracking-[0.16em] ${labelColor}`}>Card Metric</p>
                  <p className={`mt-1 text-xs ${labelColor}`}>
                    Select up to {metricLimit} {metricLimit === 1 ? 'metric' : 'metrics'} for this
                    card.
                  </p>
                  <div className="mt-3 space-y-2">
                    {availableMetrics.map((metric) => {
                      const isSelected = selectedMetricLabels.includes(metric.label);
                      return (
                        <button
                          type="button"
                          key={`dialog-${metric.label}`}
                          onClick={() => handleMetricToggle(metric.label)}
                          className={`flex w-full items-center justify-between gap-3 rounded-2xl border px-3 py-2 text-left transition-colors ${
                            isSelected
                              ? theme === 'light'
                                ? 'border-gray-900/20 bg-white'
                                : 'border-white/20 bg-white/10'
                              : theme === 'light'
                                ? 'border-transparent bg-white/60 hover:bg-white'
                                : 'border-transparent bg-white/5 hover:bg-white/10'
                          }`}
                        >
                          <span className={`min-w-0 flex items-center gap-2 ${labelColor}`}>
                            {renderMetricIcon(metric, 'h-4 w-4 flex-shrink-0')}
                            <span className="truncate">{metric.label}</span>
                          </span>
                          <div className="flex flex-shrink-0 items-center gap-3">
                            <span className={`font-medium ${textColor}`}>
                              {formatMetricValue(metric)}
                            </span>
                            <span
                              className={`h-4 w-4 rounded border transition-colors ${
                                isSelected
                                  ? theme === 'light'
                                    ? 'border-gray-900 bg-gray-900'
                                    : 'border-white bg-white'
                                  : theme === 'light'
                                    ? 'border-gray-400 bg-transparent'
                                    : 'border-white/40 bg-transparent'
                              }`}
                            />
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>
    </>
  );
});
