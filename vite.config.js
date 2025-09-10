import { defineConfig } from 'vite'

export default defineConfig({
  // 开发服务器配置
  server: {
    port: 3000,
    open: true,
    host: true,
    // 允许文件系统访问，解决分享链接访问问题
    fs: {
      allow: [
        // 允许访问项目根目录
        '..',
        // 允许访问当前目录
        '.',
        // 允许访问node_modules
        'node_modules',
        // 允许访问父目录
        '/Users/starsky/apps/Oneiria'
      ]
    }
  },
  
  // 构建配置
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
    sourcemap: true,
    rollupOptions: {
      output: {
        // 分包策略
        manualChunks: {
          vendor: ['qrcode']
        }
      }
    }
  },
  
  // 优化配置
  optimizeDeps: {
    include: ['qrcode']
  },
  
  // 插件配置
  plugins: [
    // 可以在这里添加更多插件
  ]
})
