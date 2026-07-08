import { ChevronRight, Rss } from 'lucide-react';
import type { CardSize } from '@/app/components/shared/card-size-selector';
import { CardSizeSelector } from '@/app/components/shared/card-size-selector';
import type { PrimaryColor, ThemeType } from '@/app/hooks';
import { getRSSFeedCardSurfaceTokens } from './surface-tokens';
import type { RSSItem } from './types';

interface RSSFeedCardViewProps {
  inEditMode?: boolean;
  size?: CardSize;
  onSizeChange?: (size: CardSize) => void;
  theme: ThemeType;
  primaryColor: PrimaryColor;
  colors: {
    rss: {
      gradient: string;
      border: string;
      glow: string;
    };
  };
  isSmall: boolean;
  isMedium: boolean;
  latestArticle: RSSItem;
  mediumArticles: RSSItem[];
  largeArticles: RSSItem[];
  handleArticleClick: (url: string) => void;
}

export function RSSFeedCardView({
  inEditMode = false,
  size = 'medium',
  onSizeChange,
  theme,
  primaryColor,
  colors,
  isSmall,
  isMedium,
  latestArticle,
  mediumArticles,
  largeArticles,
  handleArticleClick,
}: RSSFeedCardViewProps) {
  const rssSurface = getRSSFeedCardSurfaceTokens(theme, primaryColor);

  return (
    <div
      className={`
        relative group overflow-hidden
        h-full w-full rounded-3xl
        bg-gradient-to-br ${colors.rss.gradient}
        backdrop-blur-xl border ${colors.rss.border}
        ${rssSurface.containerShadowClassName}
        transition-all duration-300
        ${inEditMode ? 'cursor-move' : 'cursor-default'}
      `}
    >
      {/* Glass overlay */}
      <div className={`absolute inset-0 ${rssSurface.overlayClassName}`} />

      {/* Subtle glow */}
      <div className={`absolute inset-0 bg-gradient-to-br ${colors.rss.glow} to-transparent`} />

      {/* Content */}
      <div className="relative h-full flex flex-col p-4">
        {/* Header */}
        <div className={`flex items-start justify-between ${isSmall ? 'mb-2' : 'mb-3'}`}>
          <div className="min-w-0 flex-1 text-left">
            <span className={`text-left text-sm font-semibold ${rssSurface.surface.textPrimary}`}>
              News Feed
            </span>
          </div>

          <div
            className={`ml-2 flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full ${rssSurface.iconWrapClassName}`}
            style={{ backgroundColor: rssSurface.iconBackgroundColor }}
          >
            <Rss className="h-5 w-5" style={{ color: rssSurface.iconColor }} />
          </div>
        </div>

        {inEditMode && onSizeChange && (
          <CardSizeSelector currentSize={size} onSizeChange={onSizeChange} />
        )}

        {isSmall ? (
          // Small: Single latest article
          <div className="flex-1 flex flex-col justify-between items-start text-left">
            <div className="w-full">
              <h3
                className={`mb-2 text-left text-lg font-semibold leading-tight line-clamp-2 ${rssSurface.surface.textPrimary}`}
              >
                {latestArticle.title}
              </h3>
              <div className="flex items-center gap-1.5 text-xs">
                <span style={{ color: rssSurface.sourceColor }}>{latestArticle.source}</span>
                <span className={rssSurface.dotClassName}>•</span>
                <span className={rssSurface.textSecondaryClassName}>{latestArticle.timeAgo}</span>
              </div>
            </div>

            <div className={`flex items-center gap-1 text-xs ${rssSurface.readMoreClassName}`}>
              <span>Read more</span>
              <ChevronRight className="w-3 h-3" />
            </div>
          </div>
        ) : isMedium ? (
          // Medium: 3 articles in list
          <div className="flex-1 overflow-hidden">
            <div className="space-y-3">
              {mediumArticles.map((item, index) => (
                <a
                  key={item.id}
                  href={item.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`group/item -m-2 block cursor-pointer rounded-lg p-2 text-left no-underline transition-colors ${rssSurface.hoverClassName}`}
                  onClick={(e) => {
                    e.stopPropagation();
                    handleArticleClick(item.url);
                  }}
                >
                  <h3
                    className={`mb-1 text-left text-sm font-semibold leading-tight line-clamp-2 transition-colors ${rssSurface.surface.textPrimary}`}
                  >
                    {item.title}
                  </h3>
                  <div className="flex items-center gap-1.5 text-xs">
                    <span style={{ color: rssSurface.sourceColor }}>{item.source}</span>
                    <span className={rssSurface.dotClassName}>•</span>
                    <span className={rssSurface.textSecondaryClassName}>{item.timeAgo}</span>
                  </div>
                  {index < mediumArticles.length - 1 && (
                    <div className={`mt-3 h-px ${rssSurface.dividerClassName}`} />
                  )}
                </a>
              ))}
            </div>
          </div>
        ) : (
          // Large: Articles with images
          <div className="flex-1 overflow-hidden">
            <div className="space-y-2">
              {largeArticles.map((item, index) => (
                <a
                  key={item.id}
                  href={item.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`group/item -m-2 block cursor-pointer rounded-xl p-2 text-left no-underline transition-colors ${rssSurface.hoverClassName}`}
                  onClick={(e) => {
                    e.stopPropagation();
                    handleArticleClick(item.url);
                  }}
                >
                  <div className="flex gap-3">
                    {/* Thumbnail */}
                    {item.imageUrl && (
                      <div
                        className={`h-20 w-20 flex-shrink-0 overflow-hidden rounded-lg ${rssSurface.thumbnailClassName}`}
                      >
                        <img
                          src={item.imageUrl}
                          alt={item.title}
                          className="w-full h-full object-cover opacity-80 group-hover/item:opacity-100 transition-opacity"
                        />
                      </div>
                    )}

                    {/* Content */}
                    <div className="flex-1 min-w-0 text-left">
                      <h3
                        className={`mb-1 text-left text-sm font-semibold leading-tight line-clamp-2 transition-colors ${rssSurface.surface.textPrimary}`}
                      >
                        {item.title}
                      </h3>
                      <div className="flex items-center gap-1.5 text-xs mb-1">
                        <span style={{ color: rssSurface.sourceColor }}>{item.source}</span>
                        <span className={rssSurface.dotClassName}>•</span>
                        <span className={rssSurface.textSecondaryClassName}>{item.timeAgo}</span>
                      </div>
                      {item.excerpt && (
                        <p
                          className={`text-left text-xs line-clamp-1 ${rssSurface.excerptClassName}`}
                        >
                          {item.excerpt}
                        </p>
                      )}
                    </div>
                  </div>
                  {index < largeArticles.length - 1 && (
                    <div className={`mt-2 h-px ${rssSurface.dividerClassName}`} />
                  )}
                </a>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
