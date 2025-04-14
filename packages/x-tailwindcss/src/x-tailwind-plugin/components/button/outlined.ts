import type { TailwindHelpers } from '../../../types'

/**
 * Returns the `outlined` variant for component `button`.
 *
 * @param helpers - The {@link TailwindHelpers} to generate CSS.
 * @returns The {@link CssStyleOptions} for the variant.
 */
export function buttonOutlined(helpers: TailwindHelpers) {
  const { theme } = helpers
  return {
    outlined: {
      // Disabled style
      '--button-disabled-border-color': theme('x.colors.neutral.25'),

      borderColor: `var(--button-color-50,${theme('x.colors.neutral.90')})`,
      backgroundColor: theme('x.colors.neutral.0'),
      color: `var(--button-color-50,${theme('x.colors.neutral.90')})`,

      '&:hover,&:active': {
        borderColor: `var(--button-color-50,${theme('x.colors.neutral.90')})`,
        backgroundColor: `var(--button-color-50,${theme('x.colors.neutral.90')})`,
        color: theme('x.colors.neutral.0'),
      },

      '&.selected': {
        borderColor: `var(--button-color-50,${theme('x.colors.neutral.90')})`,
        backgroundColor: `var(--button-color-50,${theme('x.colors.neutral.90')})`,
        color: theme('x.colors.neutral.0'),

        '&:hover,&:active': {
          backgroundColor: theme('x.colors.neutral.0'),
          color: `var(--button-color-50,${theme('x.colors.neutral.90')})`,
        },
      },
    },
  }
}
