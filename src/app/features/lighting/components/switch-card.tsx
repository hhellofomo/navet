import * as Dialog from '@radix-ui/react-dialog';
import { Power, Settings2 } from 'lucide-react';
import { memo } from 'react';
import { EntityCardHeaderIcon } from '@/app/components/shared/entity-card-header-icon';
import { EntityRoomSelector } from '@/app/components/shared/entity-room-selector';
import { RoundControlButton } from '@/app/components/shared/round-control-button';
import { getCardStateSurfaceTokens } from '@/app/components/shared/theme/card-state-surface-tokens';
import type { SwitchCardProps } from './switch-card.types';
import { useSwitchCardController } from './use-switch-card-controller';

export const SwitchCard = memo(function SwitchCard(props: Omit<SwitchCardProps, 'room'>) {
  const controller = useSwitchCardController(props);
  const stateSurface = getCardStateSurfaceTokens(controller.theme, controller.isOn);

  return (
    <>
      <div
        {...controller.cardInteraction.cardProps}
        className={`relative h-full w-full bg-gradient-to-br ${controller.cardColors.gradient} backdrop-blur-xl rounded-3xl p-4 border ${controller.cardColors.border} overflow-hidden transition-all duration-500 ${
          props.isEditMode ? 'cursor-move active:cursor-grabbing' : 'cursor-pointer'
        } ${stateSurface.containerClassName} ${controller.theme === 'light' && controller.isOn ? 'shadow-lg' : ''}`}
      >
        {controller.isOn && (
          <div
            className={`absolute inset-0 bg-gradient-to-br ${controller.cardColors.glow} to-transparent transition-all duration-500`}
          />
        )}

        {controller.theme === 'light' && <div className="absolute inset-0 bg-white/60" />}

        {controller.theme !== 'light' && (
          <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent" />
        )}

        {stateSurface.overlayClassName && (
          <div className={`absolute inset-0 ${stateSurface.overlayClassName}`} />
        )}

        <div className="relative h-full flex flex-col">
          <div className="mb-2 flex items-start gap-3">
            <EntityCardHeaderIcon
              IconComponent={Power}
              isActive={controller.isOn}
              size="small"
              ariaLabel={controller.cardInteraction.iconButtonProps['aria-label']}
              onClick={controller.cardInteraction.iconButtonProps.onClick}
            />
            <div className="min-w-0 flex-1">
              <h3
                className={`font-semibold text-xs ${stateSurface.primaryTextClassName} transition-colors duration-500 truncate text-left`}
              >
                {props.name}
              </h3>
              <p
                className={`text-[10px] ${stateSurface.mutedTextClassName} truncate mt-0.5 text-left`}
              >
                {controller.entityType}
              </p>
            </div>
            {controller.showSettingsButton && (
              <RoundControlButton
                theme={controller.theme}
                size="small"
                variant="neutral"
                {...controller.cardInteraction.settingsButtonProps}
                className={controller.settingsButtonClass}
              >
                <Settings2 className="h-3.5 w-3.5" />
              </RoundControlButton>
            )}
          </div>

          <div className="flex-1" />

          {controller.selectedMetrics.length > 0 && (
            <div className="space-y-0.5">
              {controller.selectedMetrics.map((metric) => (
                <div key={metric.label} className="flex items-center justify-between gap-2 text-xs">
                  <span
                    className={`${stateSurface.secondaryTextClassName} min-w-0 flex items-center gap-1 pr-2`}
                  >
                    {controller.renderMetricIcon(metric, 'h-3 w-3 flex-shrink-0')}
                    <span className="truncate">{metric.label}</span>
                  </span>
                  <span
                    className={`${stateSurface.primaryTextClassName} flex-shrink-0 whitespace-nowrap font-medium`}
                  >
                    {controller.formatMetricValue(metric)}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <Dialog.Root
        open={controller.hasControlsDialog ? controller.isDialogOpen : false}
        onOpenChange={controller.setIsDialogOpen}
      >
        <Dialog.Portal>
          <Dialog.Overlay className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm" />
          <Dialog.Content
            className={`fixed left-1/2 top-1/2 z-50 w-[90vw] max-w-md -translate-x-1/2 -translate-y-1/2 rounded-[28px] border p-6 shadow-2xl ${controller.dialogSurface}`}
          >
            <Dialog.Title className="text-xl font-semibold">{props.name}</Dialog.Title>
            <Dialog.Description className={`mt-1 text-sm ${controller.labelColor}`}>
              {controller.entityType}
            </Dialog.Description>

            <div className="mt-6 space-y-4">
              <div
                className={`rounded-2xl p-4 ${
                  controller.theme === 'light'
                    ? 'bg-gray-100'
                    : controller.theme === 'glass'
                      ? 'bg-white/8'
                      : 'bg-white/5'
                }`}
              >
                <EntityRoomSelector entityId={props.id} label="Room" />
              </div>

              {controller.hasMetrics && (
                <div
                  className={`rounded-2xl p-4 ${
                    controller.theme === 'light'
                      ? 'bg-gray-100'
                      : controller.theme === 'glass'
                        ? 'bg-white/8'
                        : 'bg-white/5'
                  }`}
                >
                  <p className={`text-xs uppercase tracking-[0.16em] ${controller.labelColor}`}>
                    Card Metric
                  </p>
                  <p className={`mt-1 text-xs ${controller.labelColor}`}>
                    Select up to {controller.metricLimit}{' '}
                    {controller.metricLimit === 1 ? 'metric' : 'metrics'} for this card.
                  </p>
                  <div className="mt-3 space-y-2">
                    {controller.availableMetrics.map((metric) => {
                      const isSelected = controller.selectedMetricLabels.includes(metric.label);
                      return (
                        <button
                          type="button"
                          key={`dialog-${metric.label}`}
                          onClick={() => controller.handleMetricToggle(metric.label)}
                          className={`flex w-full items-center justify-between gap-3 rounded-2xl border px-3 py-2 text-left transition-colors ${
                            isSelected
                              ? controller.theme === 'light'
                                ? 'border-gray-900/20 bg-white'
                                : 'border-white/20 bg-white/10'
                              : controller.theme === 'light'
                                ? 'border-transparent bg-white/60 hover:bg-white'
                                : 'border-transparent bg-white/5 hover:bg-white/10'
                          }`}
                        >
                          <span
                            className={`min-w-0 flex items-center gap-2 ${controller.labelColor}`}
                          >
                            {controller.renderMetricIcon(metric, 'h-4 w-4 flex-shrink-0')}
                            <span className="truncate">{metric.label}</span>
                          </span>
                          <div className="flex flex-shrink-0 items-center gap-3">
                            <span className={`font-medium ${controller.textColor}`}>
                              {controller.formatMetricValue(metric)}
                            </span>
                            <span
                              className={`h-4 w-4 rounded border transition-colors ${
                                isSelected
                                  ? controller.theme === 'light'
                                    ? 'border-gray-900 bg-gray-900'
                                    : 'border-white bg-white'
                                  : controller.theme === 'light'
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
