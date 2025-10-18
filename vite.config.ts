import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react-swc'
import path from 'path'
import type { PluginOption } from 'vite'
import viteCompression from 'vite-plugin-compression'
import { visualizer } from 'rollup-plugin-visualizer'

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')
  const apiTarget = env.VITE_API_BASE_URL || 'http://localhost:6060'
  const proxyTarget = apiTarget.replace(/\/api\/?$/, '')

  return {
    plugins: [
      react() as PluginOption,

      // Gzip 鍘嬬缉锛堢敓浜х幆澧冿級
      mode === 'production' && viteCompression({
        verbose: true,
        disable: false,
        threshold: 10240, // 10KB 浠ヤ笂鎵嶅帇缂?        algorithm: 'gzip',
        ext: '.gz',
      }) as PluginOption,

      // Bundle 鍒嗘瀽锛堝彲閫夛紝鏋勫缓鏃跺惎鐢級
      process.env.ANALYZE === 'true' && visualizer({
        open: true,
        filename: 'dist/stats.html',
        gzipSize: true,
        brotliSize: true,
      }) as PluginOption,
    ].filter(Boolean),

    // 璺緞鍒悕閰嶇疆
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

    // 寮€鍙戞湇鍔″櫒閰嶇疆
    server: {
      port: 3000,
      host: true,
      open: true,
      cors: true,
      proxy: {
        '/api': {
          target: env.VITE_API_BASE_URL || 'http://localhost:6060',
          changeOrigin: true,
          // 开发环境移除 /api 前缀，保持与后端路由一致
          rewrite: (path) => path.replace(/^\/api/, ''),
        },
      },
    },

    // CSS 棰勫鐞嗗櫒閰嶇疆
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

    // 鏋勫缓閰嶇疆
    build: {
      target: 'es2020',
      outDir: 'dist',
      assetsDir: 'assets',
      sourcemap: mode === 'development',
      minify: 'esbuild',
      // 鎻愰珮鎬ц兘
      cssCodeSplit: true,
      cssMinify: true,
      reportCompressedSize: false, // 鍏抽棴鍘嬬缉澶у皬鎶ュ憡锛屾彁鍗囨瀯寤洪€熷害
      rollupOptions: {
        output: {
          // 绉婚櫎鎵嬪姩鍒嗗壊锛岃Vite鑷姩澶勭悊閬垮厤寰幆渚濊禆
          chunkFileNames: 'js/[name]-[hash].js',
          entryFileNames: 'js/[name]-[hash].js',
          assetFileNames: '[ext]/[name]-[hash].[ext]',
        },
      },
      chunkSizeWarningLimit: 1000,
    },

    // 浼樺寲閰嶇疆
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










