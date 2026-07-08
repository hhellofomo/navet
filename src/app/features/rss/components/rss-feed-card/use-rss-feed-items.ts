import type { HassEntities } from 'home-assistant-js-websocket';
import { useEffect, useState } from 'react';
import { useI18n } from '@/app/hooks';
import {
  deleteCachedEntry,
  getCachedEntry,
  getProviderCacheKey,
  setCachedEntry,
} from './rss-feed-cache';
import { fetchUrlProviderItems, getHomeAssistantProviderItems } from './rss-feed-fetcher';
import { dedupeItems, sortItemsByPublishedAt } from './rss-feed-parser';
import type { RSSItem, RSSProvider } from './types';

export function useRSSFeedItems(
  providers: RSSProvider[],
  entities: HassEntities | null,
  limit = 10,
  refreshNonce = 0
) {
  const { formatRelativeTime, t } = useI18n();
  const cacheKey = `${providers.map(getProviderCacheKey).join('|')}::${limit}`;
  const cachedEntry = getCachedEntry(cacheKey);
  const [items, setItems] = useState<RSSItem[]>(() => cachedEntry?.items ?? []);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(() => cachedEntry?.error ?? null);

  useEffect(() => {
    const nextCachedEntry = getCachedEntry(cacheKey);
    setItems(nextCachedEntry?.items ?? []);
    setError(nextCachedEntry?.error ?? null);
  }, [cacheKey]);

  useEffect(() => {
    if (providers.length === 0) {
      deleteCachedEntry(cacheKey);
      setItems([]);
      setIsLoading(false);
      setError(null);
      return;
    }

    let cancelled = false;

    if (refreshNonce > 0) {
      deleteCachedEntry(cacheKey);
    }

    const loadItems = async () => {
      setIsLoading(true);
      setError(null);

      try {
        const results = await Promise.allSettled(
          providers.map((provider) =>
            provider.type === 'home-assistant-feedreader'
              ? Promise.resolve(
                  getHomeAssistantProviderItems(
                    provider,
                    entities,
                    t('rss.recently'),
                    formatRelativeTime
                  )
                )
              : fetchUrlProviderItems(provider, t('rss.recently'), formatRelativeTime)
          )
        );

        if (cancelled) {
          return;
        }

        const nextItems = sortItemsByPublishedAt(
          dedupeItems(
            results.flatMap((result) => (result.status === 'fulfilled' ? result.value : []))
          )
        ).slice(0, limit);

        const failedResults = results.filter((result) => result.status === 'rejected');

        const nextError =
          nextItems.length === 0 && failedResults.length > 0 ? t('rss.error.unableToLoad') : null;

        setCachedEntry(cacheKey, nextItems, nextError);
        setItems(nextItems);
        setError(nextError);
      } finally {
        if (!cancelled) {
          setIsLoading(false);
        }
      }
    };

    void loadItems();

    return () => {
      cancelled = true;
    };
  }, [cacheKey, entities, formatRelativeTime, limit, providers, refreshNonce, t]);

  const latestArticle = items[0] ?? null;

  return {
    items,
    latestArticle,
    isLoading,
    error,
  };
}
