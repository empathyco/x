import fs from 'fs';
import path from 'path';

/**
 * Asserts a directory exists recursively, creating it if it does not.
 *
 * @param filePath - The full path to the file, that may or may not exist.
 */
export function ensureDirectoryExists(filePath: string): void {
  const dirName = path.dirname(filePath);
  if (!fs.existsSync(dirName)) {
    fs.mkdirSync(dirName, { recursive: true });
  }
}
