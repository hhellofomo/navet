import { fireEvent, screen, waitFor } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { homeAssistantStore } from '@/app/stores/home-assistant-store';
import { renderWithProviders } from '@/test/render';
import { resetAppStores } from '@/test/store-reset';
import { makeHassEntity } from '../../test-utils';

const { callServiceMock } = vi.hoisted(() => ({
  callServiceMock: vi.fn().mockResolvedValue(undefined),
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
      getAutomationConfig: vi.fn(async (entityId: string) => ({
        config: {
          description:
            entityId === 'automation.coffee'
              ? 'Starts the coffee machine before breakfast.'
              : undefined,
          triggers: [{ trigger: 'time', at: '07:00:00' }],
          conditions: [{ condition: 'state', entity_id: 'sun.sun', state: 'below_horizon' }],
          actions: [
            { action: 'light.turn_on', target: { entity_id: ['light.kitchen', 'light.counter'] } },
          ],
        },
      })),
    },
  };
});

import { TasksSection } from '../../index';

function setRoutineEntities() {
  homeAssistantStore.setState({
    ...homeAssistantStore.getState(),
    connected: true,
    areas: [{ area_id: 'kitchen', name: 'Kitchen' }],
    deviceRegistry: [{ id: 'device-1', area_id: 'kitchen' }],
    entityRegistry: [{ entity_id: 'automation.coffee', device_id: 'device-1' }],
    entities: {
      'automation.coffee': makeHassEntity({
        entity_id: 'automation.coffee',
        state: 'on',
        attributes: {
          friendly_name: 'Brew coffee',
          last_triggered: '2026-05-04T07:15:00.000Z',
          description: 'Starts the coffee machine before breakfast.',
          mode: 'single',
          current: 1,
        },
      }),
      'automation.night': makeHassEntity({
        entity_id: 'automation.night',
        state: 'off',
        attributes: {
          friendly_name: 'Night mode',
        },
      }),
      'scene.movie': makeHassEntity({
        entity_id: 'scene.movie',
        state: 'scening',
        attributes: {
          friendly_name: 'Movie time',
        },
      }),
      'script.goodnight': makeHassEntity({
        entity_id: 'script.goodnight',
        state: 'off',
        attributes: {
          friendly_name: 'Good night',
        },
      }),
      'sun.sun': makeHassEntity({
        entity_id: 'sun.sun',
        state: 'below_horizon',
        attributes: {
          friendly_name: 'Sun',
        },
      }),
      'light.kitchen': makeHassEntity({
        entity_id: 'light.kitchen',
        state: 'off',
        attributes: {
          friendly_name: 'Kitchen light',
        },
      }),
      'light.counter': makeHassEntity({
        entity_id: 'light.counter',
        state: 'off',
        attributes: {
          friendly_name: 'Counter light',
        },
      }),
    },
  });
}

