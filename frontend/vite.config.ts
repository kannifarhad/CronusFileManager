import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import svgr from "vite-plugin-svgr";
import { resolve } from "path";

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react({
      babel: {
        plugins: [["babel-plugin-react-compiler"]],
      },
    }),
    svgr({
      svgrOptions: {
        icon: true,
      },
    }),
  ],
  server: {
    open: true, // Opens the browser on start
    port: 3000, // Default Vite port
    fs: {
      strict: false, // Allow history-based routing
    },
  },
  build: {
    rollupOptions: {
      input: {
        main: resolve(__dirname, "public/index.html"),
      },
    },
  },
});
