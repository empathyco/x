import { TailwindHelpers } from '../../../types';

/**
 * Returns the `ghost` styles for component `tag`.
 *
 * @param helpers - The {@link TailwindHelpers} to generate CSS.
 * @returns The {@link CssStyleOptions} for the variant.
 */
export function tagGhost(helpers: TailwindHelpers) {
  const { theme } = helpers;

  // Ghost & Ghost Selected common styles
  const disabledStyles = {
    '&:disabled': {
      backgroundColor: 'transparent',
      borderColor: 'transparent',
      color: theme('colors.neutral.25'),
      fontWeight: theme('fontWeight.regular')
    }
  };

  return {
    ghost: {
      backgroundColor: 'transparent',
      borderColor: 'transparent',
      color: `var(--tag-color-75, ${theme('colors.neutral.50')})`,

      '&:hover,&:focus,&:active': {
        backgroundColor: theme('colors.neutral.10'),
        borderColor: theme('colors.neutral.10'),
        color: `var(--tag-color-75, ${theme('colors.neutral.90')})`
      },

      ...disabledStyles,

      '&.selected': {
        borderColor: 'transparent',
        color: `var(--tag-color-75, ${theme('colors.neutral.90')})`,
        fontWeight: theme('fontWeight.bold'),

        '&:hover,&:focus,&:active': {
          borderColor: theme('colors.neutral.10')
        },

        ...disabledStyles
      }
    }
  };
}
