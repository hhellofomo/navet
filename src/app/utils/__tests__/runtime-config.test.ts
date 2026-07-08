import { describe, expect, it } from 'vitest';
import { getRuntimeConfig } from '@/app/config/runtime-config';

describe('runtime-config', () => {
  it('does not expose browser runtime tokens', () => {
    window.__NAVET_CONFIG__ = {
      hassUrl: 'https://ha.example.com/',
    };

    expect(getRuntimeConfig()).toEqual({ hassUrl: 'https://ha.example.com' });
    expect('token' in getRuntimeConfig()).toBe(false);
  });
});
