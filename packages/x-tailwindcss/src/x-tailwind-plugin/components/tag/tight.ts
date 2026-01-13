import type { TailwindHelpers } from '../../../types'

/**
 * Returns the `tight` styles for component `tag`.
 *
 * @param helpers - The {@link TailwindHelpers} to generate CSS.
 * @returns The {@link CssStyleOptions} for the variant.
 */
export function tagTight(helpers: TailwindHelpers) {
  const { theme } = helpers

  // Tight & Tight Selected common styles
  const disabledStyles = {
    '&:disabled': {
      borderColor: 'transparent',
      color: theme('x.colors.neutral.25'),
      fontWeight: theme('x.fontWeight.regular'),
    },
  }
  const hoverStyles = {
    '&:hover,&:focus,&:active': {
      borderColor: 'transparent',
      color: `var(--tag-color-50, ${theme('x.colors.neutral.50')})`,
    },
  }

  return {
    tight: {
      borderColor: 'transparent',
      color: `var(--tag-color-75, ${theme('x.colors.neutral.90')})`,
      paddingInlineStart: theme('x.spacing.0'),
      paddingInlineEnd: theme('x.spacing.0'),

      ...hoverStyles,
      ...disabledStyles,

      '&.selected': {
        borderColor: 'transparent',
        color: `var(--tag-color-75, ${theme('x.colors.neutral.90')})`,
        fontWeight: theme('x.fontWeight.bold'),

        ...hoverStyles,
        ...disabledStyles,
      },
    },
  }
}
