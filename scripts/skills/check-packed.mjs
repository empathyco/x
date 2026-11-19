#!/usr/bin/env node
/**
 * Verifies that the published npm tarballs actually contain the bundled agent
 * skills (skills-npm convention, https://github.com/antfu/skills-npm).
 *
 * - Packages packed from their root: a static check is enough — the `files`
 *   whitelist already includes `skills` and the skill files exist.
 * - `@empathyco/x-components` publishes from its `dist` directory (the skills
 *   only reach the tarball because the rollup build copies them there), and
 *   `@empathyco/x-types` ships a runtime entry for its `/schemas` subpath.
 *   Both are verified against the real tarball: their builds (which pack the
 *   tarball as a post-build step) are run and the tarball entries are asserted.
 *
 * Set SKILLS_CHECK_PACKED_NO_BUILD=1 to skip the build step and only inspect
 * the tarballs that already exist (CI uses this, because its
 * "Install Build & Pack" step already built and packed every package).
 */
import { execSync } from 'node:child_process'
import { existsSync, readdirSync, readFileSync, statSync } from 'node:fs'
import { join } from 'node:path'
import process from 'node:process'
import { fileURLToPath } from 'node:url'

const repoRoot = join(fileURLToPath(new URL('../../', import.meta.url)))
const packagesDir = join(repoRoot, 'packages')

const errors = []
const steps = []

const step = message => {
  steps.push(message)
  console.log(`- ${message}`)
}

const fail = message => {
  errors.push(message)
}

/**
 * @returns {string[]} tarball entry names
 */
function listTarballEntries(tarball) {
  const output = execSync(`tar -tzf ${JSON.stringify(tarball)}`, {
    cwd: repoRoot,
    encoding: 'utf8',
  })
  return output.split('\n').filter(Boolean)
}

/**
 * Tarball of the current version of a package (`empathyco-<name>-<version>.tgz`), looked up in
 * the given directories. Older tarballs left over from previous builds are ignored.
 *
 * @returns {string | null}
 */
function currentTarball(packageDir, directories) {
  const { name, version } = JSON.parse(readFileSync(join(packageDir, 'package.json'), 'utf8'))
  const fileName = `${name.replace('@', '').replace('/', '-')}-${version}.tgz`
  for (const directory of directories) {
    const path = join(directory, fileName)
    if (existsSync(path)) {
      return path
    }
  }
  return null
}

function assertTarballContains(tarball, expectedEntries, label) {
  if (!tarball) {
    fail(`${label}: no tarball found — did the build/pack step run?`)
    return
  }
  const entries = new Set(listTarballEntries(tarball))
  const missing = expectedEntries.filter(expected => !entries.has(expected))
  if (missing.length > 0) {
    for (const expected of missing) {
      fail(`${label}: tarball ${tarball} is missing "${expected}"`)
    }
    return
  }
  step(`${label}: ${tarball} contains ${expectedEntries.join(', ')}`)
}

function staticCheck(packageDir, packageJson) {
  const files = packageJson.files ?? []
  if (!files.includes('skills')) {
    fail(`${packageJson.name}: "files" must include "skills" so they reach the npm tarball`)
    return
  }
  const skillsDir = join(packageDir, 'skills')
  const skillCount = existsSync(skillsDir)
    ? readdirSync(skillsDir, { withFileTypes: true }).filter(
        entry => entry.isDirectory() && existsSync(join(skillsDir, entry.name, 'SKILL.md')),
      ).length
    : 0
  if (skillCount === 0) {
    fail(`${packageJson.name}: no skill with a SKILL.md found under skills/`)
    return
  }
  step(`${packageJson.name}: "files" includes "skills" and ${skillCount} skill(s) present`)
}

// --- 1. Static checks for every package packed from its root -----------------
for (const packageName of readdirSync(packagesDir)) {
  const packageDir = join(packagesDir, packageName)
  if (!statSync(packageDir).isDirectory()) {
    continue
  }
  const packageJsonPath = join(packageDir, 'package.json')
  if (!existsSync(packageJsonPath)) {
    continue
  }
  const packageJson = JSON.parse(readFileSync(packageJsonPath, 'utf8'))
  // x-components publishes from its build directory; handled by the build below.
  if (packageJson.publishConfig?.directory) {
    continue
  }
  staticCheck(packageDir, packageJson)
}

// --- 2. Tarball assertions for build-directory packages ----------------------
if (process.env.SKILLS_CHECK_PACKED_NO_BUILD) {
  step('skipping the build step (SKILLS_CHECK_PACKED_NO_BUILD=1); inspecting existing tarballs')
} else {
  // Building x-components also builds its workspace dependencies (including
  // x-types); both packages pack their tarball as a post-build step.
  console.log('\n> pnpm --filter @empathyco/x-components... build')
  execSync('pnpm --filter @empathyco/x-components... build', {
    cwd: repoRoot,
    stdio: 'inherit',
  })
}

const xComponentsDir = join(packagesDir, 'x-components')
const xComponentsTarball = currentTarball(xComponentsDir, [xComponentsDir, packagesDir])
assertTarballContains(
  xComponentsTarball,
  ['package/skills/x-components/SKILL.md', 'package/skills/empathyco-x/SKILL.md'],
  '@empathyco/x-components',
)

const xTypesDir = join(packagesDir, 'x-types')
const xTypesTarball = currentTarball(xTypesDir, [xTypesDir])
assertTarballContains(
  xTypesTarball,
  ['package/skills/x-types/SKILL.md', 'package/schemas/index.js', 'package/schemas/index.d.ts'],
  '@empathyco/x-types',
)

console.log('')
if (errors.length > 0) {
  console.error(`skills:check-packed FAILED with ${errors.length} error(s):`)
  for (const error of errors) {
    console.error(`  - ${error}`)
  }
  process.exit(1)
}
console.log(`skills:check-packed OK (${steps.length} checks passed)`)
