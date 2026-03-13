import { readdirSync, readFileSync, writeFileSync } from 'node:fs'
import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

/*
  TODO - This script formats the Tailwind's utilities to remove white spaces around '*' when
    using `--value(--anything- * -75)`. Prettier treats the `*` as a multiplication operator and
    adds spaces around it.
    This issue was partial fixed in Prettier https://github.com/prettier/prettier/pull/17362
    Remove script once Prettier formats itself Tailwind's functional utilities correctly and align
    NPM scripts `format`, `format:check` and `format:custom`.
*/

const __buildDirName = dirname(fileURLToPath(import.meta.url))
const __libDirName = resolve(__buildDirName, '../lib')
const valueRegex = /(--value\(--[\w-]+-)\s*\*\s*(-\d+)?\)/g

function getCssFiles(dir = __libDirName, fileList = []) {
  const files = readdirSync(dir, { withFileTypes: true })
  files.forEach(file => {
    const fileName = resolve(dir, file.name)
    if (file.isDirectory()) {
      getCssFiles(fileName, fileList)
    } else if (file.isFile() && fileName.endsWith('.css')) {
      fileList.push(fileName)
    }
  })
  return fileList
}

;(() => {
  try {
    const cssFiles = getCssFiles()
    cssFiles.forEach(file => {
      const originalContent = readFileSync(file, 'utf8')
      const formattedContent = originalContent.replace(valueRegex, '$1*$2)')
      writeFileSync(file, formattedContent, 'utf8')
    })
    console.info('✅ Prettier-Tailwind utilities formatter applied!')
  } catch (err) {
    console.error('❌ Prettier-Tailwind utilities formatter failed:', err)
  }
})()
