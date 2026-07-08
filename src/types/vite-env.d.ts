/// <reference types="vite/client" />
/// <reference types="vite-plugin-pwa/client" />

interface ImportMetaEnv {
  readonly NAVET_HASS_URL?: string;
  readonly NAVET_HASS_TOKEN?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
