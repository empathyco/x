import type { Plugin, RollupOptions } from 'rollup'
import fs from 'node:fs'
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

const getXModules = () => {
  const xModulesPath = path.join(rootDir, 'src', 'x-modules')
  return Object.fromEntries(
    fs
      .readdirSync(xModulesPath)
      .filter(file => fs.statSync(path.join(xModulesPath, file)).isDirectory())
      .map(module => [`${module}/index`, r(`src/x-modules/${module}/index.ts`)]),
  )
}

const rollupConfig: RollupOptions = {
  input: {
    'core/index': r('src/core.entry.ts'),
    ...getXModules(),
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
      check: false,
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
          const pathInjector = r('src/utils/inject-css.js')
          return `import injectCss from '${pathInjector}';injectCss(${varname});`
        },
      ],
    }),
    vueDocs,
    apiDocumentation({ buildPath }),
    copy({
      targets: [
        { src: ['build/tools'], dest: buildPath },
        { src: ['CHANGELOG.md', 'package.json', 'README.md', 'docs', 'patches'], dest: buildPath },
      ],
      hook: 'writeBundle',
    }),
  ],
}

export default rollupConfig
