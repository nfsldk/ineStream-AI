import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  // 对于 Cloudflare Pages 根域名部署，使用 '/' 通常比 './' 更稳定，
  // 尤其是涉及 SPA 路由时（虽然本项目主要用 state 路由，但 '/' 是标准）
  base: '/', 
  define: {
    // 注入环境变量，防止浏览器报错 "process is not defined"
    // 如果没有设置 API_KEY，则默认为空字符串
    'process.env.API_KEY': JSON.stringify(process.env.API_KEY || ''),
    'process.env': {} 
  },
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
    sourcemap: false
  }
});