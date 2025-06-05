import { defineConfig } from "vite";
import { nodePolyfills } from 'vite-plugin-node-polyfills';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [nodePolyfills({
    globals: {
      Buffer: true,
      global: true,
      process: true
    },
    protocolImports: true,
  }),],
  server: {
    port: 3000, // Example port, can be changed
  },
  resolve: {
    alias: {
      '@pingpay/onramp-sdk': '../dist/index.ts',
    },
  },
  optimizeDeps: {
    esbuildOptions: {
      // Node.js global to browser globalThis
      define: {
        global: 'globalThis'
      },
    }
  },
});