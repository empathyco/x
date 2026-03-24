import { resolve } from 'node:path'
import tailwindcss from '@tailwindcss/vite'
import vue from '@vitejs/plugin-vue'
import { defineConfig } from 'vite'
import svgLoader from 'vite-svg-loader'

export default defineConfig({
  build: {
    outDir: resolve(__dirname, '../dist/demo'),
    emptyOutDir: true,
  },
  plugins: [vue(), svgLoader() as any, tailwindcss()],
})
