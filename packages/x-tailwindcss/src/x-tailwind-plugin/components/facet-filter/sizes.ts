import type { TailwindHelpers } from '../../../types';

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
      minHeight: theme('x.spacing.24'),
      gap: theme('x.spacing.2'),
      fontSize: theme('x.fontSize.sm')
    },
    md: {
      minHeight: theme('x.spacing.32'),
      gap: theme('x.spacing.4'),
      fontSize: theme('x.fontSize.sm')
    },
    lg: {
      minHeight: theme('x.spacing.48'),
      gap: theme('x.spacing.12'),
      fontSize: theme('x.fontSize.md')
    }
  };
}
