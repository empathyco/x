import { resolve } from 'node:path'
import tailwindcss from '@tailwindcss/vite'
import vue from '@vitejs/plugin-vue'
import { defineConfig } from 'vite'

export default defineConfig({
  build: {
    outDir: resolve(__dirname, '../dist/demo'),
    emptyOutDir: true,
  },
  plugins: [vue(), tailwindcss()],
})
