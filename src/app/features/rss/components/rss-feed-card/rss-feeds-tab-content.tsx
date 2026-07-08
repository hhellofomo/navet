import { Trash2 } from 'lucide-react';
import type { CSSProperties } from 'react';
import { SelectableCheckboxRow } from '@/app/components/patterns';
import { InteractivePill } from '@/app/components/primitives';
import { DialogSectionRow } from '@/app/components/shared/device-editor';
import { withTintAlpha } from '@/app/components/shared/theme/custom-card-tint-surface';
import type { TranslateFn } from '@/app/hooks';
import type { RSSFeedCardSurfaceTokens } from './surface-tokens';
import type { RSSProvider } from './types';

interface RSSFeedsTabContentProps {
  hasProviders: boolean;
  homeAssistantProviders: RSSProvider[];
  directProviders: RSSProvider[];
  selectedProviderIds: string[];
  onToggleProvider: (providerId: string) => void;
  onRemoveProvider?: (providerId: string) => void;
  accentColorValue: string;
  textPrimaryColor: string;
  textSecondaryColor: string;
  sectionStyle?: CSSProperties;
  surface: RSSFeedCardSurfaceTokens;
  t: TranslateFn;
}

export function RSSFeedsTabContent({
  hasProviders,
  homeAssistantProviders,
  directProviders,
  selectedProviderIds,
  onToggleProvider,
  onRemoveProvider,
  accentColorValue,
  textPrimaryColor,
  textSecondaryColor,
  sectionStyle,
  surface,
  t,
}: RSSFeedsTabContentProps) {
  if (!hasProviders) {
    return (
      <div
        className={`rounded-2xl border border-dashed px-4 py-5 text-sm ${surface.surface.border} ${surface.surface.textSecondary}`}
      >
        {t('rss.settings.emptyState')}
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {homeAssistantProviders.length > 0 && (
        <RSSProviderGroup
          title={t('rss.settings.availableHomeAssistantFeeds')}
          providers={homeAssistantProviders}
          selectedProviderIds={selectedProviderIds}
          onToggleProvider={onToggleProvider}
          accentColorValue={accentColorValue}
          textPrimaryColor={textPrimaryColor}
          textSecondaryColor={textSecondaryColor}
          sectionStyle={sectionStyle}
          surface={surface}
          t={t}
        />
      )}

      {directProviders.length > 0 && (
        <RSSProviderGroup
          title={t('rss.settings.savedDirectFeeds')}
          providers={directProviders}
          selectedProviderIds={selectedProviderIds}
          onToggleProvider={onToggleProvider}
          onRemoveProvider={onRemoveProvider}
          accentColorValue={accentColorValue}
          textPrimaryColor={textPrimaryColor}
          textSecondaryColor={textSecondaryColor}
          sectionStyle={sectionStyle}
          surface={surface}
          t={t}
        />
      )}
    </div>
  );
}

function RSSProviderGroup({
  title,
  providers,
  selectedProviderIds,
  onToggleProvider,
  onRemoveProvider,
  accentColorValue,
  textPrimaryColor,
  textSecondaryColor,
  sectionStyle,
  surface,
  t,
}: {
  title: string;
  providers: RSSProvider[];
  selectedProviderIds: string[];
  onToggleProvider: (providerId: string) => void;
  onRemoveProvider?: (providerId: string) => void;
  accentColorValue: string;
  textPrimaryColor: string;
  textSecondaryColor: string;
  sectionStyle?: CSSProperties;
  surface: RSSFeedCardSurfaceTokens;
  t: TranslateFn;
}) {
  return (
    <DialogSectionRow label={title}>
      <div className="space-y-2">
        {providers.map((provider) => {
          const isSelected = selectedProviderIds.includes(provider.id);
          const secondaryLabel =
            provider.type === 'home-assistant-feedreader' ? provider.entityId : provider.feedUrl;
          const isRemovable = provider.type === 'url' && onRemoveProvider;
          const rowStyle = {
            ...sectionStyle,
            backgroundColor: withTintAlpha(accentColorValue, isSelected ? 0.18 : 0.1),
            borderColor: withTintAlpha(accentColorValue, isSelected ? 0.38 : 0.24),
          } satisfies CSSProperties;

          return (
            <SelectableCheckboxRow
              key={provider.id}
              checked={isSelected}
              onCheckedChange={() => onToggleProvider(provider.id)}
              label={<span style={{ color: textPrimaryColor }}>{provider.name}</span>}
              description={<span style={{ color: textSecondaryColor }}>{secondaryLabel}</span>}
              rowClassName={`items-center px-4 ${surface.surface.border}`}
              labelClassName="truncate"
              descriptionClassName="truncate"
              checkboxPaletteColor={accentColorValue}
              selectedStyle={rowStyle}
              unselectedStyle={rowStyle}
              action={
                isRemovable ? (
                  <InteractivePill
                    active={false}
                    intent="action"
                    size="compact"
                    className="shrink-0 min-h-8 w-8 px-0"
                    onClick={(event) => {
                      event.preventDefault();
                      onRemoveProvider?.(provider.id);
                    }}
                    style={{
                      backgroundColor: withTintAlpha(accentColorValue, 0.1),
                      color: textSecondaryColor,
                      borderColor: withTintAlpha(accentColorValue, 0.24),
                    }}
                    aria-label={t('rss.settings.removeProvider', { name: provider.name })}
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </InteractivePill>
                ) : null
              }
            />
          );
        })}
      </div>
    </DialogSectionRow>
  );
}
