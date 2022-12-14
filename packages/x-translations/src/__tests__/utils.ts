import { readFileSync } from 'fs';
import path, { resolve } from 'path';

/**
 * Returns an absolute path from the project root.
 *
 * @param targetPath - The path to add to the project root.
 * @returns The full path.
 *
 * @internal
 */
export function pathFromProjectRoot(targetPath: string): string {
  return path.join(__dirname, '..', '..', targetPath);
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
  return readFileSync(pathFromProjectRoot(path), 'utf-8');
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
