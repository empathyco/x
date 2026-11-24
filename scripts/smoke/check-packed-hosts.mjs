#!/usr/bin/env node
/**
 * Smoke test of the packed `@empathyco/x-components` tarball in host applications. It installs the
 * tarballs (and the ones of its workspace dependencies) in a throwaway host with `npm`, bundles a
 * minimal app with Vite, and runs the bundle in JSDOM. The hosts are:
 *
 * - `without-pinia`: the host does not declare `pinia`. The package must still be resolved, as it
 *   is a dependency of x-components, and the plugin must create its own instance.
 * - `with-pinia`: the host has its own Pinia installed in the app. There must be a single copy of
 *   `pinia`, the plugin must reuse the instance of the host, and must not install it again.
 *
 * Besides running the app, it type checks a file that imports the public types of the package with
 * `skipLibCheck: false`, so type imports that do not resolve in the host are detected.
 *
 * Set SMOKE_PACKED_NO_BUILD=1 to skip the build step and use the tarballs that already exist (CI
 * uses this, because its "Install Build & Pack" step already built and packed every package).
 *
 * Set SMOKE_PACKED_KEEP=1 to keep the temporary directories of the hosts.
 */
import { execFileSync, execSync } from 'node:child_process'
import {
  existsSync,
  mkdirSync,
  mkdtempSync,
  readFileSync,
  rmSync,
  statSync,
  writeFileSync,
} from 'node:fs'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import process from 'node:process'
import { fileURLToPath } from 'node:url'

const repoRoot = join(fileURLToPath(new URL('../../', import.meta.url)))
const packagesDir = join(repoRoot, 'packages')
const xComponentsDir = join(packagesDir, 'x-components')
const workspaceDependencies = ['x-adapter', 'x-adapter-platform', 'x-types', 'x-utils']

const errors = []
const MAX_LAYER_OVERHEAD_BYTES = 6 * 1024
const hostDirs = new Set()
const bundleSizes = {}

// The temporary hosts of a failed check are kept on purpose, but not the ones of an interruption.
process.on('SIGINT', () => {
  for (const hostDir of hostDirs) {
    rmSync(hostDir, { recursive: true, force: true })
  }
  process.exit(130)
})
const steps = []

const step = message => {
  steps.push(message)
  console.log(`- ${message}`)
}

const fail = message => {
  errors.push(message)
  console.error(`  ! ${message}`)
}

const readJson = path => JSON.parse(readFileSync(path, 'utf8'))

/**
 * Tarball of the current version of a package (`empathyco-<name>-<version>.tgz`), looked up in
 * the package directory and in `packages`.
 *
 * @returns {string | null}
 */
function currentTarball(packageDir) {
  const { name, version } = readJson(join(packageDir, 'package.json'))
  const fileName = `${name.replace('@', '').replace('/', '-')}-${version}.tgz`
  return [packageDir, packagesDir].map(dir => join(dir, fileName)).find(existsSync) ?? null
}

/**
 * Gets the tarball of a package, packing it if the build did not do it.
 *
 * @returns {string}
 */
function getTarball(packageName) {
  const packageDir = join(packagesDir, packageName)
  const existing = currentTarball(packageDir)
  if (existing) {
    return existing
  }
  execSync('pnpm pack', { cwd: packageDir, stdio: 'ignore' })
  const packed = currentTarball(packageDir)
  if (!packed) {
    throw new Error(`Could not pack ${packageName}`)
  }
  return packed
}

/** Runs a command in a directory, returning its output. Throws with the output on failure. */
function run(command, args, cwd) {
  try {
    return execFileSync(command, args, { cwd, encoding: 'utf8', stdio: 'pipe' })
  } catch (error) {
    throw new Error(
      `${command} ${args.join(' ')} failed in ${cwd}\n${error.stdout ?? ''}\n${error.stderr ?? ''}`,
    )
  }
}

/** Finds all the installed copies of a package in `node_modules`. */
function findInstalledCopies(hostDir, packageName) {
  return run('find', ['.', '-type', 'd', '-path', `*/node_modules/${packageName}`], hostDir)
    .split('\n')
    .filter(path => path && existsSync(join(hostDir, path, 'package.json')))
}

