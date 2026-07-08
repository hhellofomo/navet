import * as Dialog from '@radix-ui/react-dialog';
import { Power, Settings2 } from 'lucide-react';
import { memo } from 'react';
import { EntityCardHeaderIcon } from '@/app/components/shared/entity-card-header-icon';
import { EntityRoomSelector } from '@/app/components/shared/entity-room-selector';
import { RoundControlButton } from '@/app/components/shared/round-control-button';
import { getCardShellSurfaceTokens } from '@/app/components/shared/theme/card-shell-surface-tokens';
import { getCardStateSurfaceTokens } from '@/app/components/shared/theme/card-state-surface-tokens';
import type { SwitchCardProps } from './switch-card.types';
import { useSwitchCardController } from './use-switch-card-controller';

export const SwitchCard = memo(function SwitchCard(props: Omit<SwitchCardProps, 'room'>) {
  const controller = useSwitchCardController(props);
  const cardShell = getCardShellSurfaceTokens(controller.theme);
  const stateSurface = getCardStateSurfaceTokens(controller.theme, controller.isOn);

  return (
    <>
      <div
        {...controller.cardInteraction.cardProps}
        className={`relative h-full w-full bg-gradient-to-br ${controller.cardColors.gradient} ${cardShell.backdropClassName} rounded-3xl ${controller.theme !== 'dark' ? 'border' : ''} ${controller.cardColors.border} overflow-hidden transition-all duration-500 ${
          props.isEditMode ? 'cursor-move active:cursor-grabbing' : 'cursor-pointer'
        } ${controller.isExtraSmall ? 'px-3.5 pb-3.5 pt-3' : 'p-4'} ${stateSurface.containerClassName}`}
      >
        {controller.isOn && (
          <div
            className={`absolute inset-0 bg-gradient-to-br ${controller.cardColors.glow} to-transparent transition-all duration-500`}
          />
        )}

        {controller.theme === 'light' && <div className="absolute inset-0 bg-white/60" />}

        {cardShell.sheenOverlayClassName ? (
          <div className={cardShell.sheenOverlayClassName} />
        ) : null}

        {stateSurface.overlayClassName && (
          <div className={`absolute inset-0 ${stateSurface.overlayClassName}`} />
        )}

        <div className="relative h-full flex flex-col">
          <div
            className={`${controller.isExtraSmall ? 'mb-1.5 gap-2' : 'mb-2 gap-3'} flex items-start`}
          >
            <EntityCardHeaderIcon
              IconComponent={Power}
              isActive={controller.isOn}
              size={controller.isExtraSmall ? 'extra-small' : 'small'}
              ariaLabel={controller.cardInteraction.iconButtonProps['aria-label']}
              onClick={controller.cardInteraction.iconButtonProps.onClick}
            />
            <div className="min-w-0 flex-1">
              <h3
                className={`font-semibold ${controller.isExtraSmall ? 'text-[11px]' : 'text-xs'} ${stateSurface.primaryTextClassName} transition-colors duration-500 truncate text-left`}
              >
                {props.name}
              </h3>
              <p
                className={`${controller.isExtraSmall ? 'mt-0 text-[9px]' : 'mt-0.5 text-[10px]'} ${stateSurface.mutedTextClassName} truncate text-left`}
              >
                {controller.entityType}
              </p>
            </div>
          </div>

          <div className="flex-1" />

          <div className="relative">
            {controller.showSettingsButton && !controller.isExtraSmall && (
              <div className="absolute bottom-0 right-0">
                <RoundControlButton
                  theme={controller.theme}
                  size="small"
                  variant="neutral"
                  {...controller.cardInteraction.settingsButtonProps}
                  className={controller.settingsButtonClass}
                >
                  <Settings2 className="h-3.5 w-3.5" />
                </RoundControlButton>
              </div>
            )}
            {controller.selectedMetrics.length > 0 && (
              <div className={controller.isExtraSmall ? 'space-y-1' : 'space-y-1.5'}>
                {controller.selectedMetrics.map((metric, i) => (
                  <div
                    key={metric.label}
                    className={`flex min-w-0 flex-col ${i === controller.selectedMetrics.length - 1 && controller.showSettingsButton && !controller.isExtraSmall ? 'pr-10' : ''}`}
                  >
                    <span
                      className={`${stateSurface.secondaryTextClassName} flex items-center ${controller.isExtraSmall ? 'gap-1 text-[9px]' : 'gap-1 text-[10px]'}`}
                    >
                      {controller.renderMetricIcon(
                        metric,
                        `${controller.isExtraSmall ? 'h-2.5 w-2.5' : 'h-3 w-3'} flex-shrink-0`
                      )}
                      <span className="truncate">{controller.getMetricLabel(metric)}</span>
                    </span>
                    <span
                      className={`${stateSurface.primaryTextClassName} ${controller.isExtraSmall ? 'pl-[14px] text-[10px]' : 'pl-[16px] text-xs'} font-medium`}
                    >
                      {controller.formatMetricValue(metric)}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {controller.hasControlsDialog && controller.isDialogOpen ? (
        <Dialog.Root open={controller.isDialogOpen} onOpenChange={controller.setIsDialogOpen}>
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
                  <EntityRoomSelector entityId={props.id} label={controller.roomLabel} />
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
                      {controller.metricSectionTitle}
                    </p>
                    <p className={`mt-1 text-xs ${controller.labelColor}`}>
                      {controller.metricSectionDescription}
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
                              <span className="truncate">{controller.getMetricLabel(metric)}</span>
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
      ) : null}
    </>
  );
});
