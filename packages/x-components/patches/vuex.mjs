import { existsSync, readFileSync, writeFileSync } from 'node:fs'
import { resolve } from 'node:path'

/** Add a types entry to the exports section in Vuex's package.json */
function patchVuex(path) {
  const vuexPackageJsonPath = resolve(import.meta.dirname, path)
  if (!existsSync(vuexPackageJsonPath)) return
  const pkg = JSON.parse(readFileSync(vuexPackageJsonPath, 'utf-8'))
  pkg.exports['.'].types = './types/index.d.ts'
  writeFileSync(vuexPackageJsonPath, JSON.stringify(pkg, null, 2))
}

// This project
patchVuex('node_modules/vuex/package.json')
// When is installed as a dependency
patchVuex('../../../vuex/package.json')
