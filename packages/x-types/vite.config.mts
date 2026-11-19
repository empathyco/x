import dts from 'vite-plugin-dts'
import * as path from 'path'
import { defineConfig } from 'vite'

export default defineConfig({
  build: {
    lib: {
      entry: {
        index: path.resolve(__dirname, 'src/index.ts'),
        // The `/schemas` subpath: runtime reference objects + custom vitest matchers,
        // documented in the README ("jest schemas helpers").
        'schemas/index': path.resolve(__dirname, 'src/schemas/index.ts'),
      },
      name: 'XTypes',
      formats: ['es', 'cjs'],
      // index            -> dist/index.es.js / dist/index.cjs.js
      // schemas/index    -> dist/schemas/index.es.js / dist/schemas/index.cjs.js
      fileName: (format, entryName) => `${entryName}.${format}.js`,
    },
    rollupOptions: {
      // `src/schemas/schema-utils.ts` imports vitest's `expect` to register the custom
      // matchers, so vitest must stay external (the consumer's test runner provides it).
      external: ['vitest'],
    },
    sourcemap: true,
    emptyOutDir: true,
  },
  plugins: [
    dts({
      entryRoot: 'src',
      outDir: 'temp/types',
      insertTypesEntry: true,
    }),
  ],
})
