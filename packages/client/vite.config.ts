import path from 'path';
import { fileURLToPath } from 'url';

import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@auth-visualizer/common': path.resolve(__dirname, '../common/src/index.ts'),
      '@auth-visualizer/common/': `${path.resolve(__dirname, '../common/src')}/`,
    },
  },
  envDir: path.resolve(__dirname, '../../'),
  envPrefix: 'CLIENT_',
});
