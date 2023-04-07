import { TailwindHelpers } from '../../../types';

/**
 * Returns the `sizes` variants for component `facet-filter`.
 *
 * @param helpers - The {@link TailwindHelpers} to generate CSS.
 * @returns The {@link CssStyleOptions} for the variant.
 */
export function facetFilterSizes(helpers: TailwindHelpers) {
  const { theme } = helpers;

  return {
    sm: {
      minHeight: theme('spacing.24'),
      gap: theme('spacing.2'),
      fontSize: theme('fontSize.sm')
    },
    md: {
      minHeight: theme('spacing.32'),
      gap: theme('spacing.4'),
      fontSize: theme('fontSize.sm')
    },
    lg: {
      minHeight: theme('spacing.48'),
      gap: theme('spacing.12'),
      fontSize: theme('fontSize.md')
    }
  };
}
