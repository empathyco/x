import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const __currentDirName = path.dirname(fileURLToPath(import.meta.url))
const fileNames = ['index.css', 'theme.css', 'variants.css']
const dirNames = ['components']

function createDist() {
  const distDir = path.resolve(__currentDirName, '../dist')
  if (fs.existsSync(distDir)) {
    fs.rmSync(distDir, { recursive: true, force: true })
  }
  fs.mkdirSync(distDir)
}

function copyLibToDist() {
  fileNames.forEach(fileName => {
    const srcDir = path.resolve(__currentDirName, fileName)
    const distDir = path.resolve(__currentDirName, '../dist', fileName)
    fs.copyFileSync(srcDir, distDir)
  })
  dirNames.forEach(dirName => {
    const srcDir = path.resolve(__currentDirName, dirName)
    const distDir = path.resolve(__currentDirName, '../dist', dirName)
    fs.cpSync(srcDir, distDir, { recursive: true })
  })
}

try {
  createDist()
  copyLibToDist()
  // eslint-disable-next-line no-console
  console.log('✅ XDS build complete!')
} catch (e) {
  console.error('❌ XDS build failed:', e)
}
