import fs from 'fs';

const MAX_SESSION_BYTES = 16 * 1024;
const SESSION_PATH = '/data/navet-session.json';

function sendJson(r, statusCode, payload) {
  r.headersOut['Cache-Control'] = 'no-store';
  r.headersOut['Content-Type'] = 'application/json; charset=utf-8';
  r.return(statusCode, JSON.stringify(payload));
}

function sendNoContent(r) {
  r.headersOut['Cache-Control'] = 'no-store';
  r.return(204);
}

function isValidSession(value) {
  return (
    value &&
    typeof value.url === 'string' &&
    /^https?:\/\//.test(value.url) &&
    typeof value.token === 'string' &&
    value.token.length > 0
  );
}

function readSession(r) {
  try {
    const stat = fs.statSync(SESSION_PATH);
    if (stat.size > MAX_SESSION_BYTES) {
      sendJson(r, 413, { error: 'Session is too large' });
      return;
    }

    const content = fs.readFileSync(SESSION_PATH, 'utf8');
    const parsed = JSON.parse(content);
    if (!isValidSession(parsed)) {
      sendNoContent(r);
      return;
    }

    r.headersOut['Cache-Control'] = 'no-store';
    r.headersOut['Content-Type'] = 'application/json; charset=utf-8';
    r.return(200, JSON.stringify(parsed));
  } catch (error) {
    if (error && error.code === 'ENOENT') {
      sendNoContent(r);
      return;
    }

    sendJson(r, 500, { error: 'Unable to read session' });
  }
}

function writeSession(r) {
  try {
    const body = r.requestText || '';
    if (!body || body.length > MAX_SESSION_BYTES) {
      sendJson(r, 400, { error: 'Invalid session body' });
      return;
    }

    const parsed = JSON.parse(body);
    if (!isValidSession(parsed)) {
      sendJson(r, 400, { error: 'Unsupported session' });
      return;
    }

    fs.writeFileSync(
      SESSION_PATH,
      JSON.stringify({
        url: parsed.url,
        token: parsed.token,
        updatedAt: parsed.updatedAt || new Date().toISOString(),
      }),
      'utf8'
    );
    sendJson(r, 200, { ok: true });
  } catch (error) {
    sendJson(r, 400, { error: 'Unable to save session' });
  }
}

function handle(r) {
  if (r.method === 'GET') {
    readSession(r);
    return;
  }

  if (r.method === 'PUT') {
    writeSession(r);
    return;
  }

  r.headersOut.Allow = 'GET, PUT';
  sendJson(r, 405, { error: 'Method not allowed' });
}

export default { handle: handle };
