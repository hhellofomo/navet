import { memo, useCallback, useEffect, useState } from 'react';
import { useEntityCardInteractionController } from '@/app/components/shared/entity-card-interaction-controller';
import { getThemeSurfaceTokens } from '@/app/components/shared/theme/theme-surface-tokens';
import { useHomeAssistant, useI18n, useServiceActionHandler, useTheme } from '@/app/hooks';
import { homeAssistantService } from '@/app/services/home-assistant.service';
import { homeAssistantSelectors } from '@/app/stores/selectors';
import { DEVICE_CLASS_CONFIG } from './constants';
import type { CoverCardProps, CoverState, DeviceClass } from './types';
import { CoverCardView } from './view';

const COVER_FEATURE_OPEN = 1;
const COVER_FEATURE_CLOSE = 2;
const COVER_FEATURE_SET_POSITION = 4;
const COVER_FEATURE_STOP = 8;

function supportsCoverFeature(
  supportedFeatures: number | undefined,
  feature: number,
  defaultValue: boolean
) {
  if (typeof supportedFeatures !== 'number') {
    return defaultValue;
  }

  return (supportedFeatures & feature) !== 0;
}

export const CoverCardContainer = memo(function CoverCardContainer({
  id,
  name,
  room,
  initialPosition,
  supportedFeatures: initialSupportedFeatures,
  hasPosition: initialHasPosition,
  initialDeviceClass = 'blind',
  size,
  onSizeChange,
  isEditMode,
}: CoverCardProps) {
  const resolvedInitialPosition = initialPosition ?? 0;
  const [position, setPosition] = useState(resolvedInitialPosition);
  const [deviceClass, setDeviceClass] = useState<DeviceClass>(initialDeviceClass);
  const [coverState, setCoverState] = useState<CoverState>(
    resolvedInitialPosition === 100 ? 'open' : resolvedInitialPosition === 0 ? 'closed' : 'open'
  );
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const { t } = useI18n();
  const runAction = useServiceActionHandler();
  const liveEntity = useHomeAssistant(homeAssistantSelectors.entity(id));
  const liveAttributes = liveEntity?.attributes as Record<string, unknown> | undefined;
  const liveSupportedFeatures =
    typeof liveAttributes?.supported_features === 'number'
      ? liveAttributes.supported_features
      : undefined;
  const resolvedSupportedFeatures = liveSupportedFeatures ?? initialSupportedFeatures;
  const hasLivePosition = typeof liveAttributes?.current_position === 'number';
  const hasPosition = hasLivePosition || Boolean(initialHasPosition);
  const canOpen = supportsCoverFeature(resolvedSupportedFeatures, COVER_FEATURE_OPEN, true);
  const canClose = supportsCoverFeature(resolvedSupportedFeatures, COVER_FEATURE_CLOSE, true);
  const canStop = supportsCoverFeature(resolvedSupportedFeatures, COVER_FEATURE_STOP, true);
  const canSetPosition =
    hasPosition &&
    supportsCoverFeature(resolvedSupportedFeatures, COVER_FEATURE_SET_POSITION, false);

  useEffect(() => {
    if (!liveEntity) return;
    const attrs = liveEntity.attributes as Record<string, unknown>;
    const livePosition = typeof attrs.current_position === 'number' ? attrs.current_position : null;
    if (livePosition !== null) {
      setPosition(livePosition);
    }
    const liveState = liveEntity.state as CoverState;
    if (['open', 'closed', 'opening', 'closing'].includes(liveState)) {
      setCoverState(liveState);
    }
  }, [liveEntity]);
  const { colors, theme } = useTheme();
  const surface = getThemeSurfaceTokens(theme);

  const callCoverService = useCallback(
    (service: string, serviceData: Record<string, unknown> = {}) =>
      homeAssistantService.callService('cover', service, serviceData, { entity_id: id }),
    [id]
  );

  // Used by the large-card slider for direct position setting.
  const handlePositionChange = (newPosition: number) => {
    if (!canSetPosition) {
      return;
    }

    setPosition(newPosition);
    setCoverState(newPosition === 100 ? 'open' : newPosition === 0 ? 'closed' : 'open');
    void runAction(
      () => callCoverService('set_cover_position', { position: newPosition }),
      t('cover.feedback.updateFailed')
    );
  };

  const handleOpen = () => {
    if (!canOpen) {
      return;
    }

    setCoverState('opening');
    void runAction(() => callCoverService('open_cover'), t('cover.feedback.updateFailed'));
  };

  const handleClose = () => {
    if (!canClose) {
      return;
    }

    setCoverState('closing');
    void runAction(() => callCoverService('close_cover'), t('cover.feedback.updateFailed'));
  };

  const handleStop = () => {
    if (!canStop) {
      return;
    }

    setPosition((prev) => {
      setCoverState(prev >= 100 ? 'open' : prev <= 0 ? 'closed' : 'open');
      return prev;
    });
    void runAction(() => callCoverService('stop_cover'), t('cover.feedback.updateFailed'));
  };

  // Get state text and color — active states use the accent color, inactive use muted
  const getStateDisplay = () => {
    switch (coverState) {
      case 'open':
        return { text: t('cover.state.open'), color: colors.cover.open.accent };
      case 'opening':
        return { text: t('cover.state.opening'), color: colors.cover.open.accent };
      case 'closed':
        return { text: t('cover.state.closed'), color: surface.textSecondary };
      case 'closing':
        return { text: t('cover.state.closing'), color: surface.textSecondary };
    }
  };

  const stateDisplay = getStateDisplay();
  const cardId = `cover-${name.toLowerCase().replace(/ /g, '-')}`;
  const cardInteraction = useEntityCardInteractionController({
    ariaLabel: t('cover.ariaLabel', { name }),
    ariaPressed: position > 0,
    isEditMode,
    onToggle: () => {
      if (position > 0) {
        handleClose();
        return;
      }
      handleOpen();
    },
    onOpenControls: () => setIsSettingsOpen(true),
    onOpenSettings: () => setIsSettingsOpen(true),
  });

  return (
    <CoverCardView
      entityId={id}
      name={name}
      room={room}
      position={position}
      deviceClass={deviceClass}
      deviceClassConfig={DEVICE_CLASS_CONFIG}
      size={size}
      isEditMode={isEditMode}
      cardId={cardId}
      openColors={colors.cover.open}
      closedColors={colors.cover.closed}
      cardProps={cardInteraction.cardProps}
      iconButtonProps={cardInteraction.iconButtonProps}
      settingsButtonProps={cardInteraction.settingsButtonProps}
      theme={theme}
      stateDisplay={stateDisplay}
      isSettingsOpen={isSettingsOpen}
      setIsSettingsOpen={setIsSettingsOpen}
      onSizeChange={onSizeChange}
      handlePositionChange={handlePositionChange}
      handleOpen={handleOpen}
      handleClose={handleClose}
      handleStop={handleStop}
      canOpen={canOpen}
      canClose={canClose}
      canStop={canStop}
      canSetPosition={canSetPosition}
      setDeviceClass={setDeviceClass}
    />
  );
});
