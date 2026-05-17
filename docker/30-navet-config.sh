#!/bin/sh
set -eu

NAVET_HASS_URL="${NAVET_HASS_URL:-}"
NAVET_HASS_TOKEN="${NAVET_HASS_TOKEN:-}"
NAVET_DASHBOARD_CONFIG_URL="${NAVET_DASHBOARD_CONFIG_URL:-}"
NAVET_PROXY_AUTH_DIRECTIVE=""
NAVET_HASS_URL_JS="$(printf '%s' "${NAVET_HASS_URL}" | sed 's/\\/\\\\/g; s/"/\\"/g')"
NAVET_HASS_TOKEN_JS="$(printf '%s' "${NAVET_HASS_TOKEN}" | sed 's/\\/\\\\/g; s/"/\\"/g')"
NAVET_DASHBOARD_CONFIG_URL_JS="$(printf '%s' "${NAVET_DASHBOARD_CONFIG_URL}" | sed 's/\\/\\\\/g; s/"/\\"/g')"

mkdir -p /data
chown nginx:nginx /data 2>/dev/null || true

case "${NAVET_HASS_URL}" in
  ""|http://*|https://*) ;;
  *)
    echo "NAVET_HASS_URL must be empty or start with http:// or https://" >&2
    exit 1
    ;;
esac

if printf '%s' "${NAVET_HASS_URL}${NAVET_HASS_TOKEN}${NAVET_DASHBOARD_CONFIG_URL}" | grep -q '[";'\'']'; then
  echo "NAVET_HASS_URL, NAVET_HASS_TOKEN, and NAVET_DASHBOARD_CONFIG_URL must not contain quotes or semicolons" >&2
  exit 1
fi

if [ -n "${NAVET_HASS_TOKEN}" ]; then
  NAVET_PROXY_AUTH_DIRECTIVE="    proxy_set_header Authorization \"Bearer ${NAVET_HASS_TOKEN}\";"
fi

export NAVET_HASS_URL NAVET_HASS_URL_JS NAVET_HASS_TOKEN_JS NAVET_DASHBOARD_CONFIG_URL_JS NAVET_PROXY_AUTH_DIRECTIVE

if [ -n "${NAVET_HASS_URL}" ]; then
  envsubst '${NAVET_HASS_URL} ${NAVET_PROXY_AUTH_DIRECTIVE}' \
    < /etc/navet-nginx/default.proxy.conf.template \
    > /etc/nginx/conf.d/default.conf
else
  cp /etc/navet-nginx/default.no-proxy.conf /etc/nginx/conf.d/default.conf
fi

envsubst '${NAVET_HASS_URL_JS} ${NAVET_HASS_TOKEN_JS} ${NAVET_DASHBOARD_CONFIG_URL_JS}' \
  < /usr/share/nginx/html/config.js.template \
  > /usr/share/nginx/html/config.js
