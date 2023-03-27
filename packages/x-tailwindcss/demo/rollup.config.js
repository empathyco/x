import { resolve } from 'path';
import commonjs from '@rollup/plugin-commonjs';
import styles from 'rollup-plugin-styles';
import typescript from 'rollup-plugin-typescript2';
import vue from 'rollup-plugin-vue';

export default {
  input: resolve(__dirname, 'src/index.ts'),
  output: [{ format: 'esm', dir: resolve(__dirname, '../showcase') }],
  preserveModules: true,
  external: [
    'vue',
    'vue-property-decorator',
    'vue-class-component',
    'tslib',
    /vue-runtime-helpers/
  ],
  plugins: [
    commonjs(),
    styles(),
    typescript({
      tsconfig: resolve(__dirname, 'tsconfig.json'),
      tsconfigOverride: {
        exclude: ['vite.config.ts', 'tailwindcss-nesting.d.ts', 'src/main.ts']
      }
    }),
    vue()
  ]
};
