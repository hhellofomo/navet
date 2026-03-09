import { memo } from 'react';
import { RSSFeedCardContainer } from './RSSFeedCardContainer';
import type { RSSFeedCardProps } from './rss-feed-card.types';

export const RSSFeedCard = memo(function RSSFeedCard(props: RSSFeedCardProps) {
  return <RSSFeedCardContainer {...props} />;
});
