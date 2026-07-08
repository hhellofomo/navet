import { ChevronLeft, ChevronRight, Image as ImageIcon } from 'lucide-react';
import { useState } from 'react';
import { ImageWithFallback } from '@/app/components/figma/ImageWithFallback';
import { type CardSize, isCompactCardSize } from '@/app/components/shared/card-size-selector';
import { getThemeColorValue } from '@/app/components/shared/theme/theme-colors';
import { useTheme } from '@/app/hooks';
import { getDashboardWidgetSurfaceTokens } from './widget-surface-tokens';

const mockPhotos = [
  'https://images.unsplash.com/photo-1767858702764-39693c994ee1?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmYW1pbHklMjB2YWNhdGlvbiUyMGJlYWNofGVufDF8fHx8MTc3MjY4ODE4OXww&ixlib=rb-4.1.0&q=80&w=1080',
  'https://images.unsplash.com/photo-1635351261340-55f437000b21?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb3VudGFpbiUyMGxhbmRzY2FwZSUyMHN1bnNldHxlbnwxfHx8fDE3NzI2MjkwMDJ8MA&ixlib=rb-4.1.0&q=80&w=1080',
  'https://images.unsplash.com/photo-1513563326940-e76e4641069e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjaXR5JTIwc2t5bGluZSUyMG5pZ2h0fGVufDF8fHx8MTc3MjYyMzM1Nnww&ixlib=rb-4.1.0&q=80&w=1080',
  'https://images.unsplash.com/photo-1694100381966-5cf52917d452?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxhdXR1bW4lMjBmb3Jlc3QlMjBwYXRofGVufDF8fHx8MTc3MjcxODAyNXww&ixlib=rb-4.1.0&q=80&w=1080',
  'https://images.unsplash.com/photo-1714412192114-61dca8f15f68?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx0cm9waWNhbCUyMGJlYWNoJTIwcGFyYWRpc2V8ZW58MXx8fHwxNzcyNjc5Mzk4fDA&ixlib=rb-4.1.0&q=80&w=1080',
];

interface PhotoFrameWidgetProps {
  size?: CardSize;
}

export function PhotoFrameWidget({ size = 'large' }: PhotoFrameWidgetProps) {
  const { theme, primaryColor } = useTheme();
  const surface = getDashboardWidgetSurfaceTokens(theme);
  const [currentIndex, setCurrentIndex] = useState(0);
  const isCompact = isCompactCardSize(size);

  const nextPhoto = () => {
    setCurrentIndex((prev) => (prev + 1) % mockPhotos.length);
  };

  const prevPhoto = () => {
    setCurrentIndex((prev) => (prev - 1 + mockPhotos.length) % mockPhotos.length);
  };

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
          <ImageIcon className="w-5 h-5" />
        </div>
        <div className="flex-1 min-w-0">
          <h3 className={`text-sm font-semibold ${surface.textPrimary}`}>Photo Frame</h3>
          <p className={`mt-0.5 truncate text-[10px] ${surface.textMuted}`}>Widget</p>
        </div>
      </div>

      {/* Photo Display */}
      <div className="flex-1 relative rounded-xl overflow-hidden mb-4 group">
        <ImageWithFallback
          src={mockPhotos[currentIndex]}
          alt="Photo frame"
          className="w-full h-full object-cover"
        />

        {/* Navigation Buttons */}
        {!isCompact && (
          <>
            <button
              type="button"
              onClick={prevPhoto}
              className="absolute left-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-black/50 backdrop-blur-sm flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
            >
              <ChevronLeft className="w-5 h-5 text-white" />
            </button>
            <button
              type="button"
              onClick={nextPhoto}
              className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-black/50 backdrop-blur-sm flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
            >
              <ChevronRight className="w-5 h-5 text-white" />
            </button>
          </>
        )}
      </div>

      {/* Thumbnail Dots */}
      {!isCompact && (
        <div className="flex justify-center gap-2">
          {mockPhotos.map((_, index) => (
            <button
              type="button"
              key={index}
              onClick={() => setCurrentIndex(index)}
              className="w-2 h-2 rounded-full transition-all"
              style={{
                backgroundColor:
                  index === currentIndex
                    ? getThemeColorValue(primaryColor)
                    : theme === 'light'
                      ? '#d1d5db'
                      : 'rgba(255, 255, 255, 0.3)',
              }}
            />
          ))}
        </div>
      )}
    </div>
  );
}
