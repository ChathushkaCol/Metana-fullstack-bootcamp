import React, { StrictMode } from "react";
import ReactDOM from "react-dom/client";
import "./index.css";

import App from "./App";
import LoginForm from "./LoginForm.jsx";

const root = ReactDOM.createRoot(document.getElementById("root"));
const path = (window.location.pathname + window.location.hash).toLowerCase();

root.render(
  <StrictMode>
    {path.startsWith("/login") ? <LoginForm /> : <App />}
  </StrictMode>
);
