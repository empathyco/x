import * as path from 'path';
import fs from 'fs';
import { OutputOptions, rollup } from 'rollup';
import { cssDeprecatedRollupConfig, rollupConfig } from './rollup.config';

const rootDir = path.resolve(__dirname, '../');

/**
 * Function for deleting useless folders.
 */
function removeTempFiles() {
  fs.rmSync(path.join(rootDir, 'temp'), { recursive: true });
}

/**
 * Entry point for building the project.
 */
async function build() {
  const bundle = await rollup(rollupConfig);
  await bundle.write(rollupConfig.output as OutputOptions);

  const bundleCssDeprecatedComponents = await rollup(cssDeprecatedRollupConfig);
  await bundleCssDeprecatedComponents.write(cssDeprecatedRollupConfig.output as OutputOptions);

  removeTempFiles();
}

// eslint-disable-next-line no-console
build().catch(console.error);
