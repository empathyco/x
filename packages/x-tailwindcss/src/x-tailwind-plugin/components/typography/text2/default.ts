import type { TailwindHelpers } from '../../../../types'
import { textSizes } from '../text2/sizes'

/**
 * Returns the default styles for component `text2`.
 *
 * @param helpers - The {@link TailwindHelpers} to generate CSS.
 * @returns The {@link CssStyleOptions} for the component.
 */
export function textDefault(helpers: TailwindHelpers) {
  const { theme } = helpers
  return {
    fontFamily: theme('x.fontFamily.main'),
    fontWeight: theme('x.fontWeight.regular'),

    ...textSizes(helpers).md,
  }
}
