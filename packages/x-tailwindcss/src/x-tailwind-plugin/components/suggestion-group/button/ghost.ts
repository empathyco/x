import type { TailwindHelpers } from '../../../../types'

/**
 * Returns the `ghost` variant for component `suggestion group button`.
 *
 * @param helpers - The {@link TailwindHelpers} to generate CSS.
 * @returns The {@link CssStyleOptions} for the variant.
 */
export function suggestionGroupButtonGhost(helpers: TailwindHelpers) {
  const { theme } = helpers
  return {
    ghost: {
      '&:hover': {
        backgroundColor: theme('x.colors.neutral.25'),
        transform: 'none',
      },
    },
  }
}
