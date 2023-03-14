import { TailwindHelpers } from '../../../types';

/**
 * Returns the `tight` styles for component `tag`.
 *
 * @param helpers - The {@link TailwindHelpers} to generate CSS.
 * @returns The {@link CssStyleOptions} for the variant.
 */
export function tagTight(helpers: TailwindHelpers) {
  const { theme } = helpers;

  // Tight & Tight Selected common styles
  const disabledStyles = {
    '&:disabled': {
      borderColor: 'transparent',
      color: theme('colors.neutral.25'),
      fontWeight: theme('fontWeight.regular')
    }
  };
  const hoverStyles = {
    '&:hover,&:focus,&:active': {
      borderColor: 'transparent',
      color: `var(--tag-color-50, ${theme('colors.neutral.50')})`
    }
  };

  return {
    tight: {
      borderColor: 'transparent',
      color: `var(--tag-color-75, ${theme('colors.neutral.90')})`,
      paddingInlineStart: theme('spacing.0'),
      paddingInlineEnd: theme('spacing.0'),

      ...hoverStyles,
      ...disabledStyles,

      '&.selected': {
        borderColor: 'transparent',
        color: `var(--tag-color-75, ${theme('colors.neutral.90')})`,
        fontWeight: theme('fontWeight.bold'),

        ...hoverStyles,
        ...disabledStyles
      }
    }
  };
}
