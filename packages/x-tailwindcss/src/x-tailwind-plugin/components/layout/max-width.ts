import type { TailwindHelpers } from '../../../types'
import { map, rename } from '@empathyco/x-utils'

/**
 * Returns the `max width` variants of component `layout`.
 *
 * @param helpers - The {@link TailwindHelpers} to generate CSS.
 * @returns The {@link CssStyleOptions} for the component.
 */
export function maxWidth(helpers: TailwindHelpers) {
  const { theme } = helpers
  return {
    'max-width': rename(
      map(theme('x.layoutMaxWidth'), (maxWidthName, maxWidthValue) => ({
        '--x-layout-max-width': maxWidthValue,
      })),
      { prefix: '&-' },
    ),
  }
}
