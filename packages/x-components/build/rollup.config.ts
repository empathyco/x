import path from 'path';
import commonjs from '@rollup/plugin-commonjs';
import { sync as glob } from 'glob';
import { RollupOptions } from 'rollup';
import copy from 'rollup-plugin-copy';
import del from 'rollup-plugin-delete';
import styles from 'rollup-plugin-styles';
import typescript from 'rollup-plugin-typescript2';
import vue, { VuePluginOptions } from 'rollup-plugin-vue';
import packageJSON from '../package.json';
import { normalizePath } from './build.utils';
import { apiDocumentation } from './docgen/documentation.rollup-plugin';
import { importTokens, omitJsFiles } from './rollup-plugins/design-system.rollup-plugin';
import { generateEntryFiles } from './rollup-plugins/x-components.rollup-plugin';

const rootDir = path.resolve(__dirname, '../');
const buildPath = path.join(rootDir, 'dist');

const dependencies = new Set(
  Object.keys(packageJSON.dependencies).concat(Object.keys(packageJSON.peerDependencies))
);
const jsOutputDirectory = path.join(buildPath, 'js');
const typesOutputDirectory = path.join(buildPath, 'types');
const cssOutputDirectory = path.join(buildPath, 'design-system');

export const rollupConfig = createRollupOptions({
  input: path.join(rootDir, 'src/index.ts'),
  output: {
    dir: jsOutputDirectory,
    format: 'esm',
    sourcemap: true,
    preserveModules: true
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
  plugins: [
    del({ targets: [`${buildPath}/*`, `${path.join(rootDir, 'docs')}/*`] }),
    commonjs(),
    typescript({
      useTsconfigDeclarationDir: true,
      tsconfig: path.resolve(rootDir, 'tsconfig.json'),
      tsconfigOverride: {
        compilerOptions: {
          declarationDir: typesOutputDirectory,
          target: 'es2020'
        },
        exclude: [
          'node_modules',
          './src/main.ts',
          '**/__tests__/**',
          '**/__stubs__/**',
          './src/design-system-deprecated'
        ]
      }
    }),
    vue({
      css: false,
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore Undocumented option to disable vue sourcemap generation because it breaks if
      // lang is set to ts:
      // https://github.com/vuejs/rollup-plugin-vue/issues/272#issuecomment-491721842
      needMap: false,
      template: {
        compilerOptions: {
          whitespace: 'condense'
        }
      } as VuePluginOptions['template'],
      style: {
        postcssCleanOptions: { disabled: true }
      }
    }),
    styles({
      mode: [
        'inject',
        (varname: string, id: string) =>
          `import { createInjector, createInjectorSSR } from 'vue-runtime-helpers';
           const isBrowser = /*#__PURE__*/ (function () {
             return (
                Object.prototype.toString.call(typeof process !== 'undefined' ? process : 0) !==
                '[object process]'
             );
           })();
           const useBrowserInjector =
             (typeof STRIP_SSR_INJECTOR !== 'undefined' && STRIP_SSR_INJECTOR) || isBrowser;
           const injector = useBrowserInjector ? createInjector({}) : createInjectorSSR({});
           injector('${normalizePath(id)}',{source:${varname}});`
      ]
    }),
    generateEntryFiles({
      buildPath,
      jsOutputDirectory,
      typesOutputDirectory
    }),
    apiDocumentation({
      buildPath
    }),
    copy({
      targets: [
        {
          src: ['build-helpers', 'CHANGELOG.md', 'package.json', 'README.md', 'docs'],
          dest: buildPath
        }
      ],
      hook: 'writeBundle'
    })
  ]
});

// Design System CSS generation

/**
 * Common options for all CSS Rollup configs.
 */
const commonCssOptions = createRollupOptions({
  output: {
    dir: cssOutputDirectory,
    assetFileNames: '[name][extname]'
  },
  preserveModules: true
});

/**
 * The config to generate one `.css` file with all the deprecated styles.
 */
export const cssDeprecatedComponentsRollupConfig = createRollupOptions({
  ...commonCssOptions,
  input: glob('src/design-system-deprecated/**/*.scss', {
    ignore: 'src/design-system-deprecated/**/*.tokens.scss'
  }),
  plugins: [
    importTokens(),
    styles({ mode: ['extract', 'deprecated-full-theme.css'] }),
    omitJsFiles()
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
