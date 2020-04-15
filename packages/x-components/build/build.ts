import { rollup } from 'rollup';
import { rollupConfig } from './rollup.config';

build().catch(console.error);

/**
 * Entry point for building the project.
 */
async function build(): Promise<any> {
  const bundle = await rollup(rollupConfig);
  try {
    return await bundle.write(rollupConfig.output);
  } catch (error) {
    console.error('Build failed: ', error.message);
    process.exit(1);
  }
}
