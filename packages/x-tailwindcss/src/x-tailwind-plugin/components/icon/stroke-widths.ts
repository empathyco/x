import type { TailwindHelpers } from '../../../types'
import { map, rename } from '@empathyco/x-utils'

/**
 * Returns the `stroke-width` variants for component `icon`.
 *
 * @param helpers - The {@link TailwindHelpers} to generate CSS.
 * @returns The {@link CssStyleOptions} for the component.
 */
export function iconStrokeWidths({ theme }: TailwindHelpers) {
  return {
    'stroke-width': rename(
      map(theme('x.strokeWidth'), (width, value) => ({
        '*': { strokeWidth: value },
      })),
      { prefix: '&.x-icon-stroke-width-' },
    ),
  }
}
