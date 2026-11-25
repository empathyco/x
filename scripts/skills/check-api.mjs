#!/usr/bin/env node
/**
 * Checks that the API names cited by every agent skill actually exist in the
 * built packages, so a skill cannot silently drift from the code it describes.
 *
 * Requires the packages to be built (it reads the published type declarations
 * and CSS sources, not `src/`).
 *
 * What is checked in each `packages/<pkg>/skills/<skill>/SKILL.md`:
 * - `import { A, B } from '<module>'` statements inside fenced code blocks: the
 *   module must be the package root or one of its subpaths, and every imported
 *   name must be exported by that exact entry point.
 * - Inline code spans that look like API names (PascalCase, camelCase with an
 *   uppercase letter, or `use*`/`is*` helpers; `Name.member` checks `Name`):
 *   the name must be exported by some entry point of the checked packages.
 * - Inline code spans with design-system classes (`xds:button-outlined`) or
 *   theme variables (`--xds-color-*`): they must exist in the x-design-system
 *   CSS sources. Tailwind core utilities are also valid with the `xds:` prefix
 *   (`xds:border-s`, `xds:text-start`), the same as the physical ones
 *   (`xds:border-l`, `xds:left-0`): they are checked with the Tailwind compiler.
 *
 * Directives (HTML comments, invisible to agents reading rendered markdown):
 * - `<!-- skills-check packages: @empathyco/x-components, @empathyco/x-types -->`
 *   names the packages whose exports are valid for inline names (defaults to
 *   the package that ships the skill).
 * - `<!-- skills-check ignore: Foo, barBaz -->` skips names that are not
 *   exports on purpose (props, events, local variables in prose).
 */
import { existsSync, readdirSync, readFileSync, statSync } from 'node:fs'
import { createRequire } from 'node:module'
import { join } from 'node:path'
import process from 'node:process'
import { fileURLToPath } from 'node:url'

const repoRoot = join(fileURLToPath(new URL('../../', import.meta.url)))
const packagesDir = join(repoRoot, 'packages')
const require = createRequire(join(repoRoot, 'package.json'))
const ts = require('typescript')

const errors = []
const fail = message => errors.push(message)

// --- Package discovery --------------------------------------------------------

/** @type {Map<string, { dir: string, json: any }>} */
const packages = new Map()
for (const entry of readdirSync(packagesDir)) {
  const dir = join(packagesDir, entry)
  const jsonPath = join(dir, 'package.json')
  if (statSync(dir).isDirectory() && existsSync(jsonPath)) {
    const json = JSON.parse(readFileSync(jsonPath, 'utf8'))
    packages.set(json.name, { dir, json })
  }
}

/**
 * Entry points (`''` for the root, otherwise the subpath) of a built package,
 * mapped to their type declaration file.
 *
 * @returns {Map<string, string> | null} null when the package has no types (CSS).
 */
function typeEntries(packageName) {
  const { dir, json } = packages.get(packageName)
  const publishDir = json.publishConfig?.directory ? join(dir, json.publishConfig.directory) : dir
  const publishedJsonPath = join(publishDir, 'package.json')
  const publishedJson = existsSync(publishedJsonPath)
    ? JSON.parse(readFileSync(publishedJsonPath, 'utf8'))
    : json
  if (!publishedJson.types) {
    return null
  }
  const entries = new Map()
  const rootTypes = join(publishDir, publishedJson.types)
  if (!existsSync(rootTypes)) {
    fail(`${packageName}: ${rootTypes} not found — build the package before running this check`)
    return entries
  }
  entries.set('', rootTypes)
  for (const sub of readdirSync(publishDir, { withFileTypes: true })) {
    const subTypes = join(publishDir, sub.name, 'index.d.ts')
    if (sub.isDirectory() && existsSync(subTypes) && subTypes !== rootTypes) {
      entries.set(sub.name, subTypes)
    }
  }
  return entries
}

/** @type {Map<string, Map<string, Set<string>>>} package -> entry -> exported names */
const exportsCache = new Map()

function exportsOf(packageName) {
  if (exportsCache.has(packageName)) {
    return exportsCache.get(packageName)
  }
  const entries = typeEntries(packageName)
  const result = new Map()
  if (entries) {
    const program = ts.createProgram([...entries.values()], {
      noEmit: true,
      skipLibCheck: true,
      module: ts.ModuleKind.ESNext,
      moduleResolution: ts.ModuleResolutionKind.Bundler,
      target: ts.ScriptTarget.ES2022,
    })
    const checker = program.getTypeChecker()
    for (const [subpath, file] of entries) {
      const moduleSymbol = checker.getSymbolAtLocation(program.getSourceFile(file))
      const names = moduleSymbol
        ? checker.getExportsOfModule(moduleSymbol).map(symbol => symbol.getName())
        : []
      result.set(subpath, new Set(names))
    }
  }
  exportsCache.set(packageName, result)
  return result
}

