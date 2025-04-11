import type { TailwindHelpers } from '../../../../types'

/**
 * Util to add background on hover for component `button`.
 *
 * @param helpers - The {@link TailwindHelpers} to generate CSS.
 * @returns The {@link CssStyleOptions} for the util.
 */
export function backgroundOnHover(helpers: TailwindHelpers) {
  const { theme } = helpers
  return {
    '&:hover': {
      borderColor: theme('x.colors.neutral.10'),
      backgroundColor: theme('x.colors.neutral.10'),
    },
  }
}
