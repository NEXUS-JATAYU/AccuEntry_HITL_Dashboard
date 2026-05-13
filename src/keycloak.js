import Keycloak from 'keycloak-js';

// We fetch the Keycloak configuration from environment variables.
// If they are not set, it falls back to some placeholders.
const keycloakConfig = {
  url: import.meta.env.VITE_KEYCLOAK_URL || 'http://localhost:8080',
  realm: import.meta.env.VITE_KEYCLOAK_REALM || 'myrealm',
  clientId: import.meta.env.VITE_KEYCLOAK_CLIENT_ID || 'myclient'
};

// Create a new instance of the Keycloak client
const keycloak = new Keycloak(keycloakConfig);

export default keycloak;
