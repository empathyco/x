import { TailwindHelpers } from '../../../types';

/**
 * Returns the `sizes` variants for component `input`.
 *
 * @param helpers - The {@link TailwindHelpers} to generate CSS.
 * @returns The {@link CssStyleOptions} for the variant.
 */
// eslint-disable-next-line  @typescript-eslint/explicit-function-return-type
export function inputSizes({ theme }: TailwindHelpers) {
  return {
    sm: {
      minHeight: theme('spacing.32'),
      fontSize: theme('fontSize.xs')
    },
    md: {
      minHeight: theme('spacing.40'),
      fontSize: theme('fontSize.sm')
    },
    lg: {
      minHeight: theme('spacing.48'),
      fontSize: theme('fontSize.md')
    }
  };
}
