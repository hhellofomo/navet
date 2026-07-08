import { act } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { renderHookWithProviders } from '@/test/render';

const { runActionMock, serviceMock } = vi.hoisted(() => ({
  runActionMock: vi.fn(async (action: () => Promise<void>) => action()),
  serviceMock: {
    callService: vi.fn().mockResolvedValue(undefined),
  },
}));

vi.mock('@/app/hooks', () => ({
  useI18n: () => ({ t: (key: string) => key }),
  useServiceActionHandler: () => runActionMock,
}));

vi.mock('@/app/services/home-assistant.service', () => ({
  homeAssistantService: serviceMock,
}));

import { useVacuumControl } from '../use-vacuum-control';

describe('useVacuumControl', () => {
  it('starts cleaning through Home Assistant', () => {
    const { result } = renderHookWithProviders(() =>
      useVacuumControl({ entityId: 'vacuum.roborock', initialStatus: 'idle' })
    );

    act(() => result.current.handleStartCleaning());

    expect(serviceMock.callService).toHaveBeenCalledWith(
      'vacuum',
      'start',
      {},
      { entity_id: 'vacuum.roborock' }
    );
  });

  it('pauses cleaning through Home Assistant', () => {
    const { result } = renderHookWithProviders(() =>
      useVacuumControl({ entityId: 'vacuum.roborock', initialStatus: 'cleaning' })
    );

    act(() => result.current.handlePause());

    expect(serviceMock.callService).toHaveBeenCalledWith(
      'vacuum',
      'pause',
      {},
      { entity_id: 'vacuum.roborock' }
    );
  });

  it('returns the vacuum to dock through Home Assistant', () => {
    const { result } = renderHookWithProviders(() =>
      useVacuumControl({ entityId: 'vacuum.roborock', initialStatus: 'cleaning' })
    );

    act(() => result.current.handleReturnHome());

    expect(serviceMock.callService).toHaveBeenCalledWith(
      'vacuum',
      'return_to_base',
      {},
      { entity_id: 'vacuum.roborock' }
    );
  });
});
