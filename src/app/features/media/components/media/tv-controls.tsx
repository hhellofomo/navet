import {
  ChevronDown,
  ChevronUp,
  House,
  Menu,
  Minus,
  Pause,
  Play,
  Plus,
  Undo2,
  Volume2,
  VolumeX,
} from 'lucide-react';
import type { CSSProperties } from 'react';
import { CardActionRow } from '@/app/components/patterns/card-action-row';
import { CardSettingsActionButton } from '@/app/components/shared/card-settings-action-button';
import type { CardSize } from '@/app/components/shared/card-size-selector';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/app/components/ui/dropdown-menu';
import { useI18n } from '@/app/hooks';
import type { ThemeType } from '@/app/hooks/use-theme';
import type { TvRemoteAction } from '../../tv-remote-commands';
import { TvControlButton } from './tv-control-button';

interface TvTransportControlsProps {
  theme: ThemeType;
  size: CardSize;
  isPlaying: boolean;
  remoteAvailable: boolean;
  iconClassName: string;
  tvIconClass: string;
  controlStyle: CSSProperties;
  onRemoteCommand: (action: TvRemoteAction) => void;
  onTogglePlay: () => void;
}

export function TvTransportControls({
  theme,
  size,
  isPlaying,
  remoteAvailable,
  iconClassName,
  tvIconClass,
  controlStyle,
  onRemoteCommand,
  onTogglePlay,
}: TvTransportControlsProps) {
  const isSmallTvCard = size === 'small';
  const tvCardActionRowSize = isSmallTvCard ? 'small' : 'medium';
  const { t } = useI18n();

  const transportActionButtons = (
    <>
      <TvControlButton
        theme={theme}
        size="small"
        label="Menu"
        disabled={!remoteAvailable}
        style={controlStyle}
        iconClassName={iconClassName}
        onPress={() => onRemoteCommand('menu')}
      >
        <Menu className={tvIconClass} />
      </TvControlButton>
      <TvControlButton
        theme={theme}
        size="small"
        label="Home"
        disabled={!remoteAvailable}
        style={controlStyle}
        iconClassName={iconClassName}
        onPress={() => onRemoteCommand('home')}
      >
        <House className={tvIconClass} />
      </TvControlButton>
      <TvControlButton
        theme={theme}
        size="small"
        label="Back"
        disabled={!remoteAvailable}
        style={controlStyle}
        iconClassName={iconClassName}
        onPress={() => onRemoteCommand('back')}
      >
        <Undo2 className={tvIconClass} />
      </TvControlButton>
      <TvControlButton
        theme={theme}
        size="small"
        label={isPlaying ? t('media.pausePlayback') : t('media.resumePlayback')}
        style={controlStyle}
        iconClassName={iconClassName}
        onPress={onTogglePlay}
      >
        {isPlaying ? (
          <Pause className={tvIconClass} fill="currentColor" />
        ) : (
          <Play className={tvIconClass} fill="currentColor" />
        )}
      </TvControlButton>
    </>
  );

  return (
    <CardActionRow
      theme={theme}
      size={tvCardActionRowSize}
      leftContent={transportActionButtons}
      rightContent={null}
    />
  );
}

interface TvVolumeControlsProps {
  theme: ThemeType;
  size: CardSize;
  volume: number;
  isMuted: boolean;
  remoteAvailable: boolean;
  iconClassName: string;
  tvIconClass: string;
  controlStyle: CSSProperties;
  separatorColor: string;
  onVolumeChange: (value: number) => void;
  onVolumeInteractionStart: () => void;
  onVolumeInteractionEnd: () => void;
  onToggleMute: () => void;
  onRemoteCommand: (action: TvRemoteAction) => void;
}

export function TvVolumeControls({
  theme,
  size,
  volume,
  isMuted,
  remoteAvailable,
  iconClassName,
  tvIconClass,
  controlStyle,
  separatorColor,
  onVolumeChange,
  onVolumeInteractionStart,
  onVolumeInteractionEnd,
  onToggleMute,
  onRemoteCommand,
}: TvVolumeControlsProps) {
  const { t } = useI18n();
  const isMediumVerticalTv = size === 'medium-vertical';
  const tvControlClusterGap = 'gap-1.5';

  const updateVolume = (nextVolume: number) => {
    onVolumeInteractionStart();
    onVolumeChange(nextVolume);
    onVolumeInteractionEnd();
  };

  const handleVolumeUp = () => updateVolume(Math.min(100, volume + 10));
  const handleVolumeDown = () => updateVolume(Math.max(0, volume - 10));

  const volumeButtons = (
    <div className={`flex min-w-0 items-center ${tvControlClusterGap}`}>
      <TvControlButton
        theme={theme}
        size="small"
        label="Volume down"
        style={controlStyle}
        iconClassName={iconClassName}
        onPress={handleVolumeDown}
      >
        <Minus className={tvIconClass} />
      </TvControlButton>
      <TvControlButton
        theme={theme}
        size="small"
        label={isMuted ? t('media.unmuteVolume') : t('media.muteVolume')}
        style={controlStyle}
        iconClassName={iconClassName}
        onPress={onToggleMute}
      >
        {isMuted ? <VolumeX className={tvIconClass} /> : <Volume2 className={tvIconClass} />}
      </TvControlButton>
      <TvControlButton
        theme={theme}
        size="small"
        label="Volume up"
        style={controlStyle}
        iconClassName={iconClassName}
        onPress={handleVolumeUp}
      >
        <Plus className={tvIconClass} />
      </TvControlButton>
    </div>
  );

  const channelButtons = (
    <div
      className={`flex min-w-0 items-center ${tvControlClusterGap} ${!remoteAvailable ? 'opacity-70' : ''}`}
    >
      <TvControlButton
        theme={theme}
        size="small"
        label="Channel down"
        disabled={!remoteAvailable}
        style={controlStyle}
        iconClassName={iconClassName}
        onPress={() => onRemoteCommand('channelDown')}
      >
        <ChevronDown className={tvIconClass} />
      </TvControlButton>
      <TvControlButton
        theme={theme}
        size="small"
        label="Channel up"
        disabled={!remoteAvailable}
        style={controlStyle}
        iconClassName={iconClassName}
        onPress={() => onRemoteCommand('channelUp')}
      >
        <ChevronUp className={tvIconClass} />
      </TvControlButton>
    </div>
  );

  if (isMediumVerticalTv) {
    return (
      <div className={`flex flex-col ${tvControlClusterGap}`}>
        <div className="flex items-center justify-center">{volumeButtons}</div>
        <div className="h-px w-full" style={{ backgroundColor: separatorColor }} />
        <div className="flex items-center justify-center">{channelButtons}</div>
      </div>
    );
  }

  return (
    <div className={`flex min-w-0 items-center justify-start ${tvControlClusterGap}`}>
      {volumeButtons}
      {size !== 'small' ? (
        <div className="h-6 w-px shrink-0" style={{ backgroundColor: separatorColor }} />
      ) : null}
      {channelButtons}
    </div>
  );
}

