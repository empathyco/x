import { TailwindHelpers } from '../../../types';

/**
 * Returns the `solid` styles for component `tag`.
 *
 * @param helpers - The {@link TailwindHelpers} to generate CSS.
 * @returns The {@link CssStyleOptions} for the component.
 */
export function tagSolid(helpers: TailwindHelpers) {
  const { theme } = helpers;
  return {
    solid: {
      backgroundColor: `var(--tag-color-25, ${theme('colors.neutral.10')})`,
      borderWidth: 0,
      color: theme('colors.neutral.75'),

      '&:hover,&:focus,&:active': {
        backgroundColor: `var(--tag-color-25, ${theme('colors.neutral.25')})`,
        color: `var(--tag-color-75, ${theme('colors.neutral.75')})`
      },

      '&:disabled': {
        backgroundColor: theme('colors.neutral.10'),
        color: theme('colors.neutral.25')
      },

      '&:not(:disabled).selected': {
        backgroundColor: `var(--tag-color-75, ${theme('colors.neutral.90')})`,
        borderColor: `var(--tag-color-75, ${theme('colors.neutral.90')})`,
        color: theme('colors.neutral.0'),

        '&:hover,&:focus,&:active': {
          backgroundColor: `var(--tag-color-50, ${theme('colors.neutral.50')})`,
          borderColor: `var(--tag-color-50, ${theme('colors.neutral.50')})`
        }
      }
    }
  };
}
