import commonjs from '@rollup/plugin-commonjs';
import autoprefixer from 'autoprefixer';
import path from 'path';
import { RollupOptions } from 'rollup';
import del from 'rollup-plugin-delete';
import typescript from 'rollup-plugin-typescript2';
import vue from 'rollup-plugin-vue';
import packageJSON from '../package.json';
import { apiDocumentation } from './documentation.rollup-plugin';
import { generateEntryFiles } from './x-components.rollup-plugin';

const dependencies = new Set(Object.keys(packageJSON.dependencies));
const jsOutputDirectory = path.join(__dirname, '../dist');
const typesOutputDirectory = path.join(__dirname, '../types');
export const rollupConfig = createRollupOptions({
  input: path.join(__dirname, '../src/index.ts'),
  output: {
    dir: jsOutputDirectory,
    format: 'esm',
    sourcemap: true
  },
  onwarn(warning) {
    /* Circular dependencies are dangerous, and can result in an `undefined` error in runtime.
     * Because of that, when rollup detects a circular dependency (it emits a warning), we stop
     * the build with an error */
    if (warning.code === 'CIRCULAR_DEPENDENCY') {
      throw Error(`Circular dependency found: ${warning.cycle?.join(' ') as string}`);
    }
  },
  external(id) {
    /*
       Rollup treats by default all node_modules dependencies as external, but will launch a
       warning if you don't manually specify them. In our case apart from the package.json ones,
       we also need to add any dependency that starts with rxjs (due to rxjs having multiple
       entry points), and the vue-runtime-helpers, which is a dependency added by the SFC compiler
    */
    return (
      dependencies.has(id) || // Package.json dependencies
      /* As rxjs has multiple entry points, it needs to be declared this way */
      id.startsWith('rxjs') ||
      /* Vue SFC dependency. Needs to be here because rollup generates a relative import to the
       node_modules folder */
      id.includes('vue-runtime-helpers')
    );
  },
  preserveModules: true,
  plugins: [
    del({ targets: [`${jsOutputDirectory}/*`, `${typesOutputDirectory}/*`] }),
    commonjs(),
    typescript({
      objectHashIgnoreUnknownHack: true,
      useTsconfigDeclarationDir: true,
      tsconfig: path.resolve(__dirname, '../tsconfig.json'),
      tsconfigOverride: {
        compilerOptions: {
          declarationDir: typesOutputDirectory
        },
        exclude: ['node_modules', './src/main.ts', '**/*.spec.ts', '*test*']
      }
    }),
    vue({
      css: true,
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore Undocumented option to disable vue sourcemap generation because it breaks if
      // lang is set to ts:
      // https://github.com/vuejs/rollup-plugin-vue/issues/272#issuecomment-491721842
      needMap: false,
      style: {
        postcssPlugins: [
          autoprefixer({
            grid: 'autoplace'
          })
        ]
      }
    }),
    generateEntryFiles({
      jsOutputDirectory,
      typesOutputDirectory
    }),
    apiDocumentation()
  ]
});

/**
 * Util function to create type-safe Rollup options.
 *
 * @param options - The Rollup options to create.
 * @returns Type-safe Rollup options.
 */
export function createRollupOptions<T extends RollupOptions>(options: T): T {
  return options;
}
