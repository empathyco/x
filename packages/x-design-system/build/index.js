import { copyFileSync, cpSync, existsSync, mkdirSync, readdirSync, rmSync } from 'node:fs'
import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

const __buildDirName = dirname(fileURLToPath(import.meta.url))
const __rootDirName = resolve(__buildDirName, '..')
const __distDirName = resolve(__rootDirName, 'dist')
const __libDirName = resolve(__rootDirName, 'lib')

function createDist() {
  if (existsSync(__distDirName)) {
    rmSync(__distDirName, { recursive: true, force: true })
  }
  mkdirSync(__distDirName)
}

function copyLibToDist() {
  readdirSync(__libDirName, { withFileTypes: true }).forEach(dirent => {
    const __direntLibDirName = resolve(__libDirName, dirent.name)
    const __direntDistDirName = resolve(__distDirName, dirent.name)
    return dirent.isDirectory()
      ? cpSync(__direntLibDirName, __direntDistDirName, { recursive: true })
      : copyFileSync(__direntLibDirName, __direntDistDirName)
  })
}

try {
  createDist()
  copyLibToDist()
  // eslint-disable-next-line no-console
  console.info('✅ XDS build complete!')
} catch (e) {
  console.error('❌ XDS build failed:', e)
}
