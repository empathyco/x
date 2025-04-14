import type { TailwindHelpers } from '../../../../types'

/**
 * Returns the `rectangle` variant for component `suggestion group button`.
 *
 * @param helpers - The {@link TailwindHelpers} to generate CSS.
 * @returns The {@link CssStyleOptions} for the variant.
 */
export function suggestionGroupButtonRectangle(helpers: TailwindHelpers) {
  const { theme } = helpers
  return {
    rectangle: {
      paddingInlineStart: theme('x.spacing.8'),
      paddingInlineEnd: theme('x.spacing.8'),
      aspectRatio: 'unset',
    },
  }
}
