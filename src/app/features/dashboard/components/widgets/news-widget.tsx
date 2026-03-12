import { Clock, ExternalLink, Newspaper } from 'lucide-react';
import { type CardSize, isCompactCardSize } from '@/app/components/shared/card-size-selector';
import { getThemeColorValue } from '@/app/components/shared/theme/theme-colors';
import { useTheme } from '@/app/hooks';
import { getDashboardWidgetSurfaceTokens } from './widget-surface-tokens';

interface NewsArticle {
  id: string;
  title: string;
  source: string;
  time: string;
  category: string;
  image?: string;
}

const mockArticles: NewsArticle[] = [
  {
    id: '1',
    title: 'SpaceX launches new satellite constellation',
    source: 'TechCrunch',
    time: '2h ago',
    category: 'Technology',
  },
  {
    id: '2',
    title: 'Global climate summit reaches historic agreement',
    source: 'Reuters',
    time: '4h ago',
    category: 'Environment',
  },
  {
    id: '3',
    title: 'New AI breakthrough in medical diagnostics',
    source: 'Science Daily',
    time: '6h ago',
    category: 'Science',
  },
  {
    id: '4',
    title: 'Markets hit record highs amid economic recovery',
    source: 'Bloomberg',
    time: '8h ago',
    category: 'Finance',
  },
  {
    id: '5',
    title: 'Olympic games announce new sustainability measures',
    source: 'ESPN',
    time: '10h ago',
    category: 'Sports',
  },
];

interface NewsWidgetProps {
  size?: CardSize;
}

export function NewsWidget({ size = 'large' }: NewsWidgetProps) {
  const { theme, primaryColor } = useTheme();
  const surface = getDashboardWidgetSurfaceTokens(theme);
  const isCompact = isCompactCardSize(size);

  const displayArticles = isCompact
    ? mockArticles.slice(0, 2)
    : size === 'medium'
      ? mockArticles.slice(0, 3)
      : mockArticles;

  return (
    <div className={`${surface.panelClassName} h-full flex flex-col`}>
      {/* Header */}
      <div className="flex items-center gap-3 mb-4">
        <div
          className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
          style={{
            backgroundColor: `${getThemeColorValue(primaryColor)}20`,
            color: getThemeColorValue(primaryColor),
          }}
        >
          <Newspaper className="w-5 h-5" />
        </div>
        <div className="flex-1 min-w-0">
          <h3 className={`text-sm font-semibold ${surface.textPrimary}`}>News Feed</h3>
          <p className={`text-[10px] ${surface.textMuted} truncate mt-0.5`}>Widget</p>
        </div>
      </div>

      {/* Articles List */}
      <div className="flex-1 space-y-3 overflow-y-auto">
        {displayArticles.map((article, index) => (
          <div key={article.id}>
            <div className="flex items-start gap-3 group cursor-pointer">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <span
                    className="text-xs font-medium px-2 py-0.5 rounded"
                    style={{
                      backgroundColor: `${getThemeColorValue(primaryColor)}20`,
                      color: getThemeColorValue(primaryColor),
                    }}
                  >
                    {article.category}
                  </span>
                </div>
                <p
                  className={`mb-1 line-clamp-2 text-sm font-medium ${surface.textPrimary} group-hover:underline`}
                >
                  {article.title}
                </p>
                <div className="flex items-center gap-2">
                  <p className={`text-xs ${surface.textSecondary}`}>{article.source}</p>
                  <span className={`text-xs ${surface.textSecondary}`}>•</span>
                  <div className="flex items-center gap-1">
                    <Clock className={`h-3 w-3 ${surface.textSecondary}`} />
                    <p className={`text-xs ${surface.textSecondary}`}>{article.time}</p>
                  </div>
                </div>
              </div>
              <ExternalLink
                className={`h-4 w-4 flex-shrink-0 ${surface.textSecondary} opacity-0 transition-opacity group-hover:opacity-100`}
              />
            </div>
            {index < displayArticles.length - 1 && (
              <div className={`mt-3 border-t ${surface.dividerClassName}`} />
            )}
          </div>
        ))}
      </div>

      {!isCompact && (
        <button
          type="button"
          className={`mt-4 w-full rounded-lg py-2 text-xs font-medium transition-colors ${surface.textSecondary}`}
          style={{ backgroundColor: surface.subtleFill }}
        >
          View All News
        </button>
      )}
    </div>
  );
}
