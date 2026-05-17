import type { SessionConfig } from '@/app/session/session';

const DASHBOARD_SESSION_ENDPOINT = '/__navet_session__/default';

interface DashboardSessionLoadResult {
  available: boolean;
  session: SessionConfig | null;
}

function isSessionConfig(value: unknown): value is SessionConfig {
  if (!value || typeof value !== 'object') {
    return false;
  }

  const record = value as Record<string, unknown>;
  return (
    typeof record.url === 'string' &&
    /^https?:\/\//.test(record.url) &&
    typeof record.token === 'string' &&
    record.token.length > 0
  );
}

export async function loadDashboardSession(): Promise<DashboardSessionLoadResult> {
  try {
    const response = await fetch(DASHBOARD_SESSION_ENDPOINT, {
      cache: 'no-store',
      credentials: 'same-origin',
    });

    if (response.status === 404) {
      return { available: true, session: null };
    }

    if (!response.ok) {
      throw new Error(`Dashboard session request failed with status ${response.status}`);
    }

    if (!response.headers.get('Content-Type')?.includes('application/json')) {
      return { available: false, session: null };
    }

    const session = await response.json();
    return { available: true, session: isSessionConfig(session) ? session : null };
  } catch (error) {
    console.warn('[DashboardSession] Unable to fetch shared dashboard session:', error);
    return { available: false, session: null };
  }
}

export async function saveDashboardSession(session: SessionConfig): Promise<boolean> {
  try {
    const response = await fetch(DASHBOARD_SESSION_ENDPOINT, {
      method: 'PUT',
      cache: 'no-store',
      credentials: 'same-origin',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        ...session,
        updatedAt: new Date().toISOString(),
      }),
    });

    return response.ok;
  } catch (error) {
    console.warn('[DashboardSession] Unable to save shared dashboard session:', error);
    return false;
  }
}
