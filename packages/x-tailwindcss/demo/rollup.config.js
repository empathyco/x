import { resolve } from 'path';
import vue from 'rollup-plugin-vue';
import typescript from 'rollup-plugin-typescript2';
import commonjs from '@rollup/plugin-commonjs';

export default {
  input: resolve(__dirname, 'src/index.ts'),
  output: [{ format: 'esm', dir: 'showcase' }],
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
    typescript({
      tsconfig: resolve(__dirname, 'tsconfig.json'),
      tsconfigOverride: {
        include: ['src/components/**/*.{ts,vue}', 'src/shims-vue.d.ts'],
        exclude: ['vite.config.ts', 'tailwindcss-nesting.d.ts']
      }
    }),
    vue()
  ]
};
