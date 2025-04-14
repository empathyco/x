import type { TailwindHelpers } from '../../../types'

/**
 * Returns the `solid` styles for component `tag`.
 *
 * @param helpers - The {@link TailwindHelpers} to generate CSS.
 * @returns The {@link CssStyleOptions} for the component.
 */
export function tagSolid(helpers: TailwindHelpers) {
  const { theme } = helpers

  // Solid & Solid Selected common styles
  const disabledStyles = {
    '&:disabled': {
      backgroundColor: theme('x.colors.neutral.10'),
      borderColor: theme('x.colors.neutral.10'),
      color: theme('x.colors.neutral.25'),
    },
  }

  return {
    solid: {
      backgroundColor: `var(--tag-color-25, ${theme('x.colors.neutral.10')})`,
      borderColor: `var(--tag-color-25, ${theme('x.colors.neutral.10')})`,
      color: theme('x.colors.neutral.75'),

      '&:hover,&:focus,&:active': {
        backgroundColor: `var(--tag-color-25, ${theme('x.colors.neutral.25')})`,
        borderColor: `var(--tag-color-25, ${theme('x.colors.neutral.25')})`,
        color: `var(--tag-color-75, ${theme('x.colors.neutral.75')})`,
      },

      ...disabledStyles,

      '&.selected': {
        backgroundColor: `var(--tag-color-75, ${theme('x.colors.neutral.90')})`,
        borderColor: `var(--tag-color-75, ${theme('x.colors.neutral.90')})`,
        color: theme('x.colors.neutral.0'),

        '&:hover,&:focus,&:active': {
          backgroundColor: `var(--tag-color-50, ${theme('x.colors.neutral.50')})`,
          borderColor: `var(--tag-color-50, ${theme('x.colors.neutral.50')})`,
        },

        ...disabledStyles,
      },
    },
  }
}
