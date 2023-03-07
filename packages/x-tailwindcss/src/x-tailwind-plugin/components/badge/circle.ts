import { TailwindHelpers } from '../../../types';

/**
 * Returns the `circle` variant for component `badge`.
 *
 * @param helpers - The {@link TailwindHelpers} to generate CSS.
 * @returns The {@link CssStyleOptions} for the variant.
 */
export function badgeCircle({ theme }: TailwindHelpers) {
  return {
    circle: {
      overflow: 'hidden',
      whiteSpace: 'nowrap',
      padding: '0',

      '&.badge-sm': {
        width: theme('spacing.20')
      },
      '&.badge-md': {
        width: theme('spacing.24')
      }
    }
  };
}
