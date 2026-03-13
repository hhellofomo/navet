import type { MouseEventHandler, PointerEventHandler } from 'react';
import { useCallback, useEffect, useRef } from 'react';

const LONG_PRESS_DURATION_MS = 450;
const MOVE_THRESHOLD_PX = 10;

const INTERACTIVE_TARGET_SELECTOR = [
  '[data-card-interactive]',
  '[data-no-long-press]',
  'button',
  'a',
  'input',
  'select',
  'textarea',
  'label',
  '[role="button"]',
  '[role="link"]',
  '[role="switch"]',
  '[role="slider"]',
].join(', ');

interface UseDashboardEditModeLongPressOptions {
  disabled?: boolean;
  onLongPress: () => void;
}

function isEligibleLongPressTarget(target: EventTarget | null, currentTarget: EventTarget | null) {
  if (!(target instanceof Element) || !(currentTarget instanceof Element)) {
    return false;
  }

  if (!currentTarget.contains(target)) {
    return false;
  }

  return target.closest(INTERACTIVE_TARGET_SELECTOR) === null;
}

export function useDashboardEditModeLongPress({
  disabled = false,
  onLongPress,
}: UseDashboardEditModeLongPressOptions) {
  const timerRef = useRef<number | null>(null);
  const pointerIdRef = useRef<number | null>(null);
  const startXRef = useRef(0);
  const startYRef = useRef(0);
  const suppressClickRef = useRef(false);

  const clearPendingLongPress = useCallback(() => {
    if (timerRef.current !== null) {
      window.clearTimeout(timerRef.current);
      timerRef.current = null;
    }

    pointerIdRef.current = null;
  }, []);

  useEffect(() => clearPendingLongPress, [clearPendingLongPress]);

  const handlePointerDownCapture = useCallback<PointerEventHandler<HTMLDivElement>>(
    (event) => {
      if (disabled || event.button !== 0 || !event.isPrimary) {
        return;
      }

      if (!isEligibleLongPressTarget(event.target, event.currentTarget)) {
        return;
      }

      clearPendingLongPress();
      pointerIdRef.current = event.pointerId;
      startXRef.current = event.clientX;
      startYRef.current = event.clientY;
      timerRef.current = window.setTimeout(() => {
        timerRef.current = null;
        pointerIdRef.current = null;
        suppressClickRef.current = true;
        onLongPress();
      }, LONG_PRESS_DURATION_MS);
    },
    [clearPendingLongPress, disabled, onLongPress]
  );

  const handlePointerMoveCapture = useCallback<PointerEventHandler<HTMLDivElement>>(
    (event) => {
      if (event.pointerId !== pointerIdRef.current) {
        return;
      }

      const deltaX = Math.abs(event.clientX - startXRef.current);
      const deltaY = Math.abs(event.clientY - startYRef.current);

      if (deltaX > MOVE_THRESHOLD_PX || deltaY > MOVE_THRESHOLD_PX) {
        clearPendingLongPress();
      }
    },
    [clearPendingLongPress]
  );

  const handlePointerUpCapture = useCallback<PointerEventHandler<HTMLDivElement>>(() => {
    clearPendingLongPress();
  }, [clearPendingLongPress]);

  const handlePointerCancelCapture = useCallback<PointerEventHandler<HTMLDivElement>>(() => {
    clearPendingLongPress();
  }, [clearPendingLongPress]);

  const handleClickCapture = useCallback<MouseEventHandler<HTMLDivElement>>((event) => {
    if (!suppressClickRef.current) {
      return;
    }

    suppressClickRef.current = false;
    event.preventDefault();
    event.stopPropagation();
  }, []);

  return {
    onClickCapture: handleClickCapture,
    onPointerCancelCapture: handlePointerCancelCapture,
    onPointerDownCapture: handlePointerDownCapture,
    onPointerMoveCapture: handlePointerMoveCapture,
    onPointerUpCapture: handlePointerUpCapture,
  };
}
