import { beforeEach, describe, expect, it } from 'vitest';
import { STORAGE_KEYS } from '@/app/constants/storage-keys';
import { useCustomCardsStore } from '@/app/features/dashboard';
import { importDashboardConfig } from '@/app/utils/dashboard-config';

const baseConfig = {
  version: 3,
  app: 'navet',
  theme: {
    theme: 'dark',
    primaryColor: 'orange',
  },
  settings: {},
  navigation: {
    currentRoom: 'all',
    activeSection: 'home',
  },
};

describe('dashboard-config import hardening', () => {
  beforeEach(() => {
    localStorage.clear();
    useCustomCardsStore.setState(useCustomCardsStore.getInitialState(), true);
  });

  it('drops unsafe custom card URLs and service calls', () => {
    importDashboardConfig({
      ...baseConfig,
      customCards: [
        {
          id: 'rss-card',
          type: 'rss',
          size: 'medium',
          room: 'all',
          data: {
            customProviders: [
              {
                id: 'bad',
                name: 'Bad',
                type: 'url',
                feedUrl: 'http://localhost/feed.xml',
              },
              {
                id: 'good',
                name: 'Good',
                type: 'url',
                feedUrl: 'https://example.com/feed.xml',
              },
            ],
          },
        },
        {
          id: 'button-card',
          type: 'button',
          size: 'medium',
          room: 'all',
          data: {
            service: 'javascript:alert(1)',
            entityId: '../light.kitchen',
          },
        },
      ],
    });

    const cards = useCustomCardsStore.getState().cards;
    expect(cards[0]?.data?.customProviders).toEqual([
      {
        id: 'good',
        name: 'Good',
        type: 'url',
        feedUrl: 'https://example.com/feed.xml',
      },
    ]);
    expect(cards[1]?.data?.service).toBeUndefined();
    expect(cards[1]?.data?.entityId).toBeUndefined();
  });

  it('sanitizes imported storage records before persistence', () => {
    importDashboardConfig({
      ...baseConfig,
      cardSizes: {
        'light.kitchen': 'large',
        bad: { nested: true },
      },
      cardOrders: {
        all: ['light.kitchen', 123, 'switch.kettle'],
      },
      homeDashboardLayout: ['not-an-object'],
    });

    expect(localStorage.getItem(STORAGE_KEYS.cardSizes)).toContain('light.kitchen');
    expect(localStorage.getItem(STORAGE_KEYS.cardSizes)).not.toContain('nested');
    expect(localStorage.getItem(STORAGE_KEYS.cardOrders)).toContain('switch.kettle');
    expect(localStorage.getItem(STORAGE_KEYS.homeDashboardLayout)).toContain('null');
  });
});
