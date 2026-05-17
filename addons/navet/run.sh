#!/usr/bin/with-contenv bashio
set -euo pipefail

CONFIG_DIR="/usr/share/nginx/html"
CONFIG_FILE="${CONFIG_DIR}/config.js"
NGINX_CONF="/etc/nginx/http.d/default.conf"

HASS_URL="$(bashio::config 'hass_url')"
HASS_TOKEN="$(bashio::config 'token')"

if [[ -n "${HASS_URL}" && ! "${HASS_URL}" =~ ^https?:// ]]; then
  echo "hass_url must be empty or start with http:// or https://" >&2
  exit 1
fi

if [[ "${HASS_URL}${HASS_TOKEN}" == *\"* || "${HASS_URL}${HASS_TOKEN}" == *\'* || "${HASS_URL}${HASS_TOKEN}" == *";"* ]]; then
  echo "hass_url and token must not contain quotes or semicolons" >&2
  exit 1
fi

HASS_URL_JS="${HASS_URL//\\/\\\\}"
HASS_URL_JS="${HASS_URL_JS//\"/\\\"}"

cat > "${CONFIG_FILE}" <<EOF
window.__NAVET_CONFIG__ = {
  hassUrl: "${HASS_URL_JS}"
};
EOF

if [[ -n "${HASS_URL}" ]]; then
  PROXY_AUTH_DIRECTIVE=""
  if [[ -n "${HASS_TOKEN}" ]]; then
    PROXY_AUTH_DIRECTIVE='    proxy_set_header Authorization "Bearer '"${HASS_TOKEN}"'";'
  fi

  cat > "${NGINX_CONF}" <<EOF
server {
  listen 8099;
  server_name _;

  root /usr/share/nginx/html;
  index index.html;

  include /etc/nginx/snippets/navet-security-headers.conf;

  location /__navet_ha_proxy__/ {
    if (\$uri ~ "\.\.") {
      return 400;
    }
    proxy_pass ${HASS_URL}/;
    proxy_http_version 1.1;
    proxy_set_header Host \$proxy_host;
${PROXY_AUTH_DIRECTIVE}
  }

  include /etc/nginx/snippets/navet-rss-proxy.conf;

  location = /config.js {
    add_header Cache-Control "no-store";
    try_files \$uri =404;
  }

  location /assets/ {
    try_files \$uri =404;
  }

  location ~* \.(?:js|mjs|css|map|png|svg|ico|webmanifest)$ {
    try_files \$uri =404;
  }

  location / {
    sub_filter '<head>' '<head><base href="\$http_x_ingress_path/">';
    sub_filter_once on;
    add_header Cache-Control "no-store";
    try_files \$uri \$uri/ /index.html;
  }
}
EOF
fi

nginx -g 'daemon off;'
