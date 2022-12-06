import { TailwindHelpers } from '../../../types';

/**
 * Returns the `sizes` variants for component `suggestion`.
 *
 * @param helpers - The {@link TailwindHelpers} to generate CSS.
 * @returns The {@link CssStyleOptions} for the variant.
 */
// eslint-disable-next-line  @typescript-eslint/explicit-function-return-type
export function suggestionSizes({ theme }: TailwindHelpers) {
  return {
    sm: {
      minHeight: theme('spacing.24'),
      gap: theme('spacing.8'),
      fontSize: theme('fontSize.sm')
    },
    md: {
      minHeight: theme('spacing.32'),
      gap: theme('spacing.8'),
      fontSize: theme('fontSize.sm')
    },
    lg: {
      minHeight: theme('spacing.48'),
      gap: theme('spacing.12'),
      fontSize: theme('fontSize.md')
    }
  };
}
