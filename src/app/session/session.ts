import { getRuntimeConfig } from '../config/runtime-config';
import { storage } from '../utils/storage';

export interface SessionConfig {
  url: string;
  token: string;
}

function normalizeToken(token: string): string {
  return token.trim();
}

function normalizeUrl(url: string): string {
  return url.endsWith('/') ? url.slice(0, -1) : url;
}

export function normalizeSessionConfig(config: SessionConfig): SessionConfig {
  return {
    url: normalizeUrl(config.url),
    token: normalizeToken(config.token),
  };
}

export function readStoredSessionConfig(key: string): SessionConfig | null {
  return storage.get<SessionConfig | null>(key, null);
}

export function writeStoredSessionConfig(key: string, config: SessionConfig): SessionConfig {
  const normalized = normalizeSessionConfig(config);
  storage.set(key, normalized);
  return normalized;
}

export function clearStoredSessionConfig(key: string): void {
  storage.remove(key);
}

export function readRuntimeSessionConfig(): SessionConfig | null {
  const runtimeConfig = getRuntimeConfig();

  if (!runtimeConfig.hassUrl || !runtimeConfig.hassToken) {
    return null;
  }

  return normalizeSessionConfig({
    url: runtimeConfig.hassUrl,
    token: runtimeConfig.hassToken,
  });
}

export function readInitialSessionConfig(key: string): SessionConfig | null {
  return readStoredSessionConfig(key) ?? readRuntimeSessionConfig();
}
