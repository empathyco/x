import { resolve } from 'path';
import typescript from 'rollup-plugin-typescript2';
import commonjs from '@rollup/plugin-commonjs';
import * as url from 'url';
const __dirname = url.fileURLToPath(new URL('.', import.meta.url));

export default {
  input: resolve(__dirname, 'src/index.ts'),
  output: [
    { format: 'esm', dir: resolve(__dirname, 'dist/esm'), preserveModules: true },
    { format: 'cjs', dir: resolve(__dirname, 'dist/cjs'), preserveModules: true, exports: 'auto' }
  ],
  external: ['tailwindcss', 'tailwindcss/plugin', '@empathyco/x-deep-merge', '@empathyco/x-utils'],
  plugins: [
    commonjs(),
    typescript({
      tsconfig: resolve(__dirname, 'tsconfig.json'),
      tsconfigOverride: {
        include: ['src/**/*.ts'],
        compilerOptions: {
          declarationDir: 'dist/types'
        }
      },
      useTsconfigDeclarationDir: true
    })
  ]
};
