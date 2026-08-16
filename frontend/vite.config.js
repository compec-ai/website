import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// Gelistirmede /api istekleri backend'e gider; ortam degiskeniyle ezilebilir.
const arka = process.env.VITE_API_HEDEF || 'http://backend:3001';

export default defineConfig({
  plugins: [react()],
  server: {
    host: '0.0.0.0',
    port: 5173,
    proxy: { '/api': { target: arka, changeOrigin: true } },
  },
  preview: {
    host: '0.0.0.0',
    port: 4173,
    proxy: { '/api': { target: arka, changeOrigin: true } },
  },
});
