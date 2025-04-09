import type { TailwindHelpers } from '../../../types';

/**
 * Returns the `sizes` variants for component `icon`.
 *
 * @param helpers - The {@link TailwindHelpers} to generate CSS.
 * @returns The {@link CssStyleOptions} for the variant.
 */
export function iconSizes({ theme }: TailwindHelpers) {
  return {
    sm: {
      height: theme('x.spacing.8'),
      '--fontSize': '7px'
    },

    md: {
      height: theme('x.spacing.16'),
      '--fontSize': '14px'
    },

    lg: {
      height: theme('x.spacing.24'),
      '--fontSize': '20px'
    },

    xl: {
      height: theme('x.spacing.32'),
      '--fontSize': '28px'
    }
  };
}
