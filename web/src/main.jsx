import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.jsx";
import { AuthProvider } from "./context/AuthContext";
import StripeProvider from "./context/StripeProvider";
import "./index.css";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <AuthProvider>
      <StripeProvider>
        <App />
      </StripeProvider>
    </AuthProvider>
  </StrictMode>
);
