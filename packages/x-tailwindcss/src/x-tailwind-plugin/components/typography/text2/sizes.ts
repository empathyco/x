import { TailwindHelpers } from '../../../../types';

/**
 * Returns the `sizes` variants for component `text2`.
 *
 * @param helpers - The {@link TailwindHelpers} to generate CSS.
 * @returns The {@link CssStyleOptions} for the variant.
 */
// eslint-disable-next-line  @typescript-eslint/explicit-function-return-type
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
