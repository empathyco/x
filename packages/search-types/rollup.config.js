import del from 'rollup-plugin-delete';
import execute from 'rollup-plugin-execute';
import typescript from 'rollup-plugin-typescript2';

export default [
  {
    input: 'src/index.ts',
    preserveModules: true,
    output: {
      format: 'cjs',
      dir: 'dist'
    },
    plugins: [
      del({ targets: 'dist' }),
      typescript({
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
    input: 'src/schemas/index.ts',
    output: {
      file: 'schemas/index.js',
      format: 'cjs'
    },
    external: ['@empathy/jest-utils'],
    plugins: [
      del({ targets: 'schemas' }),
      typescript(),
      execute([
        'api-extractor run -c schema-extractor.json --local',
        'api-documenter markdown -i temp -o docs/tests'
      ])
    ]
  }
];
