import { resolve } from 'path';
import commonjs from '@rollup/plugin-commonjs';
import typescript from 'rollup-plugin-typescript2';
import vue3 from '@vitejs/plugin-vue';
import * as url from 'url';
const __dirname = url.fileURLToPath(new URL('.', import.meta.url));

export default {
  input: resolve(__dirname, 'src/index.ts'),
  output: [{ format: 'esm', dir: resolve(__dirname, '../showcase'), preserveModules: true }],
  external: ['vue', 'tslib'],
  plugins: [
    commonjs(),
    typescript({
      tsconfig: resolve(__dirname, 'tsconfig.json'),
      tsconfigOverride: {
        exclude: ['vite.config.ts', 'tailwindcss-nesting.d.ts', 'src/main.ts']
      }
    }),
    vue3()
  ]
};
