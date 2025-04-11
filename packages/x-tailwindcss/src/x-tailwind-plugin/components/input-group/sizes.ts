import type { TailwindHelpers } from '../../../types'
import { deepMerge } from '@empathyco/x-deep-merge'
import { inputSizes } from '../input/sizes'

/**
 * Returns the `sizes` variants for component `input-group`.
 *
 * @param helpers - The {@link TailwindHelpers} to generate CSS.
 * @returns The {@link CssStyleOptions} for the component.
 */
export function inputGroupSizes(helpers: TailwindHelpers) {
  const { theme } = helpers
  // eslint-disable-next-line ts/no-unsafe-return
  return deepMerge(inputSizes(helpers), {
    sm: {
      '--input-group-button-font-size': theme('x.fontSize.xs'),
      '--input-group-button-primary-font-size': theme('x.fontSize.sm'),
      '--input-group-button-rectangle-padding': theme('x.spacing.12'),
    },
    md: {
      '--input-group-button-font-size': theme('x.fontSize.sm'),
      '--input-group-button-primary-font-size': theme('x.fontSize.sm'),
      '--input-group-button-rectangle-padding': theme('x.spacing.16'),
    },
    lg: {
      '--input-group-button-font-size': theme('x.fontSize.sm'),
      '--input-group-button-primary-font-size': theme('x.fontSize.md'),
      '--input-group-button-rectangle-padding': theme('x.spacing.20'),
    },
  })
}
