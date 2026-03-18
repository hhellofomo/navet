import { useMediaQuery } from './use-media-query';

/**
 * Returns the zone grid column count for the current viewport, aligned with
 * Tailwind's default breakpoints.
 *
 * | Breakpoint   | Width    | Columns |
 * |------------- |----------|---------|
 * | < md         | < 768px  | 4       |
 * | md           | 768px+   | 6       |
 * | lg           | 1024px+  | 8       |
 * | xl           | 1280px+  | 12      |
 */
export function useBreakpointCols(): number {
  const isMd = useMediaQuery('(min-width: 768px)');
  const isLg = useMediaQuery('(min-width: 1024px)');
  const isXl = useMediaQuery('(min-width: 1280px)');

  if (isXl) return 12;
  if (isLg) return 8;
  if (isMd) return 6;
  return 4;
}
