import { useEffect, useState } from 'react';
import { storage } from '../utils/storage';

/**
 * Custom hook for persisting state to localStorage
 *
 * @param key - The localStorage key
 * @param defaultValue - The default value if nothing is stored
 * @returns [value, setValue] tuple similar to useState
 *
 * @example
 * const [theme, setTheme] = usePersistedState('theme', 'dark');
 */
export function usePersistedState<T>(
	key: string,
	defaultValue: T
): [T, (value: T | ((prev: T) => T)) => void] {
	const [value, setValue] = useState<T>(() => {
		return storage.get(key, defaultValue);
	});

	useEffect(() => {
		storage.set(key, value);
	}, [key, value]);

	return [value, setValue];
}
