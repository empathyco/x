import type { TailwindHelpers } from '../../../types'

/**
 * Returns the `circle` variant for component `badge`.
 *
 * @param helpers - The {@link TailwindHelpers} to generate CSS.
 * @returns The {@link CssStyleOptions} for the variant.
 */
export function badgeCircle({ theme }: TailwindHelpers) {
  return {
    circle: {
      '--attach-horizontal-offset': '50%',

      overflow: 'hidden',
      whiteSpace: 'nowrap',
      padding: '0',
      width: theme('x.spacing.24'),

      '&.badge-sm': {
        width: theme('x.spacing.20'),
      },
      '&.badge-md': {
        width: theme('x.spacing.24'),
      },
    },
  }
}