const hostMain = withPinia => `
import { platformAdapter } from '@empathyco/x-adapter-platform'
import { XPlugin, xPlugin } from '@empathyco/x-components'
import { searchBoxXModule } from '@empathyco/x-components/search-box'
import { createApp, nextTick } from 'vue'
${withPinia ? "import { createPinia } from 'pinia'" : ''}

const result = {}
window.__SMOKE__ = result

async function main() {
  const app = createApp({ render: () => null })
  let hostPinia
  let hostPiniaInstallCalls = 0
  ${
    withPinia
      ? `hostPinia = createPinia()
  const originalInstall = hostPinia.install
  hostPinia.install = (...args) => {
    hostPiniaInstallCalls++
    return originalInstall.apply(hostPinia, args)
  }
  app.use(hostPinia)`
      : ''
  }
  app.use(xPlugin, { adapter: platformAdapter })
  result.moduleName = searchBoxXModule.name
  const root = document.createElement('div')
  document.body.appendChild(root)
  app.mount(root)

  XPlugin.store.commit('x/searchBox/setQuery', 'query-1')
  result.committedQuery = XPlugin.store.state.x.searchBox.query
  result.getterQuery = XPlugin.store.getters['x/searchBox/trimmedQuery']
  await XPlugin.bus.emit('UserIsTypingAQuery', 'query-2')
  await nextTick()
  result.wiredQuery = XPlugin.store.state.x.searchBox.query
  result.hasPinia = !!XPlugin.pinia
  result.hostPiniaInstalled = !!app.config.globalProperties.$pinia
  result.piniaIsHost = !!hostPinia && XPlugin.pinia === hostPinia
  result.hostPiniaInstallCalls = hostPiniaInstallCalls
}

main()
  .catch(error => {
    result.error = String((error && error.stack) || error)
  })
  .finally(() => {
    result.done = true
  })
`

const hostViteConfig = `
import { defineConfig } from 'vite'

export default defineConfig({
  logLevel: 'warn',
  // The same flags that @vitejs/plugin-vue defines in a host, so Vue and Pinia devtools code is
  // removed from the bundle as it is in a real host.
  define: {
    'process.env.NODE_ENV': '"production"',
    __VUE_OPTIONS_API__: 'true',
    __VUE_PROD_DEVTOOLS__: 'false',
    __VUE_PROD_HYDRATION_MISMATCH_DETAILS__: 'false',
  },
  build: {
    lib: { entry: 'main.js', formats: ['iife'], name: 'Host', fileName: () => 'host.js' },
    minify: true,
  },
})
`

const runBundle = `
const { readFileSync } = require('node:fs')
const { JSDOM } = require('jsdom')

const dom = new JSDOM('<!doctype html><html><body></body></html>', {
  runScripts: 'outside-only',
  url: 'https://example.com/',
})
dom.window.eval(readFileSync('dist/host.js', 'utf8'))
const started = Date.now()
const interval = setInterval(() => {
  const result = dom.window.__SMOKE__
  if (!result) {
    console.log(JSON.stringify({ error: 'The bundle did not set window.__SMOKE__' }))
    process.exit(0)
  }
  if (result.done || Date.now() - started > 15000) {
    clearInterval(interval)
    console.log(JSON.stringify(result))
    process.exit(0)
  }
}, 50)
`

const typesCheck = `import type { XPluginOptions } from '@empathyco/x-components'
import type {} from '@empathyco/x-components/search-box'

export const options: Partial<XPluginOptions> = {}
`

const tsconfig = {
  compilerOptions: {
    strict: true,
    module: 'esnext',
    moduleResolution: 'node',
    target: 'esnext',
    skipLibCheck: false,
    noEmit: true,
    types: [],
  },
  files: ['types-check.ts'],
}

/** Type checks the host with `skipLibCheck: false`, returning the lines of the diagnostics. */
function typeCheck(hostDir) {
  try {
    run('node_modules/.bin/tsc', ['-p', '.'], hostDir)
    return []
  } catch (error) {
    return error.message.split('\n').filter(line => line.includes('error TS'))
  }
}

