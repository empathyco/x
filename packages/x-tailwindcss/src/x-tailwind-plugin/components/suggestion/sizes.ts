import { TailwindHelpers } from '../../../types';

/**
 * Returns the `sizes` variants for component `suggestion`.
 *
 * @param helpers - The {@link TailwindHelpers} to generate CSS.
 * @returns The {@link CssStyleOptions} for the variant.
 */
export function suggestionSizes({ theme }: TailwindHelpers) {
  return {
    sm: {
      minHeight: theme('x.spacing.24'),
      gap: theme('x.spacing.8'),
      fontSize: theme('x.fontSize.sm')
    },
    md: {
      minHeight: theme('x.spacing.32'),
      gap: theme('x.spacing.8'),
      fontSize: theme('x.fontSize.sm')
    },
    lg: {
      minHeight: theme('x.spacing.48'),
      gap: theme('x.spacing.24'),
      fontSize: theme('x.fontSize.md')
    }
  };
}
