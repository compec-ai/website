import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// Gelistirmede /api istekleri backend'e gider; ortam degiskeniyle ezilebilir.
const arka = process.env.VITE_API_HEDEF || 'http://backend:3001';

// Site kokten degil bir onek altinda yayinlanabilir: TEMEL_YOL=/website.
// Bos birakilirsa (varsayilan) her sey bugunku gibi kokten calisir.
const onek = (process.env.TEMEL_YOL || '').replace(/\/+$/, '');


export default defineConfig({
  base: onek ? onek + '/' : '/',
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