interface TvSourceSelectorProps {
  theme: ThemeType;
  size: CardSize;
  source?: string;
  sourceList: string[];
  panelStyle: CSSProperties;
  onSelectSource: (source: string) => void;
}

export function TvSourceSelector({
  size,
  source,
  sourceList,
  panelStyle,
  onSelectSource,
}: TvSourceSelectorProps) {
  const { t } = useI18n();
  const isSmallTvCard = size === 'small';

  const sourceLabel =
    source &&
    source.trim().length > 0 &&
    source !== t('media.nothingPlaying') &&
    source !== t('media.nothingPlayingDescription')
      ? source
      : 'Source';

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button
          type="button"
          onClick={(event) => event.stopPropagation()}
          className={`flex h-8 min-w-0 max-w-32 items-center rounded-full border backdrop-blur-xl ${
            isSmallTvCard ? 'gap-1 px-2.5' : 'gap-1.5 px-3'
          }`}
          style={panelStyle}
        >
          <span className="min-w-0 truncate text-xs font-medium">{sourceLabel}</span>
          <ChevronDown className="h-3 w-3 shrink-0" />
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align="end"
        className="min-w-44 rounded-xl border border-white/12 bg-zinc-950/96 text-white backdrop-blur-xl"
        onClick={(event) => event.stopPropagation()}
      >
        {sourceList.length > 0 ? (
          sourceList.map((entry) => (
            <DropdownMenuItem key={entry} onClick={() => onSelectSource(entry)}>
              {entry}
            </DropdownMenuItem>
          ))
        ) : (
          <DropdownMenuItem disabled>{sourceLabel}</DropdownMenuItem>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

interface TvQuickControlsProps {
  theme: ThemeType;
  size: CardSize;
  isPlaying: boolean;
  remoteAvailable: boolean;
  iconClassName: string;
  tvIconClass: string;
  controlStyle: CSSProperties;
  onRemoteCommand: (action: TvRemoteAction) => void;
  onTogglePlay: () => void;
  onOpenDialog: () => void;
}

export function TvQuickControls({
  theme,
  size,
  isPlaying,
  remoteAvailable,
  iconClassName,
  tvIconClass,
  controlStyle,
  onRemoteCommand,
  onTogglePlay,
  onOpenDialog,
}: TvQuickControlsProps) {
  const isSmallTvCard = size === 'small';
  const tvCardActionRowSize = isSmallTvCard ? 'small' : 'medium';
  const { t } = useI18n();

  const transportActionButtons = (
    <>
      <TvControlButton
        theme={theme}
        size="small"
        label="Menu"
        disabled={!remoteAvailable}
        style={controlStyle}
        iconClassName={iconClassName}
        onPress={() => onRemoteCommand('menu')}
      >
        <Menu className={tvIconClass} />
      </TvControlButton>
      <TvControlButton
        theme={theme}
        size="small"
        label="Home"
        disabled={!remoteAvailable}
        style={controlStyle}
        iconClassName={iconClassName}
        onPress={() => onRemoteCommand('home')}
      >
        <House className={tvIconClass} />
      </TvControlButton>
      <TvControlButton
        theme={theme}
        size="small"
        label="Back"
        disabled={!remoteAvailable}
        style={controlStyle}
        iconClassName={iconClassName}
        onPress={() => onRemoteCommand('back')}
      >
        <Undo2 className={tvIconClass} />
      </TvControlButton>
      <TvControlButton
        theme={theme}
        size="small"
        label={isPlaying ? t('media.pausePlayback') : t('media.resumePlayback')}
        style={controlStyle}
        iconClassName={iconClassName}
        onPress={onTogglePlay}
      >
        {isPlaying ? (
          <Pause className={tvIconClass} fill="currentColor" />
        ) : (
          <Play className={tvIconClass} fill="currentColor" />
        )}
      </TvControlButton>
    </>
  );

  const tvSettingsButton = (
    <CardSettingsActionButton
      theme={theme}
      size={isSmallTvCard ? 'small' : 'medium'}
      variant="soft"
      onClick={(event) => {
        event.stopPropagation();
        onOpenDialog();
      }}
    />
  );

  return (
    <CardActionRow
      theme={theme}
      size={tvCardActionRowSize}
      leftContent={transportActionButtons}
      rightContent={<div className="flex items-center gap-1.5">{tvSettingsButton}</div>}
    />
  );
}
