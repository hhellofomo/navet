#!/bin/sh
set -eu

NAVET_HASS_URL="${NAVET_HASS_URL:-}"
NAVET_HASS_TOKEN="${NAVET_HASS_TOKEN:-}"
NAVET_PROXY_AUTH_DIRECTIVE=""

if [ -n "${NAVET_HASS_TOKEN}" ]; then
  NAVET_PROXY_AUTH_DIRECTIVE="    proxy_set_header Authorization \"Bearer ${NAVET_HASS_TOKEN}\";"
fi

export NAVET_HASS_URL NAVET_HASS_TOKEN NAVET_PROXY_AUTH_DIRECTIVE

if [ -n "${NAVET_HASS_URL}" ]; then
  envsubst '${NAVET_HASS_URL} ${NAVET_PROXY_AUTH_DIRECTIVE}' \
    < /etc/navet-nginx/default.proxy.conf.template \
    > /etc/nginx/conf.d/default.conf
else
  cp /etc/navet-nginx/default.no-proxy.conf /etc/nginx/conf.d/default.conf
fi

envsubst '${NAVET_HASS_URL} ${NAVET_HASS_TOKEN}' \
  < /usr/share/nginx/html/config.js.template \
  > /usr/share/nginx/html/config.js
