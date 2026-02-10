import copy from 'rollup-plugin-copy'
import del from 'rollup-plugin-delete'
import typescript from 'rollup-plugin-typescript2'

export default {
  input: 'src/index.ts',
  output: [
    {
      format: 'cjs',
      dir: 'dist/cjs',
      preserveModules: true,
    },
    {
      format: 'esm',
      dir: 'dist/esm',
      preserveModules: true,
    },
  ],
  external: ['@empathyco/x-deep-merge', '@empathyco/x-utils', 'vue-i18n'],
  plugins: [
    del({ targets: 'dist' }),
    copy({
      targets: [{ src: 'src/home', dest: 'dist' }],
    }),
    typescript({
      clean: true,
      useTsconfigDeclarationDir: true,
      tsconfigOverride: {
        exclude: ['node_modules', '**/__tests__/**'],
      },
    }),
  ],
}
