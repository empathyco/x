import type { TailwindHelpers } from '../../../types'

/**
 * Returns the default styles for component `highlight`.
 *
 * @param helpers - The {@link TailwindHelpers} to generate CSS.
 * @returns The {@link CssStyleOptions} for the component.
 */
export function highlightDefault(helpers: TailwindHelpers) {
  const { theme } = helpers
  return {
    fontWeight: theme('x.fontWeight.bold'),
    '& > .highlight-text-match': {
      fontWeight: theme('x.fontWeight.regular'),
    },
  }
}
