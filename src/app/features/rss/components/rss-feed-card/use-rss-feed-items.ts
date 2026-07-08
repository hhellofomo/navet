import { formatDistanceToNow } from 'date-fns';
import type { HassEntities } from 'home-assistant-js-websocket';
import { useEffect, useMemo, useState } from 'react';
import type { RSSItem, RSSProvider } from './types';

const RSS_PROXY_PATH = '/__navet_rss_proxy__';

const stripHtml = (value: string): string =>
  value
    .replace(/<[^>]+>/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();

const readNodeText = (element: Element | null | undefined): string | undefined => {
  const value = element?.textContent?.trim();
  return value ? value : undefined;
};

const readFirstText = (root: Element, selectors: string[]): string | undefined => {
  for (const selector of selectors) {
    const match = root.querySelector(selector);
    const value = readNodeText(match);
    if (value) {
      return value;
    }
  }

  return undefined;
};

const toRSSItem = ({
  id,
  title,
  providerName,
  link,
  publishedAtRaw,
  excerpt,
  imageUrl,
}: {
  id: string;
  title: string;
  providerName: string;
  link: string;
  publishedAtRaw?: string;
  excerpt?: string;
  imageUrl?: string;
}): RSSItem => {
  const publishedAt = publishedAtRaw ? new Date(publishedAtRaw) : null;
  const hasValidPublishedAt = publishedAt && !Number.isNaN(publishedAt.getTime());

  return {
    id,
    title,
    source: providerName,
    timeAgo: hasValidPublishedAt
      ? formatDistanceToNow(publishedAt, { addSuffix: true })
      : 'Recently',
    url: link,
    excerpt: excerpt ? stripHtml(excerpt) : undefined,
    imageUrl,
  };
};

const parseRSSDocument = (xml: string, providerName: string): RSSItem[] => {
  const parser = new DOMParser();
  const document = parser.parseFromString(xml, 'application/xml');
  const parserError = document.querySelector('parsererror');

  if (parserError) {
    throw new Error('Invalid feed format');
  }

  const rssItems = Array.from(document.querySelectorAll('rss > channel > item'));
  if (rssItems.length > 0) {
    return rssItems
      .map((item) => {
        const link = readFirstText(item, ['link']) ?? readFirstText(item, ['guid']);
        const title = readFirstText(item, ['title']);

        if (!link || !title) {
          return null;
        }

        const mediaContent = item.querySelector('media\\:content, content');
        const mediaThumbnail = item.querySelector('media\\:thumbnail, thumbnail');

        return toRSSItem({
          id: readFirstText(item, ['guid']) ?? link,
          title,
          providerName,
          link,
          publishedAtRaw: readFirstText(item, ['pubDate', 'dc\\:date']),
          excerpt: readFirstText(item, ['description', 'content\\:encoded']),
          imageUrl:
            mediaContent?.getAttribute('url') ?? mediaThumbnail?.getAttribute('url') ?? undefined,
        });
      })
      .filter((item): item is RSSItem => item !== null);
  }

  const atomEntries = Array.from(document.querySelectorAll('feed > entry'));
  return atomEntries
    .map((entry) => {
      const link =
        entry.querySelector('link[rel="alternate"]')?.getAttribute('href') ??
        entry.querySelector('link')?.getAttribute('href') ??
        undefined;
      const title = readFirstText(entry, ['title']);

      if (!link || !title) {
        return null;
      }

      return toRSSItem({
        id: readFirstText(entry, ['id']) ?? link,
        title,
        providerName,
        link,
        publishedAtRaw: readFirstText(entry, ['published', 'updated']),
        excerpt: readFirstText(entry, ['summary', 'content']),
      });
    })
    .filter((item): item is RSSItem => item !== null);
};

async function fetchUrlProviderItems(provider: RSSProvider): Promise<RSSItem[]> {
  if (!provider.feedUrl) {
    return [];
  }

  const requestUrl = `${RSS_PROXY_PATH}?url=${encodeURIComponent(provider.feedUrl)}`;
  const response = await fetch(requestUrl);

  if (!response.ok) {
    throw new Error(`Unable to load ${provider.name}`);
  }

  const xml = await response.text();
  return parseRSSDocument(xml, provider.name).slice(0, 8);
}

function getHomeAssistantProviderItems(
  provider: RSSProvider,
  entities: HassEntities | null
): RSSItem[] {
  if (provider.type !== 'home-assistant-feedreader' || !provider.entityId || !entities) {
    return [];
  }

  const entity = entities[provider.entityId];
  if (!entity) {
    return [];
  }

  const attributes = entity.attributes as Record<string, unknown> | undefined;
  const link = typeof attributes?.link === 'string' ? attributes.link : undefined;
  const title =
    (typeof attributes?.title === 'string' && attributes.title) ||
    (typeof attributes?.friendly_name === 'string' && attributes.friendly_name) ||
    undefined;

  if (!link || !title) {
    return [];
  }

  return [
    toRSSItem({
      id: provider.entityId,
      title,
      providerName: provider.name,
      link,
      publishedAtRaw:
        (typeof attributes?.published === 'string' && attributes.published) ||
        (typeof attributes?.pubDate === 'string' && attributes.pubDate) ||
        (typeof attributes?.updated === 'string' && attributes.updated) ||
        undefined,
      excerpt:
        (typeof attributes?.summary === 'string' && attributes.summary) ||
        (typeof attributes?.description === 'string' && attributes.description) ||
        undefined,
      imageUrl:
        (typeof attributes?.image === 'string' && attributes.image) ||
        (typeof attributes?.entity_picture === 'string' && attributes.entity_picture) ||
        undefined,
    }),
  ];
}

const dedupeItems = (items: RSSItem[]): RSSItem[] =>
  items.filter(
    (item, index, allItems) =>
      allItems.findIndex((candidate) => candidate.url === item.url) === index
  );

export function useRSSFeedItems(providers: RSSProvider[], entities: HassEntities | null) {
  const [items, setItems] = useState<RSSItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (providers.length === 0) {
      setItems([]);
      setIsLoading(false);
      setError(null);
      return;
    }

    let cancelled = false;

    const loadItems = async () => {
      setIsLoading(true);
      setError(null);

      try {
        const results = await Promise.allSettled(
          providers.map((provider) =>
            provider.type === 'home-assistant-feedreader'
              ? Promise.resolve(getHomeAssistantProviderItems(provider, entities))
              : fetchUrlProviderItems(provider)
          )
        );

        if (cancelled) {
          return;
        }

        const nextItems = dedupeItems(
          results.flatMap((result) => (result.status === 'fulfilled' ? result.value : []))
        ).slice(0, 8);

        const failedResults = results.filter((result) => result.status === 'rejected');

        setItems(nextItems);
        setError(
          nextItems.length === 0 && failedResults.length > 0 ? 'Unable to load feeds' : null
        );
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
  }, [entities, providers]);

  const latestArticle = items[0] ?? null;
  const mediumArticles = useMemo(() => items.slice(0, 3), [items]);
  const largeArticles = useMemo(() => items.slice(0, 5), [items]);

  return {
    items,
    latestArticle,
    mediumArticles,
    largeArticles,
    isLoading,
    error,
  };
}
