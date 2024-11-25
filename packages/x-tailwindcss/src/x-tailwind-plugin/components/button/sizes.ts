import { TailwindHelpers } from '../../../types';

/**
 * Returns the `sizes` variants for component `button`.
 *
 * @param helpers - The {@link TailwindHelpers} to generate CSS.
 * @returns The {@link CssStyleOptions} for the variant.
 */
export function buttonSizes({ theme }: TailwindHelpers) {
  return {
    sm: {
      minHeight: theme('x.spacing.32'),
      gap: theme('x.spacing.8'),
      paddingInlineStart: theme('x.spacing.12'),
      paddingInlineEnd: theme('x.spacing.12'),
      fontSize: theme('x.fontSize.sm')
    },

    md: {
      minHeight: theme('x.spacing.40'),
      gap: theme('x.spacing.8'),
      paddingInlineStart: theme('x.spacing.16'),
      paddingInlineEnd: theme('x.spacing.16'),
      fontSize: theme('x.fontSize.sm')
    },

    lg: {
      minHeight: theme('x.spacing.48'),
      gap: theme('x.spacing.8'),
      paddingInlineStart: theme('x.spacing.20'),
      paddingInlineEnd: theme('x.spacing.20'),
      fontSize: theme('x.fontSize.md')
    },

    xl: {
      minHeight: theme('x.spacing.56'),
      gap: theme('x.spacing.8'),
      paddingInlineStart: theme('x.spacing.24'),
      paddingInlineEnd: theme('x.spacing.24'),
      fontSize: theme('x.fontSize.lg')
    }
  };
}
