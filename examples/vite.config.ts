import { defineConfig } from 'vite';

// https://vitejs.dev/config/
export default defineConfig({
  server: {
    port: 3000, // Example port, can be changed
  },
  resolve: {
    // alias: {
    //   // This alias allows importing the SDK source directly during development.
    //   // Adjust if your SDK's entry point or structure changes.
    //   // Assumes this vite.config.ts is in 'examples/' and src is '../src/'
    //   '@pingpay/onramp-sdk': '../src/index.ts',
    // },
  },
});
