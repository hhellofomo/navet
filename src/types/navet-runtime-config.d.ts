interface NavetRuntimeConfig {
  hassUrl?: string;
  hassToken?: string;
}

interface Window {
  __NAVET_CONFIG__?: NavetRuntimeConfig;
}
