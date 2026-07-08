interface NavetRuntimeConfig {
  hassUrl?: string;
  token?: string;
}

interface Window {
  __NAVET_CONFIG__?: NavetRuntimeConfig;
}
