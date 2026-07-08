import { MediaFallbackArtwork } from './media-fallback-artwork';
import type { MediaArtworkPalette } from './use-media-artwork-colors';
import { withAlpha } from './use-media-artwork-colors';

interface MediaArtworkSurfaceProps {
  artwork?: string | null;
  palette: MediaArtworkPalette;
  layout?: 'full' | 'split' | 'stacked';
  imagePaddingClassName?: string;
  imageClassName?: string;
  artRegionClassName?: string;
}

export function MediaArtworkSurface({
  artwork,
  palette,
  layout = 'full',
  imagePaddingClassName = 'p-6',
  imageClassName = '',
  artRegionClassName = 'w-[44%]',
}: MediaArtworkSurfaceProps) {
  const edgeFadeMask =
    layout === 'split'
      ? 'linear-gradient(90deg, rgba(0,0,0,1) 0%, rgba(0,0,0,1) 55%, rgba(0,0,0,0.9) 68%, rgba(0,0,0,0.54) 84%, rgba(0,0,0,0.14) 95%, rgba(0,0,0,0) 100%)'
      : layout === 'stacked'
        ? 'linear-gradient(180deg, rgba(0,0,0,1) 0%, rgba(0,0,0,1) 56%, rgba(0,0,0,0.9) 70%, rgba(0,0,0,0.54) 84%, rgba(0,0,0,0.14) 95%, rgba(0,0,0,0) 100%)'
        : 'linear-gradient(90deg, rgba(0,0,0,0) 0%, rgba(0,0,0,1) 16%, rgba(0,0,0,1) 84%, rgba(0,0,0,0) 100%)';

  return (
    <div
      className="pointer-events-none absolute inset-0"
      style={{ ['--navet-media-bg' as string]: palette.dominant }}
    >
      <div
        className="absolute inset-0"
        style={{
          background:
            layout === 'split'
              ? `radial-gradient(circle at 76% 24%, ${withAlpha(palette.highlight, 0.18)} 0%, transparent 28%), radial-gradient(circle at 68% 66%, ${withAlpha(palette.vibrant, 0.24)} 0%, transparent 32%), linear-gradient(90deg, ${withAlpha(palette.dominant, 0.96)} 0%, ${withAlpha(palette.dominant, 0.94)} 28%, ${withAlpha(palette.darkMuted, 0.94)} 62%, ${withAlpha(palette.gradientEnd, 0.98)} 100%)`
              : layout === 'stacked'
                ? `radial-gradient(circle at 22% 20%, ${withAlpha(palette.highlight, 0.18)} 0%, transparent 24%), radial-gradient(circle at 68% 54%, ${withAlpha(palette.vibrant, 0.22)} 0%, transparent 32%), linear-gradient(180deg, ${withAlpha(palette.dominant, 0.96)} 0%, ${withAlpha(palette.dominant, 0.94)} 34%, ${withAlpha(palette.darkMuted, 0.94)} 68%, ${withAlpha(palette.gradientEnd, 0.98)} 100%)`
                : `linear-gradient(135deg, ${palette.dominant} 0%, ${palette.gradientEnd} 100%)`,
        }}
      />
      {artwork ? (
        <img
          src={artwork}
          alt=""
          aria-hidden="true"
          className="absolute inset-0 h-full w-full scale-[1.22] object-cover opacity-38 blur-[84px] saturate-[1.24]"
        />
      ) : (
        <MediaFallbackArtwork
          palette={palette}
          className="absolute inset-0 scale-[1.08] blur-[42px] opacity-55"
        />
      )}

      {artwork ? (
        <div
          className={`absolute overflow-hidden ${
            layout === 'split'
              ? `inset-y-0 left-0 flex items-center justify-center ${artRegionClassName}`
              : layout === 'stacked'
                ? `inset-x-0 top-0 flex items-start justify-center ${artRegionClassName || 'h-[52%]'}`
                : 'inset-y-0 left-0 flex items-center justify-center w-full'
          } ${imagePaddingClassName}`}
        >
          <div className="relative h-full w-full">
            <img
              src={artwork}
              alt=""
              aria-hidden="true"
              className={`h-full w-full object-contain object-left ${imageClassName}`}
              style={{
                WebkitMaskImage: edgeFadeMask,
                maskImage: edgeFadeMask,
              }}
            />
            {layout === 'split' ? (
              <div
                className="absolute inset-y-0 right-0 w-[48%]"
                style={{
                  background: `linear-gradient(90deg, ${withAlpha(palette.dominant, 0)} 0%, ${withAlpha(palette.dominant, 0.015)} 38%, ${withAlpha(palette.vibrant, 0.04)} 68%, ${withAlpha(palette.darkMuted, 0.08)} 100%)`,
                }}
              />
            ) : layout === 'stacked' ? (
              <div
                className="absolute inset-x-0 bottom-0 h-[48%]"
                style={{
                  background: `linear-gradient(180deg, ${withAlpha(palette.dominant, 0)} 0%, ${withAlpha(palette.dominant, 0.015)} 38%, ${withAlpha(palette.vibrant, 0.04)} 68%, ${withAlpha(palette.darkMuted, 0.08)} 100%)`,
                }}
              />
            ) : (
              <>
                <div
                  className="absolute inset-y-0 left-0 w-[20%]"
                  style={{
                    background: `linear-gradient(90deg, ${palette.dominant} 0%, rgba(0,0,0,0) 100%)`,
                  }}
                />
                <div
                  className="absolute inset-y-0 right-0 w-[20%]"
                  style={{
                    background: `linear-gradient(270deg, ${palette.dominant} 0%, rgba(0,0,0,0) 100%)`,
                  }}
                />
              </>
            )}
          </div>
        </div>
      ) : (
        <div
          className={`absolute overflow-hidden ${
            layout === 'split'
              ? `inset-y-0 left-0 flex items-center justify-center ${artRegionClassName}`
              : layout === 'stacked'
                ? `inset-x-0 top-0 flex items-start justify-center ${artRegionClassName || 'h-[52%]'}`
                : 'inset-y-0 left-0 flex items-center justify-center w-full'
          } ${imagePaddingClassName}`}
        >
          <MediaFallbackArtwork
            palette={palette}
            compact={layout !== 'split'}
            className="relative h-full w-full"
          />
        </div>
      )}

      <div
        className="absolute inset-0"
        style={{
          background: `linear-gradient(180deg, ${withAlpha(palette.highlight, 0.03)} 0%, ${withAlpha(palette.darkMuted, 0.08)} 52%, ${withAlpha(palette.darkMuted, 0.18)} 100%)`,
        }}
      />
      <div
        className="absolute inset-0"
        style={{
          background:
            layout === 'split'
              ? `linear-gradient(90deg, rgba(0,0,0,0) 0%, rgba(0,0,0,0) 64%, ${withAlpha(palette.darkMuted, 0.03)} 82%, ${withAlpha(palette.darkMuted, 0.09)} 100%)`
              : layout === 'stacked'
                ? `linear-gradient(180deg, rgba(0,0,0,0) 0%, rgba(0,0,0,0) 56%, ${withAlpha(palette.darkMuted, 0.04)} 78%, ${withAlpha(palette.darkMuted, 0.1)} 100%)`
                : `linear-gradient(180deg, rgba(0,0,0,0) 0%, ${withAlpha(palette.darkMuted, 0.12)} 64%, ${withAlpha(palette.darkMuted, 0.28)} 100%)`,
        }}
      />
    </div>
  );
}
