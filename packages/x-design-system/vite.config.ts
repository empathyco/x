import { resolve } from 'node:path'
import tailwindcss from '@tailwindcss/vite'
import { defineConfig } from 'vite'

export default defineConfig({
  build: {
    outDir: resolve(__dirname, '../dist'),
    emptyOutDir: true,
  },
  plugins: [tailwindcss()],
})
