import { resolve } from 'node:path'
import tailwindcss from '@tailwindcss/vite'
import vue from '@vitejs/plugin-vue'
import { defineConfig } from 'vite'

export default defineConfig({
  build: {
    outDir: resolve(__dirname, '../showcase'),
  },
  plugins: [
    vue(),
      // eslint-disable-next-line ts/no-unsafe-argument
    tailwindcss({
      config: resolve(__dirname, './tailwind.config.ts'),
    } as any)
  ],
})
