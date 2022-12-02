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
  build: {
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html'),
        'play-wave': resolve(__dirname, 'players/play-wave.html'),
        'telegram-voice-player': resolve(__dirname, 'players/telegram-voice-player.html'),
      },
    },
  },
  base: 'https://ms-fadaei.github.io/voice-player/',
});
