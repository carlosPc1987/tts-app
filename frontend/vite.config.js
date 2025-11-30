import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    proxy: {
      '/api': {
        target: 'http://localhost:8080',
        changeOrigin: true,
        secure: false,
        configure: (proxy, _options) => {
          proxy.on('error', (err, _req, _res) => {
            console.log('⚠️  Proxy error:', err.message);
            console.log('💡 Make sure the backend is running on http://localhost:8080');
            console.log('   Wait 30-60 seconds after starting the backend');
          });
        }
      },
      '/admin': {
        target: 'http://localhost:8080',
        changeOrigin: true,
        secure: false,
        configure: (proxy, _options) => {
          proxy.on('error', (err, _req, _res) => {
            console.log('⚠️  Proxy error:', err.message);
            console.log('💡 Make sure the backend is running on http://localhost:8080');
          });
        }
      },
      '/uploads': {
        target: 'http://localhost:8080',
        changeOrigin: true,
        secure: false
      }
    }
  }
})

