import { defineConfig } from "vite";

// https://vitejs.dev/config/
export default defineConfig(({ command }) => ({
  define: {
    "import.meta.env.POPUP_URL":
      command === "serve"
        ? JSON.stringify("http://localhost:5173")
        : "undefined",
  },
  plugins: [],
  server: {
    port: 3001,
  },
  optimizeDeps: {
    exclude: ["@pingpay/onramp-sdk"],
    esbuildOptions: {
      // Node.js global to browser globalThis
      define: {
        global: "globalThis",
      },
    },
  },
}));
