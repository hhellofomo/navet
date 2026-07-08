import * as Dialog from '@radix-ui/react-dialog';
import { Power, Settings2 } from 'lucide-react';
import { memo, useState } from 'react';
import { EntityCardHeaderIcon } from '@/app/components/shared/entity-card-header-icon';
import { useEntityCardInteractionController } from '@/app/components/shared/entity-card-interaction-controller';
import { useTheme } from '@/app/contexts/theme-context';
import { iconMap } from '@/app/features/sensors/components/sensors/sensor-types';
import type { DeviceMetric } from '@/app/types/device.types';

interface SwitchCardProps {
  name: string;
  room: string;
  initialState?: boolean;
  entityType?: string;
  power?: number; // Current power in watts
  voltage?: number; // Voltage
  energy?: number; // Energy consumption in kWh
  metrics?: DeviceMetric[];
  isEditMode?: boolean;
}

export const SwitchCard = memo(function SwitchCard({
  name,
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
  const { colors, theme } = useTheme();

  const formatPower = (watts?: number) => {
    if (!watts) return null;
    if (watts >= 1000) return `${(watts / 1000).toFixed(1)} kW`;
    return `${watts} W`;
  };

  const fallbackMetrics: DeviceMetric[] = [
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
  ];
  const allMetrics = metrics?.length ? metrics : fallbackMetrics;
  const visibleMetrics = allMetrics.filter((metric) => isOn || metric.category === 'configuration');
  const hasMetrics = visibleMetrics.length > 0;

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
    onToggle: () => setIsOn((current) => !current),
    onOpenControls: () => setIsDialogOpen(true),
    onOpenSettings: () => setIsDialogOpen(true),
  });

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
              onPointerDown={cardInteraction.iconButtonProps.onPointerDown}
            />
            <div className="min-w-0 flex-1">
              <h3
                className={`font-semibold text-xs ${textColor} transition-colors duration-500 truncate text-left`}
              >
                {name}
              </h3>
              <p className="text-[10px] text-gray-300 truncate mt-0.5 text-left">{entityType}</p>
            </div>
            <button
              {...cardInteraction.settingsButtonProps}
              className={`flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-full transition-colors ${settingsButtonClass}`}
            >
              <Settings2 className="h-3.5 w-3.5" />
            </button>
          </div>

          <div className="flex-1"></div>

          {/* Metrics display */}
          {hasMetrics && (
            <div className="space-y-0.5">
              {visibleMetrics.map((metric) => {
                const Icon = iconMap[metric.icon] ?? Power;
                const formattedValue =
                  typeof metric.value === 'number'
                    ? metric.label === 'Power'
                      ? formatPower(metric.value)
                      : `${metric.value.toFixed(metric.unit === 'kWh' ? 2 : 0)}${metric.unit ? ` ${metric.unit}` : ''}`
                    : metric.value;

                return (
                  <div key={metric.label} className="flex items-center justify-between text-xs">
                    <span className={`${labelColor} min-w-0 flex items-center gap-1 pr-2`}>
                      <Icon className="h-3 w-3 flex-shrink-0" />
                      <span className="truncate">{metric.label}</span>
                    </span>
                    <span className={`${valueColor} flex-shrink-0 whitespace-nowrap font-medium`}>
                      {formattedValue}
                    </span>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      <Dialog.Root open={isDialogOpen} onOpenChange={setIsDialogOpen}>
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
              <div
                className={`rounded-2xl p-4 ${theme === 'light' ? 'bg-gray-100' : 'bg-white/5'}`}
              >
                <p className={`text-xs uppercase tracking-[0.16em] ${labelColor}`}>State</p>
                <div className="mt-2 flex items-center justify-between">
                  <span className={`text-lg font-semibold ${textColor}`}>
                    {isOn ? 'On' : 'Off'}
                  </span>
                  <button
                    type="button"
                    onClick={() => setIsOn((current) => !current)}
                    className="rounded-full px-4 py-2 text-sm font-medium text-white"
                    style={{ backgroundColor: isOn ? '#2563eb' : '#6b7280' }}
                  >
                    {isOn ? 'Turn off' : 'Turn on'}
                  </button>
                </div>
              </div>

              {hasMetrics && (
                <div
                  className={`rounded-2xl p-4 ${theme === 'light' ? 'bg-gray-100' : 'bg-white/5'}`}
                >
                  <p className={`text-xs uppercase tracking-[0.16em] ${labelColor}`}>Metrics</p>
                  <div className="mt-3 space-y-2">
                    {visibleMetrics.map((metric) => {
                      const Icon = iconMap[metric.icon] ?? Power;
                      return (
                        <div
                          key={`dialog-${metric.label}`}
                          className="flex items-center justify-between gap-3"
                        >
                          <span className={`min-w-0 flex items-center gap-2 ${labelColor}`}>
                            <Icon className="h-4 w-4 flex-shrink-0" />
                            <span className="truncate">{metric.label}</span>
                          </span>
                          <span className={`flex-shrink-0 font-medium ${textColor}`}>
                            {typeof metric.value === 'number'
                              ? metric.label === 'Power'
                                ? formatPower(metric.value)
                                : `${metric.value.toFixed(metric.unit === 'kWh' ? 2 : 0)}${metric.unit ? ` ${metric.unit}` : ''}`
                              : metric.value}
                          </span>
                        </div>
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
