import { TailwindHelpers } from '../../../../types';

/**
 * Returns the `sizes` variants for component `title4`.
 *
 * @param helpers - The {@link TailwindHelpers} to generate CSS.
 * @returns The {@link CssStyleOptions} for the variant.
 */
export function titleSizes({ theme }: TailwindHelpers) {
  return {
    sm: {
      fontSize: theme('fontSize.xs')
    },
    md: {
      fontSize: theme('fontSize.sm'),
      lineHeight: theme('lineHeight.md')
    },
    lg: {
      fontSize: theme('fontSize.lg')
    }
  };
}
