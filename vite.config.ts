import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { visualizer } from 'rollup-plugin-visualizer'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    // Plugin para analizar el bundle (solo en build)
    visualizer({
      filename: 'dist/stats.html',
      open: true,
      gzipSize: true,
      brotliSize: true,
    })
  ],
  build: {
    // Optimizaciones para reducir bundle size
    rollupOptions: {
      output: {
        manualChunks: {
          // Separar Material UI en su propio chunk
          'mui': ['@mui/material', '@mui/icons-material'],
          // Separar React en su propio chunk
          'react-vendor': ['react', 'react-dom'],
          // Separar Firebase en su propio chunk
          'firebase': ['firebase/app', 'firebase/firestore'],
          // Separar otras librerías
          'utils': ['react-intersection-observer']
        }
      }
    },
    // Aumentar el límite de advertencia a 1MB
    chunkSizeWarningLimit: 1000,
    // Optimizaciones adicionales
    target: 'esnext',
    minify: 'esbuild' // Usar esbuild que es más rápido y está incluido
  }
})
