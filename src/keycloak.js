import Keycloak from 'keycloak-js';

const trimSlash = (url) => String(url || '').replace(/\/$/, '');

const keycloakConfig = {
  url: trimSlash(import.meta.env.VITE_KEYCLOAK_URL || 'http://localhost:8081'),
  realm: import.meta.env.VITE_KEYCLOAK_REALM || 'Compliance-realm',
  clientId: import.meta.env.VITE_KEYCLOAK_CLIENT_ID || 'hitl-dashboard',
};

/** Must match a Valid Redirect URI on the Keycloak client (see KEYCLOAK_SETUP.md). */
export const getAppRedirectUri = () => {
  const configured = import.meta.env.VITE_APP_URL;
  const origin = configured ? trimSlash(configured) : window.location.origin;
  return `${origin}/`;
};

const keycloak = new Keycloak(keycloakConfig);

export default keycloak;
