import { resolve } from 'node:path'
import * as url from 'node:url'
import commonjs from '@rollup/plugin-commonjs'
import typescript from 'rollup-plugin-typescript2'
const __dirname = url.fileURLToPath(new URL('.', import.meta.url))

export default {
  input: resolve(__dirname, 'src/index.ts'),
  output: [
    { format: 'esm', dir: resolve(__dirname, 'dist/esm'), preserveModules: true },
    { format: 'cjs', dir: resolve(__dirname, 'dist/cjs'), preserveModules: true, exports: 'auto' },
  ],
  external: ['@empathyco/x-deep-merge', '@empathyco/x-utils', 'tailwindcss'],
  plugins: [
    commonjs(),
    typescript({
      tsconfig: resolve(__dirname, 'tsconfig.json'),
      tsconfigOverride: {
        include: ['src/**/*.ts'],
        compilerOptions: {
          declarationDir: 'dist/types',
        },
      },
      useTsconfigDeclarationDir: true,
    }),
  ],
}
