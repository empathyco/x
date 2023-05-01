import * as path from 'path';
import fs from 'fs';
import { rollup } from 'rollup';
import { cssDeprecatedComponentsRollupConfig, rollupConfig } from './rollup.config';

const rootDir = path.resolve(__dirname, '../');

// eslint-disable-next-line no-console
build().catch(console.error);

/**
 * Entry point for building the project.
 */
async function build(): Promise<any> {
  try {
    const bundle = await rollup(rollupConfig);
    await bundle.write(rollupConfig.output);

    const bundleCssDeprecatedComponents = await rollup(cssDeprecatedComponentsRollupConfig);
    await bundleCssDeprecatedComponents.write(cssDeprecatedComponentsRollupConfig.output);

    return removeTempFiles();
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error('Build failed: ', (error as Error).message);
    process.exit(1);
  }
}

/**
 * Function for deleting useless folders.
 */
function removeTempFiles(): void {
  fs.rmdirSync(path.join(rootDir, 'temp'), { recursive: true });
}
