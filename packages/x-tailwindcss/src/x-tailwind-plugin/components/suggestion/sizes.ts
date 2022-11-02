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
      minHeight: theme('spacing.24'),
      paddingInlineStart: 0,
      paddingInlineEnd: 0,
      gap: theme('spacing.8'),
      fontSize: theme('fontSize.sm'),
      fontWeight: theme('fontWeight.regular'),
      lineHeight: theme('lineHeight.md'),
      letterSpacing: theme('letterSpacing.md')
    },
    lg: {
      minHeight: theme('spacing.48'),
      paddingInlineStart: 0,
      paddingInlineEnd: 0,
      gap: theme('spacing.12'),
      fontSize: theme('fontSize.md'),
      fontWeight: theme('fontWeight.regular'),
      lineHeight: theme('lineHeight.md'),
      letterSpacing: theme('letterSpacing.md')
    }
  };
}
