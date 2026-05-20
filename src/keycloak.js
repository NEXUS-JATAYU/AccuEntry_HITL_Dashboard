import Keycloak from 'keycloak-js';

// We fetch the Keycloak configuration from environment variables.
// If they are not set, it falls back to some placeholders.
const keycloakConfig = {
  url: import.meta.env.VITE_KEYCLOAK_URL || 'http://localhost:8081',
  realm: import.meta.env.VITE_KEYCLOAK_REALM || 'Compliance-realm',
  clientId: import.meta.env.VITE_KEYCLOAK_CLIENT_ID || 'hitl-dashboard',
};

// Create a new instance of the Keycloak client
const keycloak = new Keycloak(keycloakConfig);

export default keycloak;
