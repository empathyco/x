import type { TailwindHelpers } from '../../../../types';

/**
 * Returns the `sizes` variants for component `title4`.
 *
 * @param helpers - The {@link TailwindHelpers} to generate CSS.
 * @returns The {@link CssStyleOptions} for the variant.
 */
export function titleSizes({ theme }: TailwindHelpers) {
  return {
    sm: {
      fontSize: theme('x.fontSize.xs')
    },
    md: {
      fontSize: theme('x.fontSize.sm'),
      lineHeight: theme('x.lineHeight.md')
    },
    lg: {
      fontSize: theme('x.fontSize.lg')
    }
  };
}
