import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [
    react({
      jsxRuntime: "automatic",          // <- use automatic runtime
      babel: { babelrc: false, configFile: false }, // ignore babel.config.js in dev build
    }),
  ],
  server: { port: 5173, proxy: { "/api": "http://localhost:4000" } },
});
