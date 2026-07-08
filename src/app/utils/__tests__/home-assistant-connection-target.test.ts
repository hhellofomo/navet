import { beforeEach, describe, expect, it } from 'vitest';
import {
  resolveHomeAssistantConnectionUrl,
  resolveIngressAwarePath,
} from '../home-assistant-connection-target';

describe('home-assistant-connection-target', () => {
  beforeEach(() => {
    window.__NAVET_CONFIG__ = undefined;
    document.querySelector('base')?.remove();
  });

  it('keeps user-entered Home Assistant URLs for non-runtime sessions', () => {
    expect(
      resolveHomeAssistantConnectionUrl({
        url: 'https://ha.example.com',
        token: 'user-token',
      })
    ).toBe('https://ha.example.com');
  });

  it('uses same-origin proxy URL for matching hosted runtime Home Assistant URLs', () => {
    window.__NAVET_CONFIG__ = {
      hassUrl: 'https://ha.example.com',
      hassToken: 'runtime-token',
      proxyBaseUrl: '/__navet_ha_proxy__',
    };

    expect(
      resolveHomeAssistantConnectionUrl({
        url: 'https://ha.example.com',
        token: 'stored-user-token',
      })
    ).toBe(`${window.location.origin}/__navet_ha_proxy__`);
  });

  it('resolves proxy paths under the Home Assistant ingress base path', () => {
    const base = document.createElement('base');
    base.href = `${window.location.origin}/api/hassio_ingress/addon-slug/`;
    document.head.append(base);

    expect(resolveIngressAwarePath('/__navet_ha_proxy__')).toBe(
      '/api/hassio_ingress/addon-slug/__navet_ha_proxy__'
    );
  });
});
