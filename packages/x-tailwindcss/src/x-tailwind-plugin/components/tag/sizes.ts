import { TailwindHelpers } from '../../../types';

/**
 * Returns the `sizes` variants for component `tag`.
 *
 * @param helpers - The {@link TailwindHelpers} to generate CSS.
 * @returns The {@link CssStyleOptions} for the variant.
 */
export function tagSizes({ theme }: TailwindHelpers) {
  return {
    sm: {
      minHeight: theme('spacing.24'),
      fontSize: theme('fontSize.sm'),
      paddingInlineStart: theme('spacing.8'),
      paddingInlineEnd: theme('spacing.8')
    },
    md: {
      minHeight: theme('spacing.32'),
      fontSize: theme('fontSize.sm'),
      paddingInlineStart: theme('spacing.12'),
      paddingInlineEnd: theme('spacing.12')
    },
    lg: {
      minHeight: theme('spacing.40'),
      fontSize: theme('fontSize.md'),
      paddingInlineStart: theme('spacing.16'),
      paddingInlineEnd: theme('spacing.16')
    }
  };
}
