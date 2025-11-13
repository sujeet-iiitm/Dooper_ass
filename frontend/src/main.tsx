
import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import { Auth0Provider } from '@auth0/auth0-react';

const root = createRoot(document.getElementById('root')!);
root.render(<App />);
  