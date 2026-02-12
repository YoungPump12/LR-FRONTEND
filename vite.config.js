import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  base: '/app/',
  server: {
    proxy: {
      '/api': {
        target: 'https://api.tafadzwa.co',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, '/api'),
        secure: false,
        headers: {
          'Access-Control-Allow-Origin': '*',
        }
      }
    }
  }
})
