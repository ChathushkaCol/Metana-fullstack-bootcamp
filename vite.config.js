import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

console.log("🔍 Build-time API URL:", process.env.VITE_API_URL);

export default defineConfig({
  plugins: [react()],
});

