import { useEffect, useRef } from 'react';

/**
 * Custom hook for running a function at a specified interval
 * 
 * @param callback - The function to run
 * @param delay - The interval delay in milliseconds (null to pause)
 * 
 * @example
 * useInterval(() => {
 *   fetchLatestData();
 * }, 5000); // Run every 5 seconds
 */
export function useInterval(callback: () => void, delay: number | null): void {
  const savedCallback = useRef(callback);

  // Remember the latest callback
  useEffect(() => {
    savedCallback.current = callback;
  }, [callback]);

  // Set up the interval
  useEffect(() => {
    if (delay === null) return;

    const id = setInterval(() => {
      savedCallback.current();
    }, delay);

    return () => clearInterval(id);
  }, [delay]);
}
