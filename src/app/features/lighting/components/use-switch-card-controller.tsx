import { Power } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import { toast } from 'sonner';
import { useEntityCardInteractionController } from '@/app/components/shared/entity-card-interaction-controller';
import { STORAGE_KEYS } from '@/app/constants/storage-keys';
import { iconMap } from '@/app/features/sensors';
import { useHomeAssistant, useI18n, useTheme } from '@/app/hooks';
import { homeAssistantService } from '@/app/services/home-assistant.service';
import type { DeviceMetric } from '@/app/types/device.types';
import { storage } from '@/app/utils/storage';
import type { SwitchCardProps } from './switch-card.types';

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

export function useSwitchCardController({
  id,
  name,
  size,
  initialState = false,
  entityType,
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
  const { t } = useI18n();
  const liveEntity = entities?.[id];
  const resolvedEntityType = entityType || t('lighting.type.switch');

  useEffect(() => {
    if (liveEntity) {
      setIsOn(liveEntity.state === 'on');
      return;
    }
    setIsOn(initialState);
  }, [initialState, liveEntity]);

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

  const cardColors = isOn ? colors.switch.on : colors.switch.off;
  const textColor =
    theme === 'light'
      ? isOn
        ? 'text-gray-900'
        : 'text-gray-700'
      : isOn
        ? 'text-white'
        : 'text-gray-100';
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
    ariaLabel: `${name} ${t('lighting.type.switch').toLowerCase()}`,
    ariaPressed: isOn,
    isEditMode,
    onToggle: () => {
      const nextIsOn = !isOn;
      setIsOn(nextIsOn);
      void homeAssistantService.updateSwitch(id, nextIsOn ? 'on' : 'off').catch((error) => {
        setIsOn(!nextIsOn);
        toast.error(
          error instanceof Error ? error.message : t('lighting.feedback.updateSwitchFailed')
        );
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

  const formatPower = (watts?: number) => {
    if (!watts) return null;
    if (watts >= 1000) return `${(watts / 1000).toFixed(1)} kW`;
    return `${watts} W`;
  };

  const formatMetricValue = (metric: DeviceMetric) =>
    typeof metric.value === 'number'
      ? metric.label === 'Power'
        ? formatPower(metric.value)
        : `${metric.value.toFixed(metric.unit === 'kWh' ? 2 : 0)}${metric.unit ? ` ${metric.unit}` : ''}`
      : metric.value;

  const getMetricLabel = (metric: DeviceMetric) => {
    switch (metric.label) {
      case 'Power':
        return t('lighting.metrics.power');
      case 'Voltage':
        return t('lighting.metrics.voltage');
      case 'Energy':
        return t('lighting.metrics.energy');
      default:
        return metric.label;
    }
  };

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

  return {
    availableMetrics,
    cardColors,
    cardInteraction,
    dialogSurface,
    entityType: resolvedEntityType,
    formatMetricValue,
    getMetricLabel,
    handleMetricToggle,
    hasControlsDialog,
    hasMetrics,
    isDialogOpen,
    isOn,
    labelColor,
    metricLimit,
    metricSectionDescription:
      metricLimit === 1
        ? t('lighting.switch.metricLimit.one', { count: metricLimit })
        : t('lighting.switch.metricLimit.other', { count: metricLimit }),
    metricSectionTitle: t('lighting.switch.cardMetric'),
    roomLabel: t('lighting.settings.room'),
    renderMetricIcon,
    selectedMetricLabels,
    selectedMetrics,
    setIsDialogOpen,
    settingsButtonClass,
    showSettingsButton,
    textColor,
    theme,
    valueColor,
  };
}
