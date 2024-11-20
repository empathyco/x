import { TailwindHelpers } from '../../../../types';

/**
 * Util to return paddings for each size for variants with horizontal padding.
 *
 * @param helpers - The {@link TailwindHelpers} to generate CSS.
 * @returns The {@link CssStyleOptions} for the util.
 */
export function paddingBySize(helpers: TailwindHelpers) {
  const { theme } = helpers;
  return {
    sm: {
      paddingInlineStart: theme('x.spacing.8'),
      paddingInlineEnd: theme('x.spacing.8')
    },

    md: {
      paddingInlineStart: theme('x.spacing.8'),
      paddingInlineEnd: theme('x.spacing.8')
    },

    lg: {
      paddingInlineStart: theme('x.spacing.12'),
      paddingInlineEnd: theme('x.spacing.12')
    }
  };
}
