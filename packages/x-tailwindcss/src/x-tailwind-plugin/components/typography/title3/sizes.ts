import { TailwindHelpers } from '../../../../types';

/**
 * Returns the `sizes` variants for component `title3`.
 *
 * @param helpers - The {@link TailwindHelpers} to generate CSS.
 * @returns The {@link CssStyleOptions} for the variant.
 */
// eslint-disable-next-line  @typescript-eslint/explicit-function-return-type
export function titleSizes({ theme }: TailwindHelpers) {
  return {
    sm: {
      fontSize: theme('fontSize.sm')
    },
    md: {
      fontSize: theme('fontSize.md'),
      lineHeight: theme('lineHeight.md')
    },
    lg: {
      fontSize: theme('fontSize.xl')
    }
  };
}
