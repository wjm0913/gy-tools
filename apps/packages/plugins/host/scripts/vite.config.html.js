import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'
import path from 'node:path'


const rootPath = path.join(import.meta.dirname, '../')
const projectPath = path.join(rootPath, 'src/html')

// https://vitejs.dev/config/
export default defineConfig({
  base: './',
  mode: process.env.NODE_ENV,
  root: projectPath,
  publicDir: false,
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.join(projectPath, 'src'),
    },
  },
  
  build: {
    emptyOutDir: true,
    minify: false,
    outDir: path.join(rootPath, 'dist/html'),
  },
  
  server: {
    port: 3000,
  }
})
