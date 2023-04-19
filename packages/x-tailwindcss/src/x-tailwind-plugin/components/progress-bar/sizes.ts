import { TailwindHelpers } from '../../../types';

/**
 * Returns the `sizes` variants for component `progress-bar`.
 *
 * @param helpers - The {@link TailwindHelpers} to generate CSS.
 * @returns The {@link CssStyleOptions} for the variant.
 */
export function progressBarSizes({ theme }: TailwindHelpers) {
  return {
    md: {
      height: theme('spacing.4')
    },
    lg: {
      height: theme('spacing.8')
    }
  };
}
