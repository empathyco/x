import type { Plugin } from 'rollup'
import fs from 'node:fs'
import { normalizePath } from '../build.utils'

/**
 * This function interpolates the `.tokens` suffix into a file path and checks if exists.
 *
 * @param file - The file path where to interpolate the `.tokens` suffix.
 * @returns The path of the tokens file if it exists. `null` otherwise.
 * @example `src/design-system/button/default.scss`
 * returns `src/design-system/button/default.tokens.scss` if exists.
 * @internal
 */
function getTokensFilePath(file: string) {
  const fileParts = file.split('.')
  const fileExtension = fileParts.pop() ?? ''
  const tokensFile = `${fileParts.join('.')}.tokens.${fileExtension}`
  return fs.existsSync(tokensFile) ? normalizePath(tokensFile) : null
}

/**
 * This function returns a {@link Plugin | RollupJS Plugin} to import the tokens files into the
 * components .scss files. For each `xxx.scss` processed, it looks for the `xxx.tokens.scss` tokens
 * file, and if exists, an import is added.
 *
 * @returns The plugin object to use in the Rollup config.
 * @internal
 */
export function importTokens(): Plugin {
  return {
    name: 'importTokens',
    transform(code, id) {
      const tokensFile = getTokensFilePath(id)
      return tokensFile ? `@import '${tokensFile}'; ${code}` : code
    },
  }
}

/**
 * This function returns a {@link Plugin | RollupJS Plugin} to omit the `.js` files from the
 * output generation. This is necessary because the `rollup-plugin-styles` plugin outputs `.js`
 * files together with the `.css`, to import them as module. It has a mode to only "emit" CSS,
 * but it needs another plugin (litcss) and is failing right now.
 *
 * @returns The plugin object to use in the Rollup config.
 * @internal
 */
export function omitJsFiles(): Plugin {
  return {
    name: 'omitJsFiles',
    generateBundle(_, bundle): void {
      Object.keys(bundle).forEach(fileName => {
        if (fileName.endsWith('.js')) {
          delete bundle[fileName]
        }
      })
    },
  }
}
