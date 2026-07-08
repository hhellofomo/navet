import { getRuntimeConfig } from '../config/runtime-config';
import type { SessionConfig } from '../session/session';

const DEFAULT_HOME_ASSISTANT_PROXY_PATH = '/__navet_ha_proxy__';

function normalizeUrl(url: string): string {
  return url.endsWith('/') ? url.slice(0, -1) : url;
}

function isRuntimeHostedSession(config: SessionConfig): boolean {
  const runtimeConfig = getRuntimeConfig();

  if (!runtimeConfig.hassUrl || !runtimeConfig.hassToken) {
    return false;
  }

  return normalizeUrl(config.url) === normalizeUrl(runtimeConfig.hassUrl);
}

export function resolveIngressAwarePath(path: string): string {
  if (typeof document === 'undefined') {
    return path;
  }

  return new URL(path.replace(/^\//, ''), document.baseURI).pathname.replace(/\/$/, '');
}

export function resolveHomeAssistantConnectionUrl(config: SessionConfig): string {
  const runtimeConfig = getRuntimeConfig();

  if (!isRuntimeHostedSession(config)) {
    return config.url;
  }

  const proxyBasePath = runtimeConfig.proxyBaseUrl ?? DEFAULT_HOME_ASSISTANT_PROXY_PATH;
  return `${window.location.origin}${resolveIngressAwarePath(proxyBasePath)}`;
}
