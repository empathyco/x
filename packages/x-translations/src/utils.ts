import type { CommandParameters, JSON } from './types'
import fs from 'node:fs'
import path from 'node:path'
import process from 'node:process'

/**
 * Gets the parameters used to call the script.
 *
 * @returns SourcePath and targetPath as strings.
 */
export function getParams(): CommandParameters {
  const [sourcePath, targetPath] = process.argv.slice(2)
  if (sourcePath === undefined) {
    throw new Error('getParams, sourcePath not found')
  }
  return { sourcePath, targetPath }
}

/**
 * Checks if the file exits and if so, return it.
 *
 * @param sourcePath - The path of the file.
 *
 * @returns The source file depending if it is a CSV or a JSON.
 */
export function loadFile(sourcePath: string): JSON | string {
  if (!fs.existsSync(sourcePath)) {
    throw new Error(`loadFile, file not found ${sourcePath}`)
  }
  const content = fs.readFileSync(sourcePath, { encoding: 'utf8' })
  return path.extname(sourcePath) === '.json' ? (JSON.parse(content) as JSON) : content
}

/**
 * Transform and export the JSON or the CSV.
 *
 * @param source - The source path.
 * @param extension - The file extension.
 *
 * @returns The list of absolute paths to process.
 */
export function getSourcePaths(source: string, extension: string): string[] {
  const filePaths = fs.lstatSync(source).isDirectory()
    ? fs.readdirSync(source).map(fileName => path.join(source, fileName))
    : [source]
  return filePaths
    .filter(filePath => filePath.endsWith(extension))
    .map(filePath => path.resolve(process.cwd(), filePath))
}
/**
 * Exports the CSV or the JSON to a file.
 *
 * @param fileName - The file name given by the transformed one.
 * @param data - The JSON or the CSV to be exported.
 */
export function exportToFile(fileName: string, data: string): void {
  const { targetPath = 'output' } = getParams()
  const outputPath = path.join(targetPath, fileName)
  if (!fs.existsSync(targetPath)) {
    fs.mkdirSync(targetPath, { recursive: true })
  }

  fs.writeFileSync(outputPath, data)
}
