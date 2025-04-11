import type { TailwindHelpers } from '../../../types'

/**
 * Returns the `layout` variants for component `button`.
 *
 * @param helpers - The {@link TailwindHelpers} to generate CSS.
 * @returns The {@link CssStyleOptions} for the variant.
 */
export function buttonLayouts({ theme }: TailwindHelpers) {
  return {
    square: {
      aspectRatio: '1/1',
      paddingInlineStart: 0,
      paddingInlineEnd: 0,
    },

    circle: {
      aspectRatio: '1/1',
      paddingInlineStart: 0,
      paddingInlineEnd: 0,
      borderRadius: theme('x.borderRadius.full'),
    },
  }
}
