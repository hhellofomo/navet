import { beforeEach, describe, expect, it } from 'vitest';
import {
  readInitialSessionConfig,
  readRuntimeSessionConfig,
  writeStoredSessionConfig,
} from '../session';

describe('session config', () => {
  beforeEach(() => {
    localStorage.clear();
    window.__NAVET_CONFIG__ = undefined;
    window.history.replaceState(null, '', '/');
  });

  it('reads normalized runtime session config when Docker provides credentials', () => {
    window.__NAVET_CONFIG__ = {
      hassUrl: 'https://ha.example.com/',
      hassToken: '  token  ',
    };

    expect(readRuntimeSessionConfig()).toEqual({
      url: 'https://ha.example.com',
      token: 'token',
    });
  });

  it('prefers stored session config over runtime defaults', () => {
    window.__NAVET_CONFIG__ = {
      hassUrl: 'https://runtime.example.com',
      hassToken: 'runtime-token',
    };
    writeStoredSessionConfig('navet-test-session', {
      url: 'https://stored.example.com/',
      token: 'stored-token',
    });

    expect(readInitialSessionConfig('navet-test-session')).toEqual({
      url: 'https://stored.example.com',
      token: 'stored-token',
    });
  });

  it('prefers complete runtime config over stored config inside Home Assistant ingress', () => {
    window.history.replaceState(null, '', '/api/hassio_ingress/navet_dev/');
    window.__NAVET_CONFIG__ = {
      hassUrl: 'https://runtime.example.com',
      hassToken: 'runtime-token',
    };
    writeStoredSessionConfig('navet-test-session', {
      url: 'https://stored.example.com/',
      token: 'stored-token',
    });

    expect(readInitialSessionConfig('navet-test-session')).toEqual({
      url: 'https://runtime.example.com',
      token: 'runtime-token',
    });
  });

  it('ignores incomplete runtime config', () => {
    window.__NAVET_CONFIG__ = {
      hassUrl: 'https://ha.example.com',
    };

    expect(readRuntimeSessionConfig()).toBeNull();
  });
});
