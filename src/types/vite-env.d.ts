/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly NAVET_HASS_URL?: string;
  readonly NAVET_HASS_TOKEN?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
