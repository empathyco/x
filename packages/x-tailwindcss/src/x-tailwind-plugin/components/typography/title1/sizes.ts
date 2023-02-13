import { TailwindHelpers } from '../../../../types';

/**
 * Returns the `sizes` variants for component `title1`.
 *
 * @param helpers - The {@link TailwindHelpers} to generate CSS.
 * @returns The {@link CssStyleOptions} for the variant.
 */
export function titleSizes({ theme }: TailwindHelpers) {
  return {
    sm: {
      fontSize: theme('fontSize.xl'),
      lineHeight: theme('lineHeight.md')
    },
    md: {
      fontSize: theme('fontSize.2xl'),
      lineHeight: theme('lineHeight.sm')
    },
    lg: {
      fontSize: theme('fontSize.4xl')
    }
  };
}
