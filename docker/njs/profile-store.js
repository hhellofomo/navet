import fs from 'fs';

var MAX_PROFILE_BYTES = 1024 * 1024;
var PROFILE_PATH = '/data/navet-dashboard-profile.json';

function sendJson(r, statusCode, payload) {
  r.headersOut['Cache-Control'] = 'no-store';
  r.headersOut['Content-Type'] = 'application/json; charset=utf-8';
  r.return(statusCode, JSON.stringify(payload));
}

function sendNoContent(r) {
  r.headersOut['Cache-Control'] = 'no-store';
  r.return(204);
}

function readProfile(r) {
  try {
    var stat = fs.statSync(PROFILE_PATH);
    if (stat.size > MAX_PROFILE_BYTES) {
      sendJson(r, 413, { error: 'Dashboard profile is too large' });
      return;
    }

    var content = fs.readFileSync(PROFILE_PATH, 'utf8');
    JSON.parse(content);
    r.headersOut['Cache-Control'] = 'no-store';
    r.headersOut['Content-Type'] = 'application/json; charset=utf-8';
    r.return(200, content);
  } catch (error) {
    if (error && error.code === 'ENOENT') {
      sendNoContent(r);
      return;
    }

    sendJson(r, 500, { error: 'Unable to read dashboard profile' });
  }
}

function writeProfile(r) {
  try {
    var body = r.requestText || '';
    if (!body) {
      sendJson(r, 400, { error: 'Missing dashboard profile body' });
      return;
    }

    if (body.length > MAX_PROFILE_BYTES) {
      sendJson(r, 413, { error: 'Dashboard profile is too large' });
      return;
    }

    var parsed = JSON.parse(body);
    if (!parsed || parsed.app !== 'navet' || parsed.version !== 3) {
      sendJson(r, 400, { error: 'Unsupported dashboard profile' });
      return;
    }

    fs.writeFileSync(PROFILE_PATH, JSON.stringify(parsed), 'utf8');
    sendJson(r, 200, { ok: true, updatedAt: parsed.exportedAt || null });
  } catch (error) {
    sendJson(r, 400, { error: 'Unable to save dashboard profile' });
  }
}

function handle(r) {
  if (r.method === 'GET') {
    readProfile(r);
    return;
  }

  if (r.method === 'PUT') {
    writeProfile(r);
    return;
  }

  r.headersOut.Allow = 'GET, PUT';
  sendJson(r, 405, { error: 'Method not allowed' });
}

export default { handle: handle };
