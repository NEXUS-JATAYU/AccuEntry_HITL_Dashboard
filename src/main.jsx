import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './styles/index.css'
import keycloak from './keycloak.js'

keycloak.init({ onLoad: 'login-required', checkLoginIframe: false }).then((authenticated) => {
  if (!authenticated) {
    window.location.reload();
  } else {
    console.info("Keycloak Authenticated!");
    ReactDOM.createRoot(document.getElementById('root')).render(
      <React.StrictMode>
        <App />
      </React.StrictMode>,
    );
  }
}).catch((error) => {
  console.error("Keycloak initialization failed!", error);
  // Fallback to render an error state or the app anyway if you prefer
  document.getElementById('root').innerHTML = '<div style="color:red; padding: 20px;">Failed to connect to Keycloak Auth Server.</div>';
});
