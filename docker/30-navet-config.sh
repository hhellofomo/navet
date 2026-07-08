#!/bin/sh
set -eu

NAVET_HASS_URL="${NAVET_HASS_URL:-}"
NAVET_HASS_TOKEN="${NAVET_HASS_TOKEN:-}"

export NAVET_HASS_URL NAVET_HASS_TOKEN

envsubst '${NAVET_HASS_URL} ${NAVET_HASS_TOKEN}' \
  < /usr/share/nginx/html/config.js.template \
  > /usr/share/nginx/html/config.js
