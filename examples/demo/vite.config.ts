import { defineConfig } from "vite";

// https://vitejs.dev/config/
export default defineConfig(({ command }) => ({
  define: {
    "import.meta.env.POPUP_URL":
      command === "serve"
        ? JSON.stringify("https://pingpay.local.gd:5173")
        : "undefined",
  },
  plugins: [],
  server: {
    port: 3000,
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
