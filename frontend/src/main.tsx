
import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import { Auth0Provider } from '@auth0/auth0-react';

const root = createRoot(document.getElementById('root')!);

root.render(
<Auth0Provider
    domain="dev-ehl78my21b67ltzm.us.auth0.com"
    clientId="nml2Slsy8horyBR580b9ktBaln9ctEbs"
    authorizationParams={{
      redirect_uri: window.location.origin
    }}
  >
    <App />
  </Auth0Provider>,
);
  