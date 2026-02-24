import { fileURLToPath, URL } from 'node:url'

import vue from '@vitejs/plugin-vue'
import { defineConfig } from 'vite'
import viteCompression from 'vite-plugin-compression'

// https://vite.dev/config/
export default defineConfig({
  server: {
    proxy: {
      '/api': {
        // 代理所有以/api开头的请求
        target: 'http://localhost:8080', // 后端地址
        changeOrigin: true // 修改请求头Host
      }
    }
  },
  plugins: [
    vue(),
    viteCompression({
      algorithm: 'gzip', // 压缩算法（固定gzip）
      ext: '.gz', // 生成的压缩文件后缀（比如index.js → index.js.gz）
      threshold: 10240, // 文件大小超过10KB才压缩（小文件压缩收益低）
      deleteOriginFile: false, // 不删除原文件（必须false，Nginx需要原文件兜底）
      verbose: true // 打包时打印压缩日志（方便看哪些文件被压缩了）
    })
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    }
  }
})
