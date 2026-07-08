import { act } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { renderHookWithProviders } from '@/test/render';
import { getGreetingPeriod, useHeaderDateTime } from '../use-header-datetime';

describe('useHeaderDateTime', () => {
  afterEach(() => {
    vi.restoreAllMocks();
    vi.useRealTimers();
  });

  it('classifies 07:30 as morning', () => {
    expect(getGreetingPeriod(7)).toBe('morning');
  });

  it('updates the greeting when the time-of-day period changes', async () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date(2026, 4, 12, 11, 59, 0));
    vi.spyOn(Math, 'random').mockReturnValue(0.5);

    const { result } = renderHookWithProviders(() => useHeaderDateTime());

    expect(result.current.greetingKey).toBe('header.greeting.morning');

    act(() => {
      vi.setSystemTime(new Date(2026, 4, 12, 12, 0, 0));
      vi.advanceTimersByTime(30_000);
    });

    expect(result.current.greetingKey).toBe('header.greeting.afternoon');
  });
});
