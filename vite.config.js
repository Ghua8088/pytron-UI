import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

export default defineConfig({
  plugins: [react()],
  build: {
    lib: {
      entry: path.resolve(__dirname, 'index.js'), // Entry point of your library
      name: 'PytronUI',
      fileName: (format) => `pytron-ui.${format}.js`
    },
    rollupOptions: {
      // 1. CRITICAL: Externalize React
      // This tells the bundler: "Don't look for React here. The parent app will provide it."
      external: ['react', 'react-dom'],
      output: {
        globals: {
          react: 'React',
          'react-dom': 'ReactDOM'
        }
      }
    }
  }
})