async function checkHost({ name, withPinia, xComponentsTarball, isBaseline = false }) {
  const label = `host ${name}`
  const hostDir = mkdtempSync(join(tmpdir(), `x-smoke-${name}-`))
  hostDirs.add(hostDir)
  console.log(`\n> ${label} (${hostDir})`)
  const xComponentsPackage = readJson(join(xComponentsDir, 'package.json'))
  const dev = xComponentsPackage.devDependencies
  const tarballs = {
    '@empathyco/x-components': xComponentsTarball ?? getTarball('x-components'),
    ...Object.fromEntries(
      workspaceDependencies.map(dependency => [
        readJson(join(packagesDir, dependency, 'package.json')).name,
        getTarball(dependency),
      ]),
    ),
  }
  const dependencies = {
    ...Object.fromEntries(Object.entries(tarballs).map(([key, path]) => [key, `file:${path}`])),
    vue: dev.vue,
    vuex: dev.vuex,
    ...(withPinia ? { pinia: xComponentsPackage.peerDependencies.pinia } : {}),
  }
  writeFileSync(
    join(hostDir, 'package.json'),
    JSON.stringify({
      name: `smoke-${name}`,
      private: true,
      type: 'module',
      dependencies,
      devDependencies: { vite: dev.vite, jsdom: dev.jsdom, typescript: dev.typescript },
      overrides: Object.fromEntries(Object.keys(tarballs).map(key => [key, `$${key}`])),
    }),
  )
  writeFileSync(join(hostDir, 'main.js'), hostMain(withPinia))
  writeFileSync(join(hostDir, 'vite.config.mjs'), hostViteConfig)
  writeFileSync(join(hostDir, 'run-bundle.cjs'), runBundle)
  writeFileSync(join(hostDir, 'types-check.ts'), typesCheck)
  writeFileSync(join(hostDir, 'tsconfig.json'), JSON.stringify(tsconfig))

  const before = errors.length
  try {
    run('npm', ['install', '--no-audit', '--no-fund', '--ignore-scripts'], hostDir)
    step(`${label}: installed`)

    const copies = findInstalledCopies(hostDir, 'pinia')
    if (isBaseline) {
      step(`${label}: baseline tarball, ${copies.length} copies of pinia`)
    } else if (copies.length === 1) {
      step(`${label}: a single copy of pinia installed (${copies[0]})`)
    } else {
      fail(
        `${label}: expected a single copy of pinia, found ${copies.length}: ${copies.join(', ')}`,
      )
    }
    if (!isBaseline) {
      const tree = run('npm', ['ls', 'pinia', '--all'], hostDir)
      if (!withPinia && !tree.includes('@empathyco/x-components')) {
        fail(`${label}: pinia does not come from x-components\n${tree}`)
      }
    }

    run('node_modules/.bin/vite', ['build'], hostDir)
    const bundleSize = statSync(join(hostDir, 'dist', 'host.js')).size
    bundleSizes[name] = bundleSize
    step(`${label}: bundled (${(bundleSize / 1024).toFixed(1)} kB IIFE)`)
    if (!withPinia && !isBaseline) {
      // Without modules that have a Pinia store, Pinia must not reach the bundle of the host.
      const bundle = readFileSync(join(hostDir, 'dist', 'host.js'), 'utf8')
      if (/\$onAction|\$subscribe/.test(bundle)) {
        fail(`${label}: the bundle contains pinia code, but no module uses it`)
      }
    }

    const result = JSON.parse(run('node', ['run-bundle.cjs'], hostDir).trim().split('\n').pop())
    const expectations = {
      error: undefined,
      moduleName: 'searchBox',
      committedQuery: 'query-1',
      getterQuery: 'query-1',
      wiredQuery: 'query-2',
      hasPinia: withPinia,
      hostPiniaInstalled: withPinia,
      piniaIsHost: withPinia,
      hostPiniaInstallCalls: withPinia ? 1 : 0,
    }
    for (const [key, expected] of Object.entries(expectations)) {
      if (result[key] !== expected) {
        fail(
          `${label}: expected ${key} to be ${JSON.stringify(expected)}, got ${JSON.stringify(result[key])}`,
        )
      }
    }
    if (errors.length === before) {
      step(`${label}: the app runs as expected`)
    }

    // The declarations of the package have errors that are not related to pinia (i.e. in the vue
    // components), so only the diagnostics that mention the `pinia` module make the check fail.
    const diagnostics = typeCheck(hostDir)
    const piniaDiagnostics = diagnostics.filter(line => /['"]pinia['"/]/.test(line))
    if (piniaDiagnostics.length > 0) {
      fail(`${label}: pinia types do not resolve\n${piniaDiagnostics.join('\n')}`)
    } else {
      step(
        `${label}: pinia types resolve with skipLibCheck: false ` +
          `(${diagnostics.length} unrelated diagnostics ignored)`,
      )
    }
  } catch (error) {
    fail(`${label}: ${error.message}`)
  } finally {
    if (process.env.SMOKE_PACKED_KEEP || errors.length > before) {
      console.log(`  (kept ${hostDir})`)
    } else {
      rmSync(hostDir, { recursive: true, force: true })
    }
  }
}

if (process.env.SMOKE_PACKED_NO_BUILD) {
  step('skipping the build step (SMOKE_PACKED_NO_BUILD=1); using existing tarballs')
} else {
  console.log('\n> pnpm --filter @empathyco/x-components... build')
  execSync('pnpm --filter @empathyco/x-components... build', { cwd: repoRoot, stdio: 'inherit' })
}
if (!currentTarball(xComponentsDir)) {
  fail('@empathyco/x-components: no tarball found — did the build/pack step run?')
} else {
  for (const host of [
    { name: 'without-pinia', withPinia: false },
    { name: 'with-pinia', withPinia: true },
  ]) {
    await checkHost(host)
  }
  // Optional: a tarball built from the base branch, to check that a host without Pinia modules
  // does not get bigger.
  const baselineTarball = process.env.SMOKE_PACKED_BASELINE_TARBALL
  if (baselineTarball) {
    await checkHost({
      name: 'baseline',
      withPinia: false,
      xComponentsTarball: baselineTarball,
      isBaseline: true,
    })
    const difference = bundleSizes['without-pinia'] - bundleSizes.baseline
    // The coexistence layer (bridge, router and emitters code) is always bundled, but Pinia is not.
    if (difference > MAX_LAYER_OVERHEAD_BYTES) {
      fail(
        `the bundle without pinia is ${difference} bytes bigger than the baseline ` +
          `(max ${MAX_LAYER_OVERHEAD_BYTES})`,
      )
    } else {
      step(`the bundle without pinia differs ${difference} bytes from the baseline`)
    }
  }
}

console.log('')
if (errors.length > 0) {
  console.error(`smoke:packed-hosts FAILED with ${errors.length} error(s):`)
  for (const error of errors) {
    console.error(`  - ${error}`)
  }
  process.exit(1)
}
console.log(`smoke:packed-hosts OK (${steps.length} checks passed)`)
