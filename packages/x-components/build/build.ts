import * as path from 'path';
import fs from 'fs';
import { rollup } from 'rollup';
import { rollupConfig } from './rollup.config';

const rootDir = path.resolve(__dirname, '../');

build().catch(console.error);

/**
 * Entry point for building the project.
 */
async function build(): Promise<any> {
  try {
    const bundle = await rollup(rollupConfig);
    await bundle.write(rollupConfig.output);
    return removeTempFiles();
  } catch (error) {
    console.error('Build failed: ', error.message);
    process.exit(1);
  }
}

/**
 * Function for deleting useless folders.
 */
function removeTempFiles(): void {
  fs.rmdirSync(path.join(rootDir, 'temp'), { recursive: true });
}
