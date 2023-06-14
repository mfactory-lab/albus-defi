import path from 'node:path'
import type { BuildOptions } from 'vite'
import { defineConfig, loadEnv } from 'vite'
import vue from '@vitejs/plugin-vue'
import AutoImport from 'unplugin-auto-import/vite'
import Components from 'unplugin-vue-components/vite'
import Pages from 'vite-plugin-pages'
import Layouts from 'vite-plugin-vue-layouts'
import Icons from 'unplugin-icons/vite'
import IconsResolver from 'unplugin-icons/resolver'
import { FileSystemIconLoader } from 'unplugin-icons/loaders'
import { quasar, transformAssetUrls } from '@quasar/vite-plugin'
import inject from '@rollup/plugin-inject'

import { NodeGlobalsPolyfillPlugin } from '@esbuild-plugins/node-globals-polyfill'
import nodePolyfills from 'rollup-plugin-node-polyfills'

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  process.env = { ...process.env, ...loadEnv(mode, process.cwd()) }
  const isProd = mode === 'production'

  const build: BuildOptions = {
    manifest: isProd,
    chunkSizeWarningLimit: 1024,
    target: ['es2020'],
    rollupOptions: {
      plugins: [
        inject({ Buffer: ['buffer', 'Buffer'] }),
        nodePolyfills,
      ],
      external: [
        '@albus/core',
      ],
    },
  }

  return {
    build,
    plugins: [
      vue({
        template: { transformAssetUrls },
      }),
      quasar({
        sassVariables: './src/assets/styles/_variables.scss',
      }),
      Pages({
        extensions: ['vue', 'md'],
      }),
      Layouts(),

      // https://github.com/antfu/unplugin-icons
      Icons({
        compiler: 'vue3',
        autoInstall: true,
        customCollections: {
          app: FileSystemIconLoader(
            './src/assets/img/icons',
            svg => svg.replace(/^<svg /, '<svg fill="currentColor" '),
          ),
        },
      }),

      AutoImport({
        imports: [
          'vue',
          'vue-router',
          '@vueuse/head',
          '@vueuse/core',
          'quasar',
          {
            'i18next-vue': [
              'useTranslation',
            ],
          },
          // {
          //   '@package': ['...'],
          // },
        ],
        dts: 'types/auto-imports.d.ts',
        dirs: ['src/hooks/**', 'src/stores/**'],
      }),
      Components({
        // allow to autoload markdown components under `./src/components/`
        extensions: ['vue', 'md', 'jsx', 'tsx'],
        // allow auto import and register components used in markdown
        include: [/\.vue$/, /\.vue\?vue/, /\.md$/, /\.jsx$/, /\.tsx$/],
        resolvers: [
          IconsResolver({
            customCollections: ['app'],
          }),
        ],
        dts: 'types/components.d.ts',
      }),
    ],
    resolve: {
      // preserveSymlinks: true,
      alias: {
        '~/': `${path.resolve(__dirname, 'src')}/`,
        '@/': `${path.resolve(__dirname, 'src')}/`,
        // add buffer
        'node:buffer': 'buffer',
        // for metaplex
        'stream': 'rollup-plugin-node-polyfills/polyfills/stream',
        'events': 'rollup-plugin-node-polyfills/polyfills/events',
        'assert': 'assert',
        'crypto': 'crypto-browserify',
        'util': 'util',
        'near-api-js': 'near-api-js/dist/near-api-js.js',
      },
      // dedupe: [
      //  'bn.js',
      // 'bs58',
      // 'lodash',
      // 'buffer-layout',
      // '@solana/web3.js',
      // '@solana/buffer-layout',
      // ],
    },
    define: {
      'process.env': process.env,
      // global: 'globalThis',
    },
    css: {
      preprocessorOptions: {
        scss: {
          additionalData: '@use "~/assets/styles/variables.scss" as *;',
        },
      },
    },
    optimizeDeps: {
      esbuildOptions: {
        plugins: [NodeGlobalsPolyfillPlugin({ buffer: true })],
      },
    },
  }
})
