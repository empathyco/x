import type { OutputOptions } from 'rollup'
import { rollup } from 'rollup'
import { cssDeprecatedRollupConfig, rollupConfig } from './rollup.config'

/**
 * Entry point for building the project.
 */
async function build() {
  const bundle = await rollup(rollupConfig)
  await bundle.write(rollupConfig.output as OutputOptions)

  const bundleCssDeprecatedComponents = await rollup(cssDeprecatedRollupConfig)
  await bundleCssDeprecatedComponents.write(cssDeprecatedRollupConfig.output as OutputOptions)
}

build().catch(console.error)