describe('TasksSection', () => {
  beforeEach(async () => {
    await resetAppStores();
    callServiceMock.mockClear();
  });

  it('renders a loading state before Home Assistant entities hydrate', () => {
    renderWithProviders(<TasksSection />);

    expect(screen.getByLabelText('Loading routines')).toBeInTheDocument();
  });

  it('renders the empty state without routine creation when no routines exist', () => {
    homeAssistantStore.setState({
      ...homeAssistantStore.getState(),
      connected: true,
      entities: {},
    });

    renderWithProviders(<TasksSection />);

    expect(screen.getByText('No Tasks')).toBeInTheDocument();
    expect(screen.queryByRole('button', { name: 'Create routine' })).not.toBeInTheDocument();
  });

  it('renders automations and Home Assistant scripts', () => {
    setRoutineEntities();

    renderWithProviders(<TasksSection />);

    expect(screen.getByText('Routines')).toBeInTheDocument();
    expect(screen.getAllByText('Automations').length).toBeGreaterThan(0);
    expect(screen.getAllByText('Brew coffee').length).toBeGreaterThan(0);
    expect(screen.getByText('Night mode')).toBeInTheDocument();
    expect(screen.getByText('Kitchen')).toBeInTheDocument();
    expect(screen.getByText('Enabled')).toBeInTheDocument();
    expect(screen.getByText('Disabled')).toBeInTheDocument();
    expect(screen.getAllByText('Scripts').length).toBeGreaterThan(0);
    expect(screen.getByText('Movie time')).toBeInTheDocument();
    expect(screen.getAllByText('Good night').length).toBeGreaterThan(0);
  });

  it('filters automations with active and off pills', () => {
    setRoutineEntities();

    renderWithProviders(<TasksSection />);

    expect(screen.getByRole('button', { name: 'All' })).toHaveAttribute('aria-pressed', 'true');

    fireEvent.click(screen.getByRole('button', { name: 'Active automations' }));

    expect(screen.getByRole('button', { name: 'Run Brew coffee' })).toBeInTheDocument();
    expect(screen.queryByText('Night mode')).not.toBeInTheDocument();

    fireEvent.click(screen.getByRole('button', { name: 'Disabled automations' }));

    expect(screen.queryByRole('button', { name: 'Run Brew coffee' })).not.toBeInTheDocument();
    expect(screen.getByText('Night mode')).toBeInTheDocument();

    fireEvent.click(screen.getByRole('button', { name: 'All' }));

    expect(screen.getByRole('button', { name: 'Run Brew coffee' })).toBeInTheDocument();
    expect(screen.getByText('Night mode')).toBeInTheDocument();
  });

  it('shows a quiet reconnect warning while preserving runnable routines', () => {
    setRoutineEntities();
    homeAssistantStore.setState({
      ...homeAssistantStore.getState(),
      connected: false,
    });

    renderWithProviders(<TasksSection />);

    expect(screen.getByText('Some routine details are unavailable')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Run Movie time' })).toBeInTheDocument();
  });

  it('wires routine actions through Home Assistant services', async () => {
    setRoutineEntities();

    renderWithProviders(<TasksSection />);

    fireEvent.click(screen.getByRole('button', { name: 'Run Brew coffee' }));
    fireEvent.click(screen.getByRole('button', { name: 'Run Movie time' }));
    fireEvent.click(screen.getByRole('button', { name: 'Run Good night' }));
    fireEvent.click(screen.getByRole('switch', { name: 'Toggle Brew coffee' }));
    fireEvent.click(screen.getByRole('switch', { name: 'Toggle Night mode' }));

    await waitFor(() => {
      expect(callServiceMock).toHaveBeenNthCalledWith(
        1,
        'automation',
        'trigger',
        {},
        { entity_id: 'automation.coffee' }
      );
      expect(callServiceMock).toHaveBeenNthCalledWith(
        2,
        'scene',
        'turn_on',
        {},
        { entity_id: 'scene.movie' }
      );
      expect(callServiceMock).toHaveBeenNthCalledWith(
        3,
        'script',
        'turn_on',
        {},
        { entity_id: 'script.goodnight' }
      );
      expect(callServiceMock).toHaveBeenNthCalledWith(
        4,
        'automation',
        'turn_off',
        {},
        { entity_id: 'automation.coffee' }
      );
      expect(callServiceMock).toHaveBeenNthCalledWith(
        5,
        'automation',
        'turn_on',
        {},
        { entity_id: 'automation.night' }
      );
    });
  });

  it('loads read-only automation details when expanded', async () => {
    setRoutineEntities();

    renderWithProviders(<TasksSection />);

    expect(screen.queryByText('automation.coffee')).not.toBeInTheDocument();

    fireEvent.click(screen.getAllByRole('button', { name: 'View' })[0]);

    await waitFor(() => {
      expect(screen.getByText('The time reaches 07:00:00')).toBeInTheDocument();
      expect(screen.getByText('Sun is below_horizon')).toBeInTheDocument();
      expect(screen.getByText('Turn on Kitchen light and Counter light')).toBeInTheDocument();
      expect(screen.getByText('automation.coffee')).toBeInTheDocument();
    });
  });
});
