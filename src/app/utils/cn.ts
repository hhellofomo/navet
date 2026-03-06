import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

/**
 * Merges Tailwind CSS classes with clsx and tailwind-merge
 * Handles conditional classes and deduplicates Tailwind utilities
 * 
 * @example
 * cn('px-4 py-2', isActive && 'bg-blue-500', 'hover:bg-blue-600')
 * // => 'px-4 py-2 bg-blue-500 hover:bg-blue-600'
 */
export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs));
}
