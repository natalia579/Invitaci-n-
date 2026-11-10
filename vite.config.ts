import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { viteSingleFile } from 'vite-plugin-singlefile';

// `base: './'` permite abrir el build desde cualquier subcarpeta (GitHub Pages, Netlify, etc.)
// `SINGLE=1 npm run build` genera un único index.html autocontenido (útil para vistas previas).
export default defineConfig({
  base: './',
  plugins: [react(), ...(process.env.SINGLE ? [viteSingleFile()] : [])],
  server: { host: true, port: 5173, allowedHosts: true },
  preview: { host: true, port: 4173, allowedHosts: true },
});
