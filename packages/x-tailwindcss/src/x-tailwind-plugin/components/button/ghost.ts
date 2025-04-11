import type { TailwindHelpers } from '../../../types'
import { deepMerge } from '@empathyco/x-deep-merge'
import { backgroundOnHover } from './utils/background-on-hover'
import { noBackground } from './utils/no-background'

/**
 * Returns the `ghost` variant for component `button`.
 *
 * @param helpers - The {@link TailwindHelpers} to generate CSS.
 * @returns The {@link CssStyleOptions} for the variant.
 */
export function buttonGhost(helpers: TailwindHelpers) {
  const { theme } = helpers
  return {
    ghost: deepMerge(noBackground(helpers), backgroundOnHover(helpers), {
      '&.selected': {
        borderColor: theme('x.colors.neutral.10'),
        backgroundColor: theme('x.colors.neutral.10'),
        color: `var(--button-color-75,${theme('x.colors.neutral.90')})`,

        '&:hover,&:active': {
          borderColor: theme('x.colors.neutral.25'),
          backgroundColor: theme('x.colors.neutral.25'),
        },
      },
    }),
  }
}
