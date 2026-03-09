import { memo } from 'react';
import { CoverCardContainer } from './CoverCardContainer';
import type { CoverCardProps } from './cover-card.types';

export const CoverCard = memo(function CoverCard(props: CoverCardProps) {
  return <CoverCardContainer {...props} />;
});
