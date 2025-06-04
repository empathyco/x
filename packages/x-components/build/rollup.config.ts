import type { Plugin, RollupOptions } from 'rollup'
import path from 'node:path'
import vue3 from '@vitejs/plugin-vue'
import copy from 'rollup-plugin-copy'
import del from 'rollup-plugin-delete'
import styles from 'rollup-plugin-styles'
import typescript from 'rollup-plugin-typescript2'
import { dependencies as pkgDeps, peerDependencies as pkgPeerDeps } from '../package.json'
import { apiDocumentation } from './docgen/documentation.rollup-plugin'

const rootDir = path.resolve(__dirname, '../')
const buildPath = path.join(rootDir, 'dist')
const r = (p: string) => path.join(rootDir, p)

const typesOutputDir = path.join(buildPath, 'types')

const dependencies = new Set(Object.keys(pkgDeps).concat(Object.keys(pkgPeerDeps)))

const vueDocs = {
  name: 'vue-docs',
  transform: (_code: unknown, id: string) =>
    !/vue&type=docs/.test(id) ? undefined : `export default ''`,
}

const rollupConfig: RollupOptions = {
  input: {
    'core/index': r('src/core.entry.ts'),
    'device/index': r('src/x-modules/device/index.ts'),
    'empathize/index': r('src/x-modules/empathize/index.ts'),
    'experience-controls/index': r('src/x-modules/experience-controls/index.ts'),
    'extra-params/index': r('src/x-modules/extra-params/index.ts'),
    'facets/index': r('src/x-modules/facets/index.ts'),
    'history-queries/index': r('src/x-modules/history-queries/index.ts'),
    'identifier-results/index': r('src/x-modules/identifier-results/index.ts'),
    'next-queries/index': r('src/x-modules/next-queries/index.ts'),
    'popular-searches/index': r('src/x-modules/popular-searches/index.ts'),
    'queries-preview/index': r('src/x-modules/queries-preview/index.ts'),
    'query-suggestions/index': r('src/x-modules/query-suggestions/index.ts'),
    'recommendations/index': r('src/x-modules/recommendations/index.ts'),
    'related-prompts/index': r('src/x-modules/related-prompts/index.ts'),
    'related-tags/index': r('src/x-modules/related-tags/index.ts'),
    'scroll/index': r('src/x-modules/scroll/index.ts'),
    'search/index': r('src/x-modules/search/index.ts'),
    'search-box/index': r('src/x-modules/search-box/index.ts'),
    'semantic-queries/index': r('src/x-modules/semantic-queries/index.ts'),
    'tagging/index': r('src/x-modules/tagging/index.ts'),
    'url/index': r('src/x-modules/url/index.ts'),
    'x-modules.types/index': r('src/x-modules/x-modules.types.ts'),
  },
  output: {
    dir: buildPath,
    format: 'esm',
    sourcemap: true,
    preserveModules: true,
  },
  onwarn(warning) {
    /* Circular dependencies are dangerous, and can result in an `undefined` error in runtime.
     * Because of that, when rollup detects a circular dependency (it emits a warning), we stop
     * the build with an error */
    if (warning.code === 'CIRCULAR_DEPENDENCY') {
      throw new Error(`Circular dependency found: ${warning.ids?.join(' ') ?? ''}`)
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
    )
  },
  plugins: [
    del({
      targets: [
        `${buildPath}/*`,
        `${path.join(rootDir, 'docs')}/*`,
        `${path.join(rootDir, 'temp')}/*`,
      ],
    }),
    typescript({
      useTsconfigDeclarationDir: true,
      tsconfig: path.resolve(rootDir, 'tsconfig.json'),
      tsconfigOverride: {
        compilerOptions: {
          declarationDir: typesOutputDir,
          target: 'es2020',
        },
        exclude: ['node_modules', './src/main.ts', '**/__tests__/**', '**/__stubs__/**'],
      },
    }),
    vue3({
      template: {
        compilerOptions: {
          whitespace: 'condense',
          comments: false,
        },
      },
    }) as Plugin,
    styles({
      minimize: true,
      mode: [
        'inject',
        varname => {
          const pathInjector = path.resolve('./tools/inject-css.js')
          return `import injectCss from '${pathInjector}';injectCss(${varname});`
        },
      ],
    }),
    vueDocs,
    apiDocumentation({ buildPath }),
    copy({
      targets: [
        { src: ['build/tools'], dest: buildPath },
        { src: ['CHANGELOG.md', 'package.json', 'README.md', 'docs'], dest: buildPath },
      ],
      hook: 'writeBundle',
    }),
  ],
}

export default rollupConfig
