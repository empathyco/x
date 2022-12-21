import { TailwindHelpers } from '../../../types';

/**
 * Returns the `sizes` variants for component `suggestion group`.
 *
 * @param helpers - The {@link TailwindHelpers} to generate CSS.
 * @returns The {@link CssStyleOptions} for the variant.
 */
// eslint-disable-next-line  @typescript-eslint/explicit-function-return-type
export function suggestionGroupSizes(helpers: TailwindHelpers) {
  const { theme } = helpers;
  return {
    sm: {
      minHeight: theme('spacing.24'),
      fontSize: theme('fontSize.sm')
    },
    md: {
      minHeight: theme('spacing.32'),
      fontSize: theme('fontSize.sm')
    },
    lg: {
      minHeight: theme('spacing.48'),
      fontSize: theme('fontSize.md')
    }
  };
}
