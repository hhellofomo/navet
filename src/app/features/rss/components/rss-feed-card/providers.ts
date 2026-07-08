import type { RSSProvider } from './types';

export const DEFAULT_RSS_PROVIDERS: RSSProvider[] = [
  {
    id: 'techcrunch',
    name: 'TechCrunch',
    type: 'url',
    feedUrl: 'https://techcrunch.com/feed/',
  },
  {
    id: 'the-verge',
    name: 'The Verge',
    type: 'url',
    feedUrl: 'https://www.theverge.com/rss/index.xml',
  },
  {
    id: 'reuters-world',
    name: 'Reuters World',
    type: 'url',
    feedUrl: 'https://feeds.reuters.com/Reuters/worldNews',
  },
  {
    id: 'bbc-world',
    name: 'BBC World',
    type: 'url',
    feedUrl: 'https://feeds.bbci.co.uk/news/world/rss.xml',
  },
];
