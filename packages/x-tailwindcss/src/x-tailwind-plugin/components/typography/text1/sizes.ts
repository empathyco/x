import { TailwindHelpers } from '../../../../types';

/**
 * Returns the `sizes` variants for component `text1`.
 *
 * @param helpers - The {@link TailwindHelpers} to generate CSS.
 * @returns The {@link CssStyleOptions} for the variant.
 */
export function textSizes({ theme }: TailwindHelpers) {
  return {
    sm: {
      fontSize: theme('fontSize.xs'),
      lineHeight: theme('lineHeight.lg')
    },
    md: {
      fontSize: theme('fontSize.sm'),
      lineHeight: theme('lineHeight.md')
    },
    lg: {
      fontSize: theme('fontSize.md')
    }
  };
}
