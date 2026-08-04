import { defineConfig } from 'vite';
import path from 'path';

export default defineConfig({
  resolve: {
    alias: {
      '@/fluid': path.resolve(__dirname, '../../dist/index.js'),
    },
  },
});