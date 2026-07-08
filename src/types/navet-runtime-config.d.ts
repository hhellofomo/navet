interface NavetRuntimeConfig {
  hassUrl?: string;
  hassToken?: string;
  dashboardConfigUrl?: string;
}

interface Window {
  __NAVET_CONFIG__?: NavetRuntimeConfig;
}
