import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')
  return {
    plugins: [react()],
    // base must match your GitHub Pages repo name, e.g. /icompass-platform/
    // Override via VITE_BASE_URL in .env.production
    base: env.VITE_BASE_URL || '/icompass/',
    resolve: {
      alias: {
        '@': path.resolve(__dirname, './src'),
      },
    },
    build: {
      outDir: 'dist',
      sourcemap: false,
      rollupOptions: {
        output: {
          manualChunks: {
            vendor: ['react', 'react-dom', 'react-router-dom'],
            state: ['zustand', 'immer'],
            query: ['@tanstack/react-query'],
          },
        },
      },
    },
  }
})
