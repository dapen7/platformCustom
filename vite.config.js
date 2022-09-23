import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

import path from 'path'
import Components from 'unplugin-vue-components/vite'
import { ElementPlusResolver } from 'unplugin-vue-components/resolvers'

const pathSrc = path.resolve(__dirname, 'src')

export default defineConfig({
  resolve: {
    alias: {
      '@/': `${pathSrc}/`,
    },
  },
  plugins: [
    vue(),
    Components({
      extensions: ['vue', 'md'],
      dirs: ['src/components'],
      resolvers: [
        ElementPlusResolver(),
      ],
      dts: 'src/components.d.ts',
    }),
  ],
})