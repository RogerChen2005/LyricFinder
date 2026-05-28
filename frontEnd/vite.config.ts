import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import mdPlugin from './src/vite-plugin-md'
import { fileURLToPath } from 'node:url'

export default defineConfig({
  plugins: [vue(), mdPlugin()],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    }
  },
  server: {
    proxy: {
      '/api': 'http://127.0.0.1:3030/'
    }
  },
  build: {
    outDir: 'static'
  }
})
