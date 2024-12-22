import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      // Chuyển tiếp tất cả các request có đường dẫn bắt đầu bằng /api đến backend
      '/api': {
        target: 'http://localhost:1234', // Địa chỉ của backend
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, ''), // Loại bỏ /api trước khi chuyển tiếp
      },
    },
  },
})

