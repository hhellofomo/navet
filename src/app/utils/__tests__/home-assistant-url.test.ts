import { describe, expect, it } from 'vitest';
import {
  resolveHomeAssistantAbsoluteUrl,
  resolveHomeAssistantProxyUrl,
} from '../home-assistant-url';

describe('home-assistant-url', () => {
  it('keeps safe app asset paths for absolute artwork resolution', () => {
    expect(resolveHomeAssistantAbsoluteUrl('/navet/demo/assets/album.jpg')).toBe(
      '/navet/demo/assets/album.jpg'
    );
  });

  it('keeps safe app asset paths for development artwork resolution', () => {
    expect(resolveHomeAssistantProxyUrl('/navet/demo/assets/album.jpg')).toBe(
      '/navet/demo/assets/album.jpg'
    );
  });

  it('still proxies Home Assistant media paths in development', () => {
    expect(resolveHomeAssistantProxyUrl('/api/media_player_proxy/media_player.living_room')).toBe(
      '/__navet_ha_proxy__/api/media_player_proxy/media_player.living_room'
    );
  });

  it('still expands Home Assistant media paths for production when a Home Assistant URL exists', () => {
    expect(
      resolveHomeAssistantAbsoluteUrl(
        '/api/media_player_proxy/media_player.living_room',
        'https://ha.example.test'
      )
    ).toBe('https://ha.example.test/api/media_player_proxy/media_player.living_room');
  });
});
