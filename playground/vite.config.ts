import { resolve } from 'path';
import { defineConfig } from 'vite';

export default defineConfig({
  root: resolve(__dirname, './'),
  publicDir: resolve(__dirname, './public'),
  resolve: {
    alias: {
      '~': resolve(__dirname, '../src'),
      '@': resolve(__dirname, './'),
    },
  },
  base: 'https://ms-fadaei.github.io/voice-player/',
});
