import del from 'rollup-plugin-delete';
import typescript from 'rollup-plugin-typescript2';

/* Models - CJS & ESM build */
const models = {
  input: 'src/index.ts',
  output: [
    {
      format: 'cjs',
      dir: 'dist/cjs',
      preserveModules: true
    },
    {
      format: 'esm',
      dir: 'dist/esm',
      preserveModules: true
    }
  ],
  plugins: [
    del({ targets: 'dist' }),
    typescript({
      clean: true,
      tsconfigOverride: {
        compilerOptions: {
          declaration: true,
          declarationMap: true,
          declarationDir: './temp/types'
        }
      },
      useTsconfigDeclarationDir: true
    })
  ]
};

/* Schemas - CJS build */
const schemas = {
  input: 'src/schemas/index.ts',
  output: {
    file: 'schemas/index.js',
    format: 'cjs'
  },
  external: ['@empathyco/x-jest-utils'],
  plugins: [del({ targets: 'schemas' }), typescript({ clean: true })]
};

export default [models, schemas];
