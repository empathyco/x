import del from 'rollup-plugin-delete';
import execute from 'rollup-plugin-execute';
import typescript from 'rollup-plugin-typescript2';

export default [
  {
    input: 'src/index.ts',
    preserveModules: true,
    output: [
      {
        format: 'cjs',
        dir: 'dist/cjs'
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
      }),
      execute([
        'api-extractor run --local',
        'api-documenter markdown -i temp -o docs'
      ])
    ]
  },
  {
    input: 'src/index.ts',
    preserveModules: true,
    output: [
      {
        format: 'esm',
        dir: 'dist/esm'
      }
    ],
    plugins: [
      typescript()
    ]
  },
  {
    input: 'src/schemas/index.ts',
    output: {
      file: 'schemas/index.js',
      format: 'cjs'
    },
    external: ['@empathy/jest-utils'],
    plugins: [
      del({ targets: 'schemas' }),
      typescript({ clean: true }),
      execute([
        'api-extractor run -c schema-extractor.json --local',
        'api-documenter markdown -i temp -o docs/tests'
      ])
    ]
  }
];
