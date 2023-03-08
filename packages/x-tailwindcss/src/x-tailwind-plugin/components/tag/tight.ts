import { TailwindHelpers } from '../../../types';

/**
 * Returns the `tight` styles for component `tag`.
 *
 * @param helpers - The {@link TailwindHelpers} to generate CSS.
 * @returns The {@link CssStyleOptions} for the variant.
 */
export function tagTight(helpers: TailwindHelpers) {
  const { theme } = helpers;
  return {
    tight: {
      borderColor: 'transparent',
      color: `var(--tag-color-75, ${theme('colors.neutral.90')})`,
      paddingInlineStart: theme('spacing.0'),
      paddingInlineEnd: theme('spacing.0'),

      '&:hover,&:focus,&:active': {
        borderColor: 'transparent',
        color: `var(--tag-color-50, ${theme('colors.neutral.50')})`
      },

      '&:disabled': {
        borderColor: 'transparent',
        color: theme('colors.neutral.25')
      },

      '&:not(:disabled).selected': {
        borderColor: 'transparent',
        fontWeight: theme('fontWeight.bold'),

        '&:hover,&:focus,&:active': {
          borderColor: 'transparent',
          color: `var(--tag-color-50, ${theme('colors.neutral.50')})`
        }
      }
    }
  };
}
