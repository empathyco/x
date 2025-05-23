import type { TailwindHelpers } from '../../../types'

/**
 * Returns the `bright` variant for component `badge`.
 *
 * @param helpers - The {@link TailwindHelpers} to generate CSS.
 * @returns The {@link CssStyleOptions} for the variant.
 */
export function badgeBright(helpers: TailwindHelpers) {
  const { theme } = helpers

  return {
    bright: {
      backgroundColor: 'transparent',

      borderWidth: theme('x.spacing.1'),
      borderColor: `var(--badge-color-25, ${theme('x.colors.neutral.0')})`,
    },
  }
}
