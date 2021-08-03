import path from 'path';
import { sync as glob } from 'glob';
import buble from '@rollup/plugin-buble';
import commonjs from '@rollup/plugin-commonjs';
import autoprefixer from 'autoprefixer';
import { RollupOptions } from 'rollup';
import copy from 'rollup-plugin-copy';
import del from 'rollup-plugin-delete';
import rename from 'rollup-plugin-rename';
import styles from 'rollup-plugin-styles';
import typescript from 'rollup-plugin-typescript2';
import vue from 'rollup-plugin-vue';
import postcssLogical from 'postcss-logical';
import postcssDirPseudoClass from 'postcss-dir-pseudo-class';
import packageJSON from '../package.json';
import { apiDocumentation } from './docgen/documentation.rollup-plugin';
import {
  omitJsFiles,
  importTokens,
  renameComponentCssFile
} from './rollup-plugins/design-system.rollup-plugin';
import { generateEntryFiles } from './rollup-plugins/x-components.rollup-plugin';

const rootDir = path.resolve(__dirname, '../');
const buildPath = path.join(rootDir, 'dist');

const dependencies = new Set(Object.keys(packageJSON.dependencies));
const jsOutputDirectory = path.join(buildPath, 'js');
const typesOutputDirectory = path.join(buildPath, 'types');
const cssOutputDirectory = path.join(buildPath, 'design-system');
const postcssPlugins = [autoprefixer(), postcssLogical(), postcssDirPseudoClass()];

export const rollupConfig = createRollupOptions({
  input: path.join(rootDir, 'src/index.ts'),
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
    del({ targets: [`${buildPath}/*`, `${path.join(rootDir, 'docs')}/*`] }),
    commonjs(),
    typescript({
      useTsconfigDeclarationDir: true,
      tsconfig: path.resolve(rootDir, 'tsconfig.json'),
      tsconfigOverride: {
        compilerOptions: {
          declarationDir: typesOutputDirectory
        },
        exclude: [
          'node_modules',
          './src/main.ts',
          '**/__tests__/**',
          '**/__stubs__/**',
          './src/design-system'
        ]
      }
    }),
    vue({
      css: true,
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore Undocumented option to disable vue sourcemap generation because it breaks if
      // lang is set to ts:
      // https://github.com/vuejs/rollup-plugin-vue/issues/272#issuecomment-491721842
      needMap: false,
      /* Replace the component normalizer because the default one outputs ES6 code:
       * https://github.com/vuejs/rollup-plugin-vue/issues/262#issuecomment-655966620 */
      normalizer: '~vue-runtime-helpers/dist/normalize-component.js',
      /* Replace the component style injector because the default one outputs ES6 code */
      styleInjector: '~vue-runtime-helpers/dist/inject-style/browser.js',
      style: {
        postcssPlugins
      }
    }),
    buble({
      include: '**/*.vue'
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
 * The config to generate one `.css` file for each Design System Component, including the CSS
 * and the tokens.
 */
export const cssComponentsRollupConfig = createRollupOptions({
  ...commonCssOptions,
  input: glob('src/design-system/**/*.scss', { ignore: 'src/design-system/**/*.tokens.scss' }),
  plugins: [
    importTokens(),
    rename({ map: renameComponentCssFile }),
    styles({ mode: 'extract', plugins: postcssPlugins }),
    omitJsFiles()
  ]
});

/**
 * The config to generate the components `base.css` file with the base tokens.
 */
export const cssBaseRollupConfig = createRollupOptions({
  ...commonCssOptions,
  input: glob('src/design-system/base/**/*.scss'),
  plugins: [styles({ mode: ['extract', 'base.css'], plugins: postcssPlugins }), omitJsFiles()]
});

/**
 * The config to generate the components `default-theme.css` file with the base tokens and the
 * default version of the components.
 */
export const cssDefaultThemeRollupConfig = createRollupOptions({
  ...commonCssOptions,
  input: [
    ...glob('src/design-system/**/*default*.scss'),
    ...glob('src/design-system/base/**/*.scss')
  ],
  plugins: [
    importTokens(),
    styles({
      mode: ['extract', 'default-theme.css'],
      plugins: postcssPlugins
    }),
    omitJsFiles()
  ]
});

/**
 * The config to generate the components `full-theme.css` file with all the Design System included.
 */
export const cssFullThemeRollupConfig = createRollupOptions({
  ...commonCssOptions,
  input: glob('src/design-system/**/*.scss'),
  plugins: [
    styles({
      mode: ['extract', 'full-theme.css'],
      plugins: postcssPlugins
    }),
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
