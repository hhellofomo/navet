import { useCallback, useState } from 'react';

/**
 * Custom hook for managing boolean toggle state
 *
 * @param initialValue - Initial boolean value
 * @returns [value, toggle, setTrue, setFalse] tuple
 *
 * @example
 * const [isOpen, toggle, open, close] = useToggle(false);
 */
export function useToggle(
  initialValue: boolean = false
): [boolean, () => void, () => void, () => void] {
  const [value, setValue] = useState(initialValue);

  const toggle = useCallback(() => {
    setValue((v) => !v);
  }, []);

  const setTrue = useCallback(() => {
    setValue(true);
  }, []);

  const setFalse = useCallback(() => {
    setValue(false);
  }, []);

  return [value, toggle, setTrue, setFalse];
}
