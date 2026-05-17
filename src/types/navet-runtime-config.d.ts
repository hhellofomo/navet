interface NavetRuntimeConfig {
  hassUrl?: string;
}

interface Window {
  __NAVET_CONFIG__?: NavetRuntimeConfig;
}
