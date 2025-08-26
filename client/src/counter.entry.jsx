import React from "react";
import { createRoot } from "react-dom/client";
import "./index.css"; // ok if you have it; harmless if missing
import Counter from "./components/Counter.jsx"; // Counter lives in src/components

const rootEl = document.getElementById("root");
createRoot(rootEl).render(
  <React.StrictMode>
    <Counter initial={0} />
  </React.StrictMode>
);
