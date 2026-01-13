import type { TailwindHelpers } from '../../../types'
import { map, rename } from '@empathyco/x-utils'

/**
 * Returns the `min-margin` variants of component `layout`.
 *
 * @param helpers - The {@link TailwindHelpers} to generate CSS.
 * @returns The {@link CssStyleOptions} for the component.
 */
export function minMargin(helpers: TailwindHelpers) {
  const { theme } = helpers
  return {
    ...rename(
      map(theme('x.spacing'), (spacingName, spacingValue) => ({
        '--x-layout-min-margin': spacingValue,
      })),
      { prefix: '.layout-min-margin-' },
    ),
  }
}
