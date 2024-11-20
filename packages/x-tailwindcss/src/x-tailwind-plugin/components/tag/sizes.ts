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
      minHeight: theme('x.spacing.24'),
      fontSize: theme('x.fontSize.sm'),
      paddingInlineStart: theme('x.spacing.8'),
      paddingInlineEnd: theme('x.spacing.8')
    },
    md: {
      minHeight: theme('x.spacing.32'),
      fontSize: theme('x.fontSize.sm'),
      paddingInlineStart: theme('x.spacing.12'),
      paddingInlineEnd: theme('x.spacing.12')
    },
    lg: {
      minHeight: theme('x.spacing.40'),
      fontSize: theme('x.fontSize.md'),
      paddingInlineStart: theme('x.spacing.16'),
      paddingInlineEnd: theme('x.spacing.16')
    }
  };
}
