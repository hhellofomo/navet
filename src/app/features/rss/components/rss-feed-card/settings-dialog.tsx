import * as Dialog from '@radix-ui/react-dialog';
import { Check, Plus, Trash2 } from 'lucide-react';
import { useState } from 'react';
import { DialogHeader } from '@/app/components/shared/device-editor';
import { getThemeSurfaceTokens } from '@/app/components/shared/theme/theme-surface-tokens';
import { useI18n } from '@/app/hooks';
import type { ThemeType } from '@/app/hooks/use-theme';
import type { RSSProvider } from './types';

interface RSSFeedSettingsDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  theme: ThemeType;
  providers: RSSProvider[];
  selectedProviderIds: string[];
  onSelectedProviderIdsChange: (providerIds: string[]) => void;
  onAddProvider: (name: string, feedUrl: string) => boolean;
  onRemoveProvider: (providerId: string) => void;
  onDeleteSelectedProviders: () => void;
}

export function RSSFeedSettingsDialog({
  isOpen,
  onOpenChange,
  title,
  theme,
  providers,
  selectedProviderIds,
  onSelectedProviderIdsChange,
  onAddProvider,
  onRemoveProvider,
  onDeleteSelectedProviders,
}: RSSFeedSettingsDialogProps) {
  const surface = getThemeSurfaceTokens(theme);
  const { t } = useI18n();
  const [providerName, setProviderName] = useState('');
  const [providerUrl, setProviderUrl] = useState('');

  const handleToggleProvider = (providerId: string) => {
    const isSelected = selectedProviderIds.includes(providerId);
    onSelectedProviderIdsChange(
      isSelected
        ? selectedProviderIds.filter((id) => id !== providerId)
        : [...selectedProviderIds, providerId]
    );
  };

  const handleAddProvider = () => {
    const wasAdded = onAddProvider(providerName, providerUrl);
    if (wasAdded) {
      setProviderName('');
      setProviderUrl('');
    }
  };

  return (
    <Dialog.Root open={isOpen} onOpenChange={onOpenChange}>
      <Dialog.Portal>
        <Dialog.Overlay className={`fixed inset-0 z-50 ${surface.dialogBackdrop}`} />
        <Dialog.Content
          className={`fixed top-1/2 left-1/2 z-50 w-[90vw] max-w-lg -translate-x-1/2 -translate-y-1/2 rounded-3xl border p-6 shadow-2xl backdrop-blur-xl ${surface.panel} ${surface.border}`}
        >
          <DialogHeader
            title={t('rss.settings.title')}
            description={t('rss.settings.description', { title })}
            isOn={theme !== 'light'}
          />

          <div className="mb-4 space-y-2">
            <div className="flex items-center justify-between gap-3">
              <div className={`text-xs font-medium ${surface.textSecondary}`}>
                {t('rss.settings.selectedProviders')}
              </div>
              {selectedProviderIds.length > 0 && (
                <button
                  type="button"
                  onClick={onDeleteSelectedProviders}
                  className={`inline-flex items-center gap-2 rounded-xl px-3 py-1.5 text-xs font-medium ${surface.textPrimary} ${surface.subtleBg} ${surface.hoverBg}`}
                >
                  <Trash2 className="h-3.5 w-3.5" />
                  {t('rss.settings.deleteSelected')}
                </button>
              )}
            </div>
            {providers.map((provider) => {
              const isSelected = selectedProviderIds.includes(provider.id);
              const secondaryLabel =
                provider.type === 'home-assistant-feedreader'
                  ? provider.entityId
                  : provider.feedUrl;
              const isRemovable = provider.type === 'url';

              return (
                <div
                  key={provider.id}
                  className={`flex w-full items-center justify-between rounded-2xl border px-4 py-3 transition-colors ${surface.border} ${surface.subtleBg}`}
                >
                  <button
                    type="button"
                    onClick={() => handleToggleProvider(provider.id)}
                    className="min-w-0 flex-1 text-left"
                  >
                    <div className={`truncate text-sm font-medium ${surface.textPrimary}`}>
                      {provider.name}
                    </div>
                    <div className={`mt-0.5 truncate text-xs ${surface.textSecondary}`}>
                      {secondaryLabel}
                    </div>
                  </button>

                  <div className="ml-4 flex items-center gap-2">
                    {isRemovable && (
                      <button
                        type="button"
                        onClick={(event) => {
                          event.stopPropagation();
                          onRemoveProvider(provider.id);
                        }}
                        className={`rounded-xl p-2 ${surface.textSecondary} ${surface.hoverBg}`}
                        aria-label={t('rss.settings.removeProvider', { name: provider.name })}
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    )}
                    <div
                      className={`flex h-5 w-5 items-center justify-center rounded border transition-colors ${
                        isSelected
                          ? 'border-white bg-white text-black'
                          : `${surface.border} bg-transparent`
                      }`}
                    >
                      {isSelected && <Check className="h-3.5 w-3.5" />}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="space-y-3">
            <div className={`text-xs font-medium ${surface.textSecondary}`}>
              {t('rss.settings.addDirectFeed')}
            </div>
            <input
              value={providerName}
              onChange={(event) => setProviderName(event.target.value)}
              placeholder={t('rss.settings.providerName')}
              className={`w-full rounded-2xl border px-4 py-3 text-sm outline-none ${surface.inputBg} ${surface.border} ${surface.textPrimary} ${surface.placeholder}`}
            />
            <input
              value={providerUrl}
              onChange={(event) => setProviderUrl(event.target.value)}
              placeholder={t('rss.settings.providerUrl')}
              className={`w-full rounded-2xl border px-4 py-3 text-sm outline-none ${surface.inputBg} ${surface.border} ${surface.textPrimary} ${surface.placeholder}`}
            />
            <button
              type="button"
              onClick={handleAddProvider}
              className={`inline-flex items-center gap-2 rounded-2xl px-4 py-2 text-sm font-medium ${surface.textPrimary} ${surface.subtleBg} ${surface.hoverBg}`}
            >
              <Plus className="h-4 w-4" />
              {t('rss.settings.addFeedUrl')}
            </button>
          </div>

          <div className="mt-6 flex justify-end">
            <Dialog.Close asChild>
              <button
                type="button"
                className={`rounded-xl px-4 py-2 text-sm font-medium ${surface.textPrimary} ${surface.subtleBg} ${surface.hoverBg}`}
              >
                {t('common.done')}
              </button>
            </Dialog.Close>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
