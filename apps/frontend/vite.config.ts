
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'
import path from 'path'

export default defineConfig({
  base: '/royalpalacehotel/', // Base path for GitHub Pages
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  server: {
    port: 8080
  },
  build: {
    outDir: 'dist',
    emptyOutDir: true,
    sourcemap: false
  }
})
