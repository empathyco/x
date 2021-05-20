import fs from 'fs';
import path from 'path';
import { CommandParameters, JSON } from './types';

/**
 * Gets the parameters used to call the script.
 *
 * @returns SourcePath and targetPath as strings.
 */
export function getParams(): CommandParameters {
  const [sourcePath, targetPath] = process.argv.slice(2);
  if (sourcePath === undefined) {
    throw Error('getParams, sourcePath not found');
  }
  return { sourcePath, targetPath };
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
    throw Error(`loadFile, file not found ${sourcePath}`);
  }
  return path.extname(sourcePath) === '.json'
    ? require(path.resolve(sourcePath))
    : fs.readFileSync(sourcePath, { encoding: 'utf8' });
}

/**
 * Exports the CSV or the JSON to a file.
 *
 * @param data - The JSON or the CSV to be exported.
 * @param extension - The file extension.
 */
export function exportToFile(data: string, extension: string): void {
  const { sourcePath, targetPath } = getParams();
  let outputPath = '';
  const fileName = `${path.basename(sourcePath).split(/\.[^.]+$/)[0]}.${extension}`;
  if (targetPath) {
    outputPath = path.join(targetPath, fileName);
  } else {
    fs.mkdirSync('./output', { recursive: true });
    outputPath = path.join('./output', fileName);
  }
  fs.writeFileSync(outputPath, data);
}
