import path from 'path';
import { sync as glob } from 'glob';
import { RollupOptions, Plugin } from 'rollup';
import copy from 'rollup-plugin-copy';
import del from 'rollup-plugin-delete';
import styles from 'rollup-plugin-styles';
import typescript from 'rollup-plugin-typescript2';
import vue3 from '@vitejs/plugin-vue';
import { dependencies as pkgDeps, peerDependencies as pkgPeerDeps } from '../package.json';
import { apiDocumentation } from './docgen/documentation.rollup-plugin';
import { importTokens, omitJsFiles } from './rollup-plugins/design-system.rollup-plugin';
import { generateEntryFiles } from './rollup-plugins/x-components.rollup-plugin';

const rootDir = path.resolve(__dirname, '../');
const buildPath = path.join(rootDir, 'dist');

const jsOutputDir = path.join(buildPath, 'js');
const typesOutputDir = path.join(buildPath, 'types');

const dependencies = new Set(Object.keys(pkgDeps).concat(Object.keys(pkgPeerDeps)));

const vueDocs = {
  name: 'vue-docs',
  transform: (_code: unknown, id: string) =>
    !/vue&type=docs/.test(id) ? undefined : `export default ''`
};

export const rollupConfig: RollupOptions = {
  input: path.join(rootDir, 'src/index.ts'),
  output: {
    dir: jsOutputDir,
    format: 'esm',
    sourcemap: true,
    preserveModules: true
  },
  onwarn(warning) {
    /* Circular dependencies are dangerous, and can result in an `undefined` error in runtime.
     * Because of that, when rollup detects a circular dependency (it emits a warning), we stop
     * the build with an error */
    if (warning.code === 'CIRCULAR_DEPENDENCY') {
      throw Error(`Circular dependency found: ${warning.ids?.join(' ') ?? ''}`);
    }
  },
  external(id) {
    /*
     Rollup treats by default all node_modules dependencies as external, but will launch a
     warning if you don't manually specify them. In our case apart from the package.json ones,
     we also need to add any dependency that starts with rxjs (due to rxjs having multiple
     entry points)
     */
    return (
      dependencies.has(id) || // Package.json dependencies
      /* As rxjs has multiple entry points, it needs to be declared this way */
      id.startsWith('rxjs')
    );
  },
  plugins: [
    del({
      targets: [
        `${buildPath}/*`,
        `${path.join(rootDir, 'docs')}/*`,
        `${path.join(rootDir, 'temp')}/*`
      ]
    }),
    typescript({
      useTsconfigDeclarationDir: true,
      tsconfig: path.resolve(rootDir, 'tsconfig.json'),
      tsconfigOverride: {
        compilerOptions: {
          declarationDir: typesOutputDir,
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
    vue3({
      template: {
        compilerOptions: {
          whitespace: 'condense'
        }
      }
    }) as Plugin,
    styles({
      minimize: true,
      mode: [
        'inject',
        varname => {
          const pathInjector = path.resolve('./tools/inject-css.js');
          return `import injectCss from '${pathInjector}';injectCss(${varname});`;
        }
      ]
    }),
    vueDocs,
    generateEntryFiles({ buildPath, jsOutputDir, typesOutputDir }),
    apiDocumentation({ buildPath }),
    copy({
      targets: [
        { src: ['build/tools'], dest: buildPath },
        { src: ['CHANGELOG.md', 'package.json', 'README.md', 'docs'], dest: buildPath }
      ],
      hook: 'writeBundle'
    })
  ]
};

// Design System CSS generation
const cssOutputDir = path.join(buildPath, 'design-system');

/** The config to generate one `.css` file with all the deprecated styles. */
export const cssDeprecatedRollupConfig: RollupOptions = {
  input: glob('src/design-system-deprecated/**/*.scss'),
  output: {
    dir: cssOutputDir,
    assetFileNames: '[name][extname]',
    preserveModules: true
  },
  plugins: [
    importTokens(),
    styles({ mode: ['extract', 'deprecated-full-theme.css'] }),
    omitJsFiles()
  ]
};
