import { rollup } from 'rollup';
import { rollupConfig } from './rollup.config';

build().catch(console.error);

async function build() {
  const bundle = await rollup(rollupConfig);
  await bundle.write(rollupConfig.output);
}
