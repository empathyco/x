import { defineConfig } from 'vite'
import dts from 'vite-plugin-dts'
import * as path from 'path'

export default defineConfig({
  build: {
    lib: {
      entry: path.resolve(__dirname, 'src/index.ts'),
      name: 'XTypes',
      formats: ['es', 'cjs'],
      fileName: format => `index.${format}.js`,
    },
    rollupOptions: {
      external: [],
    },
    sourcemap: true,
    emptyOutDir: true,
  },
  plugins: [
    dts({
      entryRoot: 'src',
      outDir: 'dist',
    }),
  ],
})
