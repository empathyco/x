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
      minHeight: theme('spacing.32'),
      gap: theme('spacing.8'),
      paddingInlineStart: theme('spacing.12'),
      paddingInlineEnd: theme('spacing.12'),
      fontSize: theme('fontSize.sm')
    },

    md: {
      minHeight: theme('spacing.40'),
      gap: theme('spacing.8'),
      paddingInlineStart: theme('spacing.16'),
      paddingInlineEnd: theme('spacing.16'),
      fontSize: theme('fontSize.sm')
    },

    lg: {
      minHeight: theme('spacing.48'),
      gap: theme('spacing.8'),
      paddingInlineStart: theme('spacing.20'),
      paddingInlineEnd: theme('spacing.20'),
      fontSize: theme('fontSize.md')
    },

    xl: {
      minHeight: theme('spacing.56'),
      gap: theme('spacing.8'),
      paddingInlineStart: theme('spacing.24'),
      paddingInlineEnd: theme('spacing.24'),
      fontSize: theme('fontSize.lg')
    }
  };
}
