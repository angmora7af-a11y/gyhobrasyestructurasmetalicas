import path from "node:path";

import react from "@vitejs/plugin-react-swc";
import { defineConfig } from "vite";

const proxyApi = process.env.PROXY_API ?? "http://127.0.0.1:8000";

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "src"),
    },
  },
  server: {
    port: 5173,
    proxy: {
      "/api": {
        target: proxyApi,
        changeOrigin: true,
      },
    },
  },
});
