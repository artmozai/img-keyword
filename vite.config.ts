import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'
import path from 'path'
import config from './src/config.json'

// https://vitejs.dev/config/
export default defineConfig({
  server: {
    port: 8080
  },
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  define: {
    'process.env': {
      VITE_APP_TITLE: JSON.stringify(config.seo.title),
      VITE_APP_DESCRIPTION: JSON.stringify(config.seo.description)
    }
  }
})