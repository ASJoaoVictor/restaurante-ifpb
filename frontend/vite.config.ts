import { tanstackRouter } from '@tanstack/router-plugin/vite'
import react from '@vitejs/plugin-react-swc'
import { defineConfig, loadEnv } from 'vite'
import tsconfigPaths from 'vite-tsconfig-paths'

const { VITE_API_ENDPOINT } = loadEnv('all', process.cwd())
const baseURL = VITE_API_ENDPOINT || 'http://localhost:3000'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    tanstackRouter({
      target: 'react',
      generatedRouteTree: 'src/utils/router.ts',
      autoCodeSplitting: true
    }),
    react(),
    tsconfigPaths()
  ],
  server: {
    allowedHosts: true,
    host: '0.0.0.0',
    headers: {
      'Content-Security-Policy': `default-src 'self'; base-uri 'self'; connect-src 'self' https://accounts.google.com ${baseURL}; font-src 'self' https: data:; form-action 'self'; frame-src 'self' https://accounts.google.com ${baseURL}; frame-ancestors 'self'; img-src 'self' data: https://lh3.googleusercontent.com; object-src 'none'; script-src 'self' 'unsafe-inline' 'unsafe-eval' https://accounts.google.com; script-src-attr 'none'; style-src 'self' https: 'unsafe-inline'; upgrade-insecure-requests`,
      'Cross-Origin-Opener-Policy': 'same-origin-allow-popups',
      'Cross-Origin-Resource-Policy': 'same-origin',
      'Origin-Agent-Cluster': '?1',
      'Permissions-Policy': 'geolocation=(), microphone=()',
      'Referrer-Policy': 'no-referrer',
      'Strict-Transport-Security': 'max-age=31536000; includeSubDomains',
      'X-Content-Type-Options': 'nosniff',
      'X-DNS-Prefetch-Control': 'off',
      'X-Download-Options': 'noopen',
      'X-Frame-Options': 'SAMEORIGIN',
      'X-Permitted-Cross-Domain-Policies': 'none',
      'X-XSS-Protection': '0'
    }
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes('node_modules')) {
            return 'vendor'
          }
        }
      }
    }
  }
})
