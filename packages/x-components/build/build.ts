import { rollup } from 'rollup';
import { rollupConfig } from './rollup.config';

build().catch(console.error);

/**
 * Entry point for building the project.
 */
async function build(): Promise<void> {
  const bundle = await rollup(rollupConfig);
  await bundle.write(rollupConfig.output);
}
