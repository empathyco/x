import type { TailwindHelpers } from '../../../../types';

/**
 * Returns the `sizes` variants for component `text1`.
 *
 * @param helpers - The {@link TailwindHelpers} to generate CSS.
 * @returns The {@link CssStyleOptions} for the variant.
 */
export function textSizes({ theme }: TailwindHelpers) {
  return {
    sm: {
      fontSize: theme('x.fontSize.xs'),
      lineHeight: theme('x.lineHeight.lg')
    },
    md: {
      fontSize: theme('x.fontSize.sm'),
      lineHeight: theme('x.lineHeight.md')
    },
    lg: {
      fontSize: theme('x.fontSize.md')
    }
  };
}
