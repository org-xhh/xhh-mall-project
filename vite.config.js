import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
// 没有给display:flex 添加前缀
import postcssPresetEnv from 'postcss-preset-env'

// import postCssPxToRem from 'postcss-pxtorem'

// https://cn.vitejs.dev/guide/build.html
import legacyPlugin from '@vitejs/plugin-legacy'

import refreshVersion from './src/plugins/refreshVersion.js'
const nowTime = new Date().getTime()

import autoprefixer from 'autoprefixer'

import { formatDate } from '@web-xhh/web-utils'

// 按需引入
import AutoImport from 'unplugin-auto-import/vite'
import Components from 'unplugin-vue-components/vite'
import { ElementPlusResolver } from 'unplugin-vue-components/resolvers'

// 实时校验代码
import eslintPlugin from 'vite-plugin-eslint'

// https://vitejs.dev/config/
// command
export default defineConfig(({ mode }) => ({
  base: '/xhh-mall-project/',
  plugins: [
    vue(),
    AutoImport({
      resolvers: [ElementPlusResolver()]
    }),
    Components({
      resolvers: [ElementPlusResolver()]
    }),
    // 传统浏览器可以通过插件 @vitejs/plugin-legacy 来支持，
    // 它将自动生成传统版本的 chunk 及与其相对应 ES 语言特性方面的 polyfill。
    // 兼容版的 chunk 只会在不支持原生 ESM 的浏览器中进行按需加载。
    legacyPlugin({
      // 低版本浏览器引入 index-legacy-936a62a2.js
      // 需要下载terser不然报错
      targets: ['defaults', 'chrome 52']
    }),
    // 引入插件，写入版本号
    refreshVersion({
      version: nowTime
    }),
    eslintPlugin()
  ],
  // IP启动
  server: {
    host: '0.0.0.0',
    port: '3006',
    open: true, // 运行是否自动打开浏览器
    proxy: {
      '/api': {
        target: 'https://su.bcebos.com',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, '')
      }
    }
  },
  resolve: {
    alias: {
      '~': fileURLToPath(new URL('./', import.meta.url)),
      '@': fileURLToPath(new URL('./src', import.meta.url))
    },
    // 引入时 省略文件的后缀
    extensions: ['.js', '.json', '.vue']
  },
  define: {
    __PROJECT_VERSION__: nowTime // 缓存版本，用来和最新版比较
  },
  css: {
    preprocessorOptions: {
      less: {
        math: 'always', // 括号内才使用数学计算
        additionalData: `@import "@/assets/css/public.less";`
      }
    },
    postcss: {
      plugins: [
        postcssPresetEnv(), // 预设环境插件，包含高级 CSS 语法的降级、前缀补全等众多功能
        // postCssPxToRem({
        //   // 自适应，px => rem转换
        //   rootValue: 16, // 1rem的大小
        //   propList: ['*'] // 需要转换的属性，这里选择全部都进行转换
        // }),
        autoprefixer({
          // 自动添加前缀 display:flex
          overrideBrowserslist: [
            'Android 4.1',
            'iOS 7.1',
            'Chrome > 51',
            'ff > 31'
            //'last 10 versions', // 所有主流浏览器最近版本
          ]
          // grid: true // 为Grid布局参数添加IE前缀
        })
      ]
    }
  },
  build: {
    // target: 'modules', // 默认 ['es2020', 'edge88', 'firefox78', 'chrome87', 'safari14']
    // minify: "esbuild", // 默认 or true
    // minify: 'terser',
    // terserOptions: {
    //   compress: {
    //     drop_console: command === 'build',
    //     drop_debugger: command === 'build'
    //   },
    // },
    rollupOptions: {
      output: {
        entryFileNames: `assets/[name].${formatDate('', 'yyyyMMdd')}.[hash].js`, // 修改入口文件名 index
        chunkFileNames: `assets/[name].[hash].js`, // 修改代码分割时的文件名
        assetFileNames: `assets/[name].[hash].[ext]` // 修改资源文件名，比如图片、字体、css等。
      }
    },
    sourcemap: mode !== 'production'
    // cssCodeSplit: false // CSS代码拆分（默认true），如果禁用，整个项目中的所有 CSS 将被提取到一个 CSS 文件中style.f7565ac1.css
  },
  esbuild: {
    drop: mode === 'production' ? ['console', 'debugger'] : []
  }
}))
