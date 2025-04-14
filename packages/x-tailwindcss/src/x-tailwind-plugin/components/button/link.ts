import type { TailwindHelpers } from '../../../types'
import { noBackground } from './utils/no-background'
import { noHorizontalPadding } from './utils/no-horizontal-padding'

/**
 * Returns the `link` variant for component `button`.
 *
 * @param helpers - The {@link TailwindHelpers} to generate CSS.
 * @returns The {@link CssStyleOptions} for the variant.
 */
export function buttonLink(helpers: TailwindHelpers) {
  const { theme } = helpers
  return {
    link: {
      display: 'inline-flex',
      minHeight: '0',
      textDecoration: 'underline',
      fontFamily: 'inherit',
      fontSize: 'inherit',
      lineHeight: 'inherit',
      fontWeight: 'inherit',
      letterSpacing: 'inherit',
      ...noHorizontalPadding(helpers),
      ...noBackground(helpers),

      '&.selected': {
        borderColor: 'transparent',
        backgroundColor: 'transparent',
        color: `var(--button-color-75,${theme('x.colors.neutral.100')})`,
        fontWeight: theme('x.fontWeight.bold'),

        '&:hover,&:active': {
          borderColor: 'transparent',
          backgroundColor: 'transparent',
          color: `var(--button-color-50,${theme('x.colors.neutral.90')})`,
        },

        '&:disabled': {
          fontWeight: 'inherit',
        },
      },
    },
  }
}
