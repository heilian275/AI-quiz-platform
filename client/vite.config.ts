import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import path from 'path';

// https://vite.dev/config/
export default defineConfig({
  plugins: [vue()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'), // 配置 @ 指向 src
    },
  },
  server: {
    port: 7070,
    // 以下代码可以使局域网内（公司）的用户都可以访问
    // host: "0.0.0.0"
    proxy: {
      '/api': {
        target: 'http://localhost:8080',
        changeOrigin: true
      }
    }
  }
})
