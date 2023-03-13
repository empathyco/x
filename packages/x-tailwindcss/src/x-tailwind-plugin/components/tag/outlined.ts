import { TailwindHelpers } from '../../../types';

/**
 * Returns the `outlined` styles for component `tag`.
 *
 * @param helpers - The {@link TailwindHelpers} to generate CSS.
 * @returns The {@link CssStyleOptions} for the component.
 */
export function tagOutlined(helpers: TailwindHelpers) {
  const { theme } = helpers;

  // Outlined & Outlined Selected common styles
  const disabledStyles = {
    '&:disabled': {
      backgroundColor: 'transparent',
      borderColor: theme('colors.neutral.25'),
      color: theme('colors.neutral.25')
    }
  };
  const hoverStyles = {
    '&:hover,&:focus,&:active': {
      borderColor: `var(--tag-color-75, ${theme('colors.neutral.75')})`,
      color: `var(--tag-color-75, ${theme('colors.neutral.75')})`
    }
  };

  return {
    outlined: {
      backgroundColor: 'transparent',
      borderColor: `var(--tag-color-50, ${theme('colors.neutral.50')})`,
      color: `var(--tag-color-neutral-75, ${theme('colors.neutral.50')})`,

      ...hoverStyles,
      ...disabledStyles,

      '&.selected': {
        backgroundColor: `var(--tag-color-25, ${theme('colors.neutral.10')})`,
        borderColor: `var(--tag-color-75, ${theme('colors.neutral.75')})`,
        borderWidth: theme('spacing.1'),
        color: theme('colors.neutral.90'),

        ...hoverStyles,
        ...disabledStyles
      }
    }
  };
}
