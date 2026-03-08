export type Section =
  | 'home'
  | 'security'
  | 'tasks'
  | 'locks'
  | 'lights'
  | 'media'
  | 'mock'
  | 'settings';

export const NAVIGATION_SECTIONS = [
  'home',
  'security',
  'tasks',
  'locks',
  'lights',
  'media',
  'mock',
  'settings',
] as const satisfies readonly Section[];

export const isSection = (value: unknown): value is Section =>
  typeof value === 'string' && NAVIGATION_SECTIONS.includes(value as Section);
