import type { TailwindHelpers } from '../../../types'
import { commonGhostAndTagStyles } from './utils/common-ghost-and-tag-styles'

/**
 * Returns the `tag` variant for component `suggestion`.
 *
 * @param helpers - The {@link TailwindHelpers} to generate CSS.
 * @returns The {@link CssStyleOptions} for the variant.
 */
export function suggestionOutlined(helpers: TailwindHelpers) {
  const { theme } = helpers
  return {
    outlined: {
      backgroundColor: theme('x.colors.neutral.0'),
      borderWidth: theme('x.borderWidth.1'),
      borderColor: 'currentColor',
      ...commonGhostAndTagStyles(helpers),
    },
  }
}
