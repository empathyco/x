import { resolve } from 'path';
import vue from 'rollup-plugin-vue';
import typescript from 'rollup-plugin-typescript2';
import commonjs from '@rollup/plugin-commonjs';

export default [
  {
    input: resolve(__dirname, 'src/index.ts'),
    output: [
      { format: 'esm', dir: resolve(__dirname, 'dist/esm') },
      { format: 'cjs', dir: resolve(__dirname, 'dist/cjs'), exports: 'auto' }
    ],
    preserveModules: true,
    external: [
      'tailwindcss',
      'tailwindcss/plugin',
      '@empathyco/x-deep-merge',
      '@empathyco/x-utils'
    ],
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
  },
  {
    input: resolve(__dirname, 'demo/src/index.ts'),
    output: [{ format: 'esm', dir: resolve(__dirname, 'showcase') }],
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
        tsconfig: resolve(__dirname, 'demo/tsconfig.json'),
        tsconfigOverride: {
          include: ['src/components/**/*.{ts,vue}', 'src/shims-vue.d.ts'],
          exclude: ['vite.config.ts', 'tailwindcss-nesting.d.ts']
        }
      }),
      vue()
    ]
  }
];
