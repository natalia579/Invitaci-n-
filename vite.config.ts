import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// `base: './'` permite abrir el build desde cualquier subcarpeta (GitHub Pages, Netlify, etc.)
export default defineConfig({
  base: './',
  plugins: [react()],
  server: { host: true, port: 5173, allowedHosts: true },
  preview: { host: true, port: 4173, allowedHosts: true },
});
