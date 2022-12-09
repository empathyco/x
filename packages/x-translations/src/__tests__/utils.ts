import { readFileSync } from 'fs';
import { resolve } from 'path';

/**
 * Returns an absolute path from the working directory.
 *
 * @param path - The relative path.
 * @returns The full path.
 *
 * @internal
 */
export function pathFromCwd(path: string): string {
  return resolve(process.cwd(), path);
}

/**
 * Loads the given file from the root of the project.
 *
 * @param path - The relative path from the root of the project.
 * @returns The string contents of the file.
 *
 * @internal
 */
export function readRootFile(path: string): string {
  return readFileSync(pathFromCwd(path), 'utf-8');
}

/**
 * Loads the given file from the provided dirname.
 *
 * @param dirname - The current directory.
 * @param path - The relative path to the file from the current directory.
 * @returns The string contents of the file.
 *
 * @internal
 */
export function readRelativeFile(dirname: string, path: string): string {
  return readFileSync(resolve(dirname, path), 'utf-8');
}
