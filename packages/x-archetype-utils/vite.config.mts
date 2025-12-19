import { defineConfig } from 'vite'
import dts from 'vite-plugin-dts'
import * as path from 'path'
import pkg from './package.json'

export default defineConfig({
  build: {
    lib: {
      entry: path.resolve(__dirname, 'src/index.ts'),
      name: 'XArchetypeUtils',
      formats: ['es', 'cjs'],
      fileName: format => `index.${format}.js`,
    },

    rollupOptions: {
      external: [
        ...Object.keys(pkg.dependencies ?? {}),
        ...Object.keys(pkg.peerDependencies ?? {}),
      ],
    },

    sourcemap: true,
    emptyOutDir: true,
  },

  plugins: [
    dts({
      entryRoot: 'src',
      outputDir: 'dist',
    }),
  ],
})
