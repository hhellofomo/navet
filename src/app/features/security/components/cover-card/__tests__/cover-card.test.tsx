import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import type { ComponentProps } from 'react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { I18nProvider } from '@/app/i18n/i18n-provider';
import { CoverCard } from '../index';

const { callServiceMock, toastErrorMock } = vi.hoisted(() => ({
  callServiceMock: vi.fn().mockResolvedValue(undefined),
  toastErrorMock: vi.fn(),
}));

vi.mock('@/app/services/home-assistant.service', async () => {
  const actual = await vi.importActual<typeof import('@/app/services/home-assistant.service')>(
    '@/app/services/home-assistant.service'
  );

  return {
    ...actual,
    homeAssistantService: {
      ...actual.homeAssistantService,
      callService: callServiceMock,
    },
  };
});

vi.mock('sonner', () => ({
  toast: {
    error: toastErrorMock,
  },
}));

const COVER_FEATURE_OPEN = 1;
const COVER_FEATURE_CLOSE = 2;
const COVER_FEATURE_SET_POSITION = 4;
const COVER_FEATURE_STOP = 8;
const ALL_COVER_FEATURES =
  COVER_FEATURE_OPEN | COVER_FEATURE_CLOSE | COVER_FEATURE_SET_POSITION | COVER_FEATURE_STOP;

function renderCoverCard(props: Partial<ComponentProps<typeof CoverCard>> = {}) {
  return render(
    <I18nProvider>
      <CoverCard
        id="cover.living_room_blind"
        name="Living Room Blind"
        room="Living Room"
        initialPosition={50}
        hasPosition
        supportedFeatures={ALL_COVER_FEATURES}
        size="large"
        isEditMode={false}
        onSizeChange={vi.fn()}
        {...props}
      />
    </I18nProvider>
  );
}

describe('CoverCard', () => {
  beforeEach(() => {
    callServiceMock.mockReset();
    callServiceMock.mockResolvedValue(undefined);
    toastErrorMock.mockReset();
  });

  it('calls the Home Assistant open cover service', async () => {
    renderCoverCard();

    fireEvent.click(screen.getByRole('button', { name: 'Open' }));

    await waitFor(() =>
      expect(callServiceMock).toHaveBeenCalledWith(
        'cover',
        'open_cover',
        {},
        { entity_id: 'cover.living_room_blind' }
      )
    );
  });

  it('calls the Home Assistant close cover service', async () => {
    renderCoverCard();

    fireEvent.click(screen.getByRole('button', { name: 'Close' }));

    await waitFor(() =>
      expect(callServiceMock).toHaveBeenCalledWith(
        'cover',
        'close_cover',
        {},
        { entity_id: 'cover.living_room_blind' }
      )
    );
  });

  it('calls the Home Assistant stop cover service', async () => {
    renderCoverCard();

    fireEvent.click(screen.getByRole('button', { name: 'Stop' }));

    await waitFor(() =>
      expect(callServiceMock).toHaveBeenCalledWith(
        'cover',
        'stop_cover',
        {},
        { entity_id: 'cover.living_room_blind' }
      )
    );
  });

  it('calls the Home Assistant set cover position service from presets', async () => {
    renderCoverCard();

    fireEvent.click(screen.getByRole('button', { name: '75' }));

    await waitFor(() =>
      expect(callServiceMock).toHaveBeenCalledWith(
        'cover',
        'set_cover_position',
        { position: 75 },
        { entity_id: 'cover.living_room_blind' }
      )
    );
  });

  it('disables position presets when set position is unsupported', () => {
    renderCoverCard({
      supportedFeatures: COVER_FEATURE_OPEN | COVER_FEATURE_CLOSE | COVER_FEATURE_STOP,
    });

    expect(screen.getByRole('button', { name: '75' })).toBeDisabled();
  });

  it('shows service action failures through the shared handler', async () => {
    callServiceMock.mockRejectedValue('failed');
    renderCoverCard();

    fireEvent.click(screen.getByRole('button', { name: 'Open' }));

    await waitFor(() => expect(toastErrorMock).toHaveBeenCalledWith('Unable to update cover'));
  });
});
