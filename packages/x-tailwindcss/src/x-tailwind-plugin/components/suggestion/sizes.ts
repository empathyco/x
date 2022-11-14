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
    md: {
      paddingTop: theme('spacing.2'),
      paddingBottom: theme('spacing.2'),
      gap: theme('spacing.8'),
      fontSize: theme('fontSize.sm')
    },
    lg: {
      paddingTop: theme('spacing.4'),
      paddingBottom: theme('spacing.4'),
      gap: theme('spacing.16'),
      fontSize: theme('fontSize.md')
    }
  };
}
