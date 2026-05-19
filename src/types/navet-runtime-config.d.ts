interface NavetRuntimeConfig {
  hassUrl?: string;
  hassToken?: string;
  dashboardConfigUrl?: string;
  proxyBaseUrl?: string;
}

interface Window {
  __NAVET_CONFIG__?: NavetRuntimeConfig;
}
