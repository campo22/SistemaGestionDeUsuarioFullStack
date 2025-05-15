import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      '@components': path.resolve(__dirname, './src/presentation/components'),
      '@pages': path.resolve(__dirname, './src/presentation/pages'),
      '@store': path.resolve(__dirname, './src/presentation/store'),
      '@hooks': path.resolve(__dirname, './src/presentation/hooks'),
      '@services': path.resolve(__dirname, './src/application/services'),
      '@api': path.resolve(__dirname, './src/infrastructure/api'),
      '@types': path.resolve(__dirname, './src/domain/types'),
      '@utils': path.resolve(__dirname, './src/utils')
    }
  },
  server: {
    port: 5173
  }
})