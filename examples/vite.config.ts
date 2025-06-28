import { defineConfig } from "vite";
import { nodePolyfills } from 'vite-plugin-node-polyfills';
import path from 'path';

// https://vitejs.dev/config/
export default defineConfig(({ command }) => ({
  define: {
    'import.meta.env.POPUP_URL': command === 'serve' ? JSON.stringify('http://localhost:5173') : 'null',
  },
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
      '@pingpay/onramp-sdk': path.resolve(__dirname, '../sdk/src'),
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
}));
