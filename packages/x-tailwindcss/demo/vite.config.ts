import { resolve } from 'node:path'
import tailwindcss from '@tailwindcss/vite'
import vue from '@vitejs/plugin-vue'
import autoprefixer from 'autoprefixer'
import { defineConfig } from 'vite'

export default defineConfig({
  build: {
    outDir: resolve(__dirname, '../showcase'),
  },
  css: {
    postcss: { plugins: [autoprefixer()] },
  },
  // eslint-disable-next-line ts/no-unsafe-call
  plugins: [vue(), tailwindcss()],
})
