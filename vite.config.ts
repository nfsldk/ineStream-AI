import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  // 加载环境变量，确保 Cloudflare Pages 设置的 API_KEY 能被读取
  const env = loadEnv(mode, '.', '');
  return {
    plugins: [react()],
    define: {
      // 将 process.env.API_KEY 注入到客户端代码中
      'process.env.API_KEY': JSON.stringify(env.API_KEY)
    }
  };
});