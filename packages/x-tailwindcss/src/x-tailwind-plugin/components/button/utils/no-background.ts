import type { TailwindHelpers } from '../../../../types'

/**
 * Util to remove background for component `button`.
 *
 * @param helpers - The {@link TailwindHelpers} to generate CSS.
 * @returns The {@link CssStyleOptions} for the util.
 */
export function noBackground(helpers: TailwindHelpers) {
  const { theme } = helpers
  return {
    // Disabled style
    '--button-disabled-border-color': 'transparent',
    '--button-disabled-background-color': 'transparent',

    borderColor: 'transparent',
    backgroundColor: 'transparent',
    color: `var(--button-color-50,${theme('x.colors.neutral.90')})`,

    '&:hover': {
      borderColor: 'transparent',
      backgroundColor: 'transparent',
      color: `var(--button-color-75,${theme('x.colors.neutral.100')})`,
    },

    '&:active': {
      borderColor: 'transparent',
      backgroundColor: 'transparent',
      color: `var(--button-color-75,${theme('x.colors.neutral.100')})`,
    },
  }
}
