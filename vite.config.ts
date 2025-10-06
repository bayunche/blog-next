import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react-swc'
import path from 'path'
import type { PluginOption } from 'vite'
import viteCompression from 'vite-plugin-compression'
import { visualizer } from 'rollup-plugin-visualizer'

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')

  return {
    plugins: [
      react() as PluginOption,

      // Gzip 压缩（生产环境）
      mode === 'production' && viteCompression({
        verbose: true,
        disable: false,
        threshold: 10240, // 10KB 以上才压缩
        algorithm: 'gzip',
        ext: '.gz',
      }) as PluginOption,

      // Bundle 分析（可选，构建时启用）
      process.env.ANALYZE === 'true' && visualizer({
        open: true,
        filename: 'dist/stats.html',
        gzipSize: true,
        brotliSize: true,
      }) as PluginOption,
    ].filter(Boolean),

    // 路径别名配置
    resolve: {
      alias: {
        '@': path.resolve(__dirname, './src'),
        '@app': path.resolve(__dirname, './src/app'),
        '@features': path.resolve(__dirname, './src/features'),
        '@shared': path.resolve(__dirname, './src/shared'),
        '@design-system': path.resolve(__dirname, './src/design-system'),
        '@components': path.resolve(__dirname, './src/shared/components'),
        '@utils': path.resolve(__dirname, './src/shared/utils'),
        '@hooks': path.resolve(__dirname, './src/shared/hooks'),
        '@api': path.resolve(__dirname, './src/shared/api'),
        '@stores': path.resolve(__dirname, './src/shared/stores'),
        '@constants': path.resolve(__dirname, './src/shared/constants'),
        '@types': path.resolve(__dirname, './src/shared/types'),
        '@assets': path.resolve(__dirname, './src/shared/assets'),
        '@styles': path.resolve(__dirname, './src/app/styles'),
      },
    },

    // 开发服务器配置
    server: {
      port: 3000,
      host: true,
      open: true,
      cors: true,
      proxy: {
        '/api': {
          target: env.VITE_API_BASE_URL || 'http://localhost:6060',
          changeOrigin: true,
          rewrite: (path) => path,
        },
      },
    },

    // CSS 预处理器配置
    css: {
      preprocessorOptions: {
        less: {
          javascriptEnabled: true,
          modifyVars: {
            '@primary-color': '#d67f47',
            '@border-radius-base': '8px',
            '@font-size-base': '14px',
          },
        },
      },
      modules: {
        localsConvention: 'camelCase',
        generateScopedName: '[name]__[local]___[hash:base64:5]',
      },
    },

    // 构建配置
    build: {
      target: 'es2020',
      outDir: 'dist',
      assetsDir: 'assets',
      sourcemap: mode === 'development',
      minify: 'esbuild',
      // 提高性能
      cssCodeSplit: true,
      cssMinify: true,
      reportCompressedSize: false, // 关闭压缩大小报告，提升构建速度
      rollupOptions: {
        output: {
          // 移除手动分割，让Vite自动处理避免循环依赖
          chunkFileNames: 'js/[name]-[hash].js',
          entryFileNames: 'js/[name]-[hash].js',
          assetFileNames: '[ext]/[name]-[hash].[ext]',
        },
      },
      chunkSizeWarningLimit: 1000,
    },

    // 优化配置
    optimizeDeps: {
      include: [
        'react',
        'react-dom',
        'react-router-dom',
        'antd',
        '@ant-design/icons',
        'axios',
        'dayjs',
        'zustand',
        '@tanstack/react-query',
      ],
    },
  }
})