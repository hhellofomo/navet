import { useMediaQuery } from './use-media-query';

/**
 * Returns the zone grid column count for the current viewport, matching the
 * same breakpoints used by room views across the dashboard.
 *
 * | Breakpoint   | Width    | Columns |
 * |------------- |----------|---------|
 * | < md         | < 768px  | 2       |
 * | md           | 768px+   | 4       |
 * | xl           | 1280px+  | 6       |
 * | 2xl          | 1536px+  | 8       |
 */
export function useBreakpointCols(): number {
  const isMd = useMediaQuery('(min-width: 768px)');
  const isXl = useMediaQuery('(min-width: 1280px)');
  const is2xl = useMediaQuery('(min-width: 1536px)');

  if (is2xl) return 8;
  if (isXl) return 6;
  if (isMd) return 4;
  return 2;
}
