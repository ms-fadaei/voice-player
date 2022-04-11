import { resolve } from 'path';
import { defineConfig } from 'vite';

export default defineConfig({
  publicDir: false,
  resolve: {
    alias: {
      '~': resolve(__dirname, './src'),
      '@': resolve(__dirname, './playground'),
    },
  },
  build: {
    lib: {
      entry: resolve(__dirname, 'src/index.ts'),
      formats: ['es', 'cjs'],
      fileName: (format) => {
        if (format === 'es') return `elements.mjs`;
        if (format === 'cjs') return `elements.cjs`;
        return `elements.${format}.js`;
      },
    },
  },
  test: {
    globals: true,
    environment: 'happy-dom',
  },
});
