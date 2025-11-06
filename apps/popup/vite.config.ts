import tailwindcss from "@tailwindcss/vite";
import { tanstackRouter } from "@tanstack/router-plugin/vite";
import react from "@vitejs/plugin-react";
import path from "path";
import { defineConfig } from "vite";
import fs from "fs";

// https://vite.dev/config/
export default defineConfig(({ command }) => {
  const isDev = command === "serve";
  const certPath = path.resolve(__dirname, "../../.certs/pingpay.local.gd+4.pem");
  const keyPath = path.resolve(__dirname, "../../.certs/pingpay.local.gd+4-key.pem");
  const hasCerts = fs.existsSync(certPath) && fs.existsSync(keyPath);

  return {
    server: {
      port: 5173,
      https: isDev && hasCerts
        ? {
            key: fs.readFileSync(keyPath),
            cert: fs.readFileSync(certPath),
          }
        : undefined,
      host: isDev ? "pingpay.local.gd" : undefined,
      proxy: {
        "/api": {
          target: "http://localhost:8787",
          changeOrigin: true,
        },
      },
      allowedHosts: [
        "pingpay.local.gd",
        ".local.gd",
        "localhost",
      ],
    },
    plugins: [
      tanstackRouter({
        target: "react",
        autoCodeSplitting: true,
      }),
      react(),
      tailwindcss(),
    ],
    resolve: {
      alias: {
        "@": path.resolve(__dirname, "./src"),
      },
    },
    optimizeDeps: {
      exclude: ["@pingpay/onramp-sdk", "@pingpay/onramp-types"],
      esbuildOptions: {
        // Node.js global to browser globalThis
        define: {
          global: "globalThis",
        },
      },
    },
  };
});
