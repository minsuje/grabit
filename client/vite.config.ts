import path from 'path';
import react from '@vitejs/plugin-react-swc';
import { defineConfig } from 'vite';
// import mkcert from 'vite-plugin-mkcert';

export default defineConfig({
  plugins: [
    react(),
    // mkcert({
    //   source: 'coding',
    // }),
  ],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
});
