import type { OutputOptions } from 'rollup'
import { rollup } from 'rollup'
import rollupConfig from './rollup.config'

/**
 * Entry point for building the project.
 */
async function build() {
  const bundle = await rollup(rollupConfig)
  await bundle.write(rollupConfig.output as OutputOptions)
}

build().catch(console.error)
