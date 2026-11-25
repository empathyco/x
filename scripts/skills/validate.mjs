#!/usr/bin/env node
/**
 * Validates the agent skills shipped with every publishable package
 * (skills-npm convention, https://github.com/antfu/skills-npm) against the
 * Agent Skills specification (https://agentskills.io/specification).
 *
 * Checks per `packages/<pkg>/skills/<skill>/SKILL.md`:
 * - frontmatter `name`: 1-64 chars, lowercase alphanumerics and hyphens (no
 *   leading/trailing/consecutive hyphens), and it must match the skill folder
 *   name;
 * - frontmatter `description`: 1-1024 chars;
 * - markdown body after the frontmatter is not empty.
 *
 * Checks per publishable package:
 * - it ships at least one skill under `skills/`;
 * - its `files` whitelist includes `skills`, unless it publishes from a build
 *   directory (covered by `skills:check-packed`, which inspects the real
 *   tarball).
 *
 * No external dependencies on purpose: it must run anywhere the repo runs.
 */
import { existsSync, readdirSync, readFileSync, statSync } from 'node:fs'
import { join } from 'node:path'
import process from 'node:process'
import { fileURLToPath } from 'node:url'

const repoRoot = join(fileURLToPath(new URL('../../', import.meta.url)))
const packagesDir = join(repoRoot, 'packages')

const NAME_PATTERN = /^[a-z0-9]+(?:-[a-z0-9]+)*$/

const errors = []
const reported = []

const fail = message => {
  errors.push(message)
  reported.push(`  ✗ ${message}`)
}

const ok = message => {
  reported.push(`  ✓ ${message}`)
}

/**
 * Minimal frontmatter parser (flat `key: value` pairs) — the Agent Skills
 * frontmatter we ship is flat, and this avoids a yaml dependency.
 *
 * @returns {{ fields: Record<string, string>, body: string }}
 */
function parseFrontmatter(content, filePath) {
  const lines = content.split('\n')
  if (lines[0]?.trim() !== '---') {
    fail(`${filePath}: missing YAML frontmatter (file must start with "---")`)
    return { fields: {}, body: content }
  }
  const end = lines.findIndex((line, index) => index > 0 && line.trim() === '---')
  if (end === -1) {
    fail(`${filePath}: unterminated YAML frontmatter`)
    return { fields: {}, body: content }
  }
  const fields = {}
  for (const line of lines.slice(1, end)) {
    const match = /^([A-Za-z][A-Za-z0-9_-]*):\s*(.*)$/.exec(line)
    if (!match) {
      continue // ignore nested/indented values; not needed for the required fields
    }
    let value = match[2].trim()
    if (
      (value.startsWith("'") && value.endsWith("'")) ||
      (value.startsWith('"') && value.endsWith('"'))
    ) {
      value = value.slice(1, -1)
    }
    fields[match[1]] = value
  }
  return { fields, body: lines.slice(end + 1).join('\n') }
}

function validateSkill(skillDir, skillMdPath) {
  const skillName = skillDir
  const content = readFileSync(skillMdPath, 'utf8')
  const { fields, body } = parseFrontmatter(content, skillMdPath)

  if (!fields.name) {
    fail(`${skillMdPath}: frontmatter is missing the required "name" field`)
  } else {
    if (fields.name.length > 64) {
      fail(`${skillMdPath}: "name" must be at most 64 characters`)
    }
    if (!NAME_PATTERN.test(fields.name)) {
      fail(`${skillMdPath}: "name" must use lowercase alphanumerics and single hyphens only`)
    }
    if (fields.name !== skillName) {
      fail(
        `${skillMdPath}: "name" ("${fields.name}") must match the skill folder name ("${skillName}")`,
      )
    }
  }

  if (!fields.description) {
    fail(`${skillMdPath}: frontmatter is missing the required "description" field`)
  } else if (fields.description.length > 1024) {
    fail(`${skillMdPath}: "description" must be at most 1024 characters`)
  }

  if (body.trim().length === 0) {
    fail(`${skillMdPath}: the markdown body after the frontmatter is empty`)
  }

  if (errors.length === 0) {
    ok(`${skillName} (valid frontmatter and body)`)
  }
}

let packageCount = 0
for (const packageName of readdirSync(packagesDir)) {
  const packageDir = join(packagesDir, packageName)
  if (!statSync(packageDir).isDirectory()) {
    continue
  }
  packageCount += 1
  const packageJsonPath = join(packageDir, 'package.json')
  if (!existsSync(packageJsonPath)) {
    continue
  }
  const packageJson = JSON.parse(readFileSync(packageJsonPath, 'utf8'))
  reported.push(`${packageJson.name ?? packageName}:`)

  const skillsDir = join(packageDir, 'skills')
  const skillDirs = existsSync(skillsDir)
    ? readdirSync(skillsDir, { withFileTypes: true })
        .filter(entry => entry.isDirectory())
        .map(entry => entry.name)
    : []

  if (skillDirs.length === 0) {
    fail(`${packageJson.name}: publishable package does not ship any skill under skills/`)
    continue
  }
  for (const skillName of skillDirs) {
    const skillMdPath = join(skillsDir, skillName, 'SKILL.md')
    if (!existsSync(skillMdPath)) {
      fail(`${packageJson.name}: skills/${skillName}/ has no SKILL.md`)
      continue
    }
    validateSkill(skillName, skillMdPath)
  }

  // Packages that publish from a build directory (x-components) are checked
  // against the real tarball by `skills:check-packed`.
  const publishesFromBuildDir = Boolean(packageJson.publishConfig?.directory)
  if (!publishesFromBuildDir && !(packageJson.files ?? []).includes('skills')) {
    fail(`${packageJson.name}: "files" must include "skills" so they reach the npm tarball`)
  }
}

console.log(reported.join('\n'))
console.log('')
if (errors.length > 0) {
  console.error(`skills:validate FAILED with ${errors.length} error(s):`)
  for (const error of errors) {
    console.error(`  - ${error}`)
  }
  process.exit(1)
}
console.log(`skills:validate OK (${packageCount} packages checked)`)
