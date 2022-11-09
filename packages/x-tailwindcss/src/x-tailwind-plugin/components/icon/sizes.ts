import { TailwindHelpers } from '../../../types';

/**
 * Returns the `sizes` variants for component `button`.
 *
 * @param helpers - The {@link TailwindHelpers} to generate CSS.
 * @returns The {@link CssStyleOptions} for the variant.
 */
// eslint-disable-next-line  @typescript-eslint/explicit-function-return-type
export function iconSizes({ theme }: TailwindHelpers) {
  return {
    sm: {
      height: theme('spacing.8'),
      fontSize: '7px'
    },

    md: {
      height: theme('spacing.16'),
      fontSize: '14px'
    },

    lg: {
      height: theme('spacing.24'),
      fontSize: '20px'
    },

    xl: {
      height: theme('spacing.32'),
      fontSize: '28px'
    }
  };
}
