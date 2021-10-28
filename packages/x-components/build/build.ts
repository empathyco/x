import * as path from 'path';
import fs from 'fs';
import { rollup } from 'rollup';
import {
  cssBaseRollupConfig,
  cssComponentsRollupConfig,
  cssDefaultThemeRollupConfig,
  cssFullThemeRollupConfig,
  rollupConfig
} from './rollup.config';

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

    const bundleCssComponents = await rollup(cssComponentsRollupConfig);
    await bundleCssComponents.write(cssComponentsRollupConfig.output);

    const bundleCssBase = await rollup(cssBaseRollupConfig);
    await bundleCssBase.write(cssBaseRollupConfig.output);

    const bundleCssDefaultTheme = await rollup(cssDefaultThemeRollupConfig);
    await bundleCssDefaultTheme.write(cssDefaultThemeRollupConfig.output);

    const bundleCssFullTheme = await rollup(cssFullThemeRollupConfig);
    await bundleCssFullTheme.write(cssFullThemeRollupConfig.output);

    return removeTempFiles();
  } catch (error) {
    // eslint-disable-next-line no-console
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
