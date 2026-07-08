#!/usr/bin/with-contenv bashio
set -euo pipefail

CONFIG_DIR="/usr/share/nginx/html"
CONFIG_FILE="${CONFIG_DIR}/config.js"

HASS_URL="$(bashio::config 'hass_url')"
HASS_TOKEN="$(bashio::config 'token')"

cat > "${CONFIG_FILE}" <<EOF
window.__NAVET_CONFIG__ = {
  hassUrl: "${HASS_URL}",
  token: "${HASS_TOKEN}"
};
EOF

nginx -g 'daemon off;'
