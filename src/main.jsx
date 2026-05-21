import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './styles/index.css'
import keycloak, { getAppRedirectUri } from './keycloak.js'

const redirectUri = getAppRedirectUri();

keycloak
  .init({
    onLoad: 'login-required',
    checkLoginIframe: false,
    redirectUri,
    pkceMethod: 'S256',
  })
  .then((authenticated) => {
    if (!authenticated) {
      window.location.reload();
    } else {
      console.info('Keycloak authenticated. Redirect URI:', redirectUri);
      ReactDOM.createRoot(document.getElementById('root')).render(
        <React.StrictMode>
          <App />
        </React.StrictMode>,
      );
    }
  })
  .catch((error) => {
    console.error('Keycloak initialization failed!', error);
    document.getElementById('root').innerHTML = `
      <div style="font-family: system-ui; max-width: 520px; margin: 2rem auto; padding: 1.5rem; border: 1px solid #fecaca; border-radius: 12px; background: #fef2f2; color: #991b1b;">
        <h2 style="margin: 0 0 0.5rem;">Keycloak login failed</h2>
        <p style="margin: 0 0 1rem; font-size: 14px;">${error?.message || 'Unknown error'}</p>
        <p style="margin: 0; font-size: 13px; color: #7f1d1d;">
          If you see <strong>Invalid parameter: redirect_uri</strong>, add this URL in Keycloak Admin →
          Clients → hitl-dashboard → Valid redirect URIs:<br/>
          <code style="display:block;margin-top:8px;padding:8px;background:#fff;border-radius:6px;">${redirectUri}</code>
        </p>
      </div>`;
  });