// --- Design system ------------------------------------------------------------

function designSystemIndex() {
  const libDir = join(packages.get('@empathyco/x-design-system').dir, 'lib')
  const cssFiles = [libDir, join(libDir, 'components')].flatMap(dir =>
    readdirSync(dir)
      .filter(file => file.endsWith('.css'))
      .map(file => readFileSync(join(dir, file), 'utf8')),
  )
  const css = cssFiles.join('\n')
  const utilities = new Set([...css.matchAll(/@utility\s+([a-z0-9*-]+)/g)].map(match => match[1]))
  const variants = new Set(
    [...css.matchAll(/@custom-variant\s+([a-z0-9-]+)/g)].map(match => match[1]),
  )
  const themeVariables = [...css.matchAll(/^\s*--([\w-]+)\s*:/gm)].map(match => match[1])
  // Functional utilities (`@utility button-*`) only accept values of the theme namespace they
  // read with `--value(--color-*-50)`: `button-accent` is valid, `button-primary` is not.
  /** @type {Map<string, string>} utility prefix -> theme namespace */
  const functional = new Map()
  for (const [, prefix, block] of css.matchAll(/@utility\s+([a-z0-9-]+)-\*\s*\{([\s\S]*?)\n\}/g)) {
    const namespace = /--value\(--([a-z]+(?:-[a-z]+)*)-\*/.exec(block)?.[1]
    if (namespace) {
      functional.set(prefix, namespace)
    }
  }
  return { utilities, variants, themeVariables, functional }
}

function isFunctionalUtility(utility) {
  for (const name of designSystem.utilities) {
    if (!name.endsWith('-*') || !utility.startsWith(name.slice(0, -1))) {
      continue
    }
    const prefix = name.slice(0, -2)
    const value = utility.slice(prefix.length + 1)
    const namespace = designSystem.functional.get(prefix)
    if (
      !namespace ||
      designSystem.themeVariables.some(
        variable =>
          variable === `${namespace}-${value}` || variable.startsWith(`${namespace}-${value}-`),
      )
    ) {
      return true
    }
  }
  return false
}

let designSystem = null

/**
 * Tailwind compiler of the design system entry point (`@import 'tailwindcss' prefix(xds)`), used
 * to recognise the Tailwind core utilities with the `xds:` prefix (`xds:border-s`, `xds:left-0`).
 */
const tailwind = await (async () => {
  const libDir = join(packages.get('@empathyco/x-design-system').dir, 'lib')
  const entry = join(libDir, 'index.css')
  const { compile } = await import(require.resolve('@tailwindcss/node'))
  return compile(readFileSync(entry, 'utf8'), { base: libDir, from: entry, onDependency() {} })
})()

/**
 * Checks whether a prefixed class (`xds:border-s`) is a Tailwind core utility by building it.
 *
 * @returns {boolean} If Tailwind generates a rule for the class.
 */
function isTailwindUtility(token) {
  const selector = `.${token.replace(/[:/.[\]()%]/g, match => `\\${match}`)}`
  return tailwind.build([token]).includes(selector)
}

const TAILWIND_VARIANTS = new Set(
  'hover focus focus-visible focus-within active visited disabled checked first last odd even empty group-hover group-focus peer-hover peer-checked before after placeholder dark sm md lg xl 2xl print motion-safe motion-reduce rtl ltr'.split(
    ' ',
  ),
)

function checkDesignSystemToken(token, where) {
  designSystem ??= designSystemIndex()
  if (token.startsWith('--xds-')) {
    // `--xds-color-*` arrives as `--xds-color-`: any theme variable starting with it is valid.
    const name = token.slice('--xds-'.length)
    if (!designSystem.themeVariables.some(variable => variable.startsWith(name))) {
      fail(`${where}: theme variable "${token}" does not exist`)
    }
    return
  }
  // `xds:selected:button-accent` -> variants ["selected"], utility "button-accent"
  const parts = token.split(':').slice(1)
  const utility = parts.pop()
  for (const variant of parts) {
    if (!designSystem.variants.has(variant) && !TAILWIND_VARIANTS.has(variant)) {
      fail(`${where}: "${token}" uses an unknown custom variant "${variant}"`)
    }
  }
  if (
    !designSystem.utilities.has(utility) &&
    !isFunctionalUtility(utility) &&
    !isTailwindUtility(token)
  ) {
    fail(`${where}: "${token}" is not a design-system or Tailwind utility`)
  }
}

// --- Skill parsing ------------------------------------------------------------

const API_NAME = /^[A-Za-z_$][\w$]*$/

function looksLikeApiName(name) {
  return /^[A-Z]/.test(name) || /[a-z][A-Z]/.test(name) || /^(?:use|is)[A-Z$]/.test(name)
}

function directiveList(content, key) {
  return [...content.matchAll(new RegExp(`<!--\\s*skills-check ${key}:([^>]*)-->`, 'g'))]
    .flatMap(match => match[1].split(','))
    .map(value => value.trim())
    .filter(Boolean)
}

function resolveModule(specifier) {
  for (const name of packages.keys()) {
    if (specifier === name) {
      return { packageName: name, subpath: '' }
    }
    if (specifier.startsWith(`${name}/`)) {
      return { packageName: name, subpath: specifier.slice(name.length + 1) }
    }
  }
  return null
}

function checkSkill(packageName, skillPath) {
  const where = skillPath.slice(repoRoot.length)
  const content = readFileSync(skillPath, 'utf8')
  const body = content.replace(/^---\n[\s\S]*?\n---\n/, '')
  const ignored = new Set(directiveList(content, 'ignore'))
  const checkedPackages = directiveList(content, 'packages')
  const scope = checkedPackages.length > 0 ? checkedPackages : [packageName]
  for (const name of scope) {
    if (!packages.has(name)) {
      fail(`${where}: skills-check directive names unknown package "${name}"`)
    }
  }

  const fences = [...body.matchAll(/```[^\n]*\n([\s\S]*?)```/g)]
  const prose = body.replace(/```[^\n]*\n[\s\S]*?```/g, '')

  // 1. Import statements in code blocks.
  for (const [, code] of fences) {
    for (const [, names, specifier] of code.matchAll(
      /import\s+(?:type\s+)?\{([^}]+)\}\s+from\s+['"]([^'"]+)['"]/g,
    )) {
      const resolved = resolveModule(specifier)
      if (!resolved) {
        continue // third-party module (vue, vitest, ...)
      }
      const entry = exportsOf(resolved.packageName).get(resolved.subpath)
      if (!entry) {
        fail(`${where}: "${specifier}" is not an entry point of ${resolved.packageName}`)
        continue
      }
      for (const raw of names.split(',')) {
        const name = raw
          .replace(/^\s*type\s+/, '')
          .split(/\s+as\s+/)[0]
          .trim()
        if (name && !entry.has(name)) {
          fail(`${where}: "${name}" is not exported by "${specifier}"`)
        }
      }
    }
  }

  // 2. Inline code spans in prose.
  const scopeExports = scope
    .filter(name => packages.has(name))
    .flatMap(name => [...exportsOf(name).values()])
  for (const [, span] of prose.matchAll(/`([^`\n]+)`/g)) {
    const token = span.trim()
    if (/^(?:xds:[\w:-]+|--xds-[\w-]+(?:\*)?)$/.test(token)) {
      checkDesignSystemToken(token.replace(/\*$/, ''), where)
      continue
    }
    if (/\.(?:md|ts|js|mjs|json|css|vue)$/.test(token)) {
      continue // file names
    }
    const name = token.replace(/\(\)$/, '').split('.')[0]
    if (!API_NAME.test(name) || !looksLikeApiName(name) || ignored.has(name)) {
      continue
    }
    if (scopeExports.length > 0 && !scopeExports.some(entry => entry.has(name))) {
      fail(`${where}: \`${token}\` is not exported by ${scope.join(', ')}`)
    }
  }
}

// --- Run ------------------------------------------------------------------------

let skillCount = 0
for (const [packageName, { dir }] of packages) {
  const skillsDir = join(dir, 'skills')
  if (!existsSync(skillsDir)) {
    continue
  }
  for (const skill of readdirSync(skillsDir)) {
    const skillPath = join(skillsDir, skill, 'SKILL.md')
    if (existsSync(skillPath)) {
      skillCount += 1
      checkSkill(packageName, skillPath)
    }
  }
}

if (errors.length > 0) {
  console.error(`skills:check-api FAILED with ${errors.length} error(s):`)
  for (const error of errors) {
    console.error(`  - ${error}`)
  }
  process.exit(1)
}
console.log(`skills:check-api OK (${skillCount} skills checked)`)
