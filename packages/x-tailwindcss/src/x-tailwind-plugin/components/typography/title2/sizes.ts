import { TailwindHelpers } from '../../../../types';

/**
 * Returns the `sizes` variants for component `title2`.
 *
 * @param helpers - The {@link TailwindHelpers} to generate CSS.
 * @returns The {@link CssStyleOptions} for the variant.
 */
export function titleSizes({ theme }: TailwindHelpers) {
  return {
    sm: {
      fontSize: theme('x.fontSize.lg')
    },
    md: {
      fontSize: theme('x.fontSize.xl'),
      lineHeight: theme('x.lineHeight.md')
    },
    lg: {
      fontSize: theme('x.fontSize.3xl'),
      lineHeight: theme('x.lineHeight.sm')
    }
  };
}
