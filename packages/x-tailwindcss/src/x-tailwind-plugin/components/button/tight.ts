import type { TailwindHelpers } from '../../../types'
import { deepMerge } from '@empathyco/x-deep-merge'
import { noBackground } from './utils/no-background'
import { noHorizontalPadding } from './utils/no-horizontal-padding'

/**
 * Returns the `tight` variant for component `button`.
 *
 * @param helpers - The {@link TailwindHelpers} to generate CSS.
 * @returns The {@link CssStyleOptions} for the variant.
 */
export function buttonTight(helpers: TailwindHelpers) {
  const { theme } = helpers
  return {
    tight: deepMerge(noBackground(helpers), noHorizontalPadding(helpers), {
      '&.selected': {
        borderColor: 'transparent',
        backgroundColor: 'transparent',
        color: `var(--button-color-75,${theme('x.colors.neutral.100')})`,

        '&:hover,&:active': {
          borderColor: 'transparent',
          backgroundColor: 'transparent',
          color: `var(--button-color-50,${theme('x.colors.neutral.90')})`,
        },
      },
    }),
  }
}
