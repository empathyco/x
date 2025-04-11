import type { TailwindHelpers } from '../../../types'

/**
 * Returns the `disabled` state for component `button`.
 *
 * @param helpers - The {@link TailwindHelpers} to generate CSS.
 * @returns The {@link CssStyleOptions} for the state.
 */

export function buttonDisabled(helpers: TailwindHelpers) {
  const { theme } = helpers

  // Disabled common styles
  const disabledStyles = {
    borderColor: `var(--button-disabled-border-color,${theme('x.colors.neutral.10')})`,
    backgroundColor: `var(--button-disabled-background-color,${theme('x.colors.neutral.10')})`,
    color: theme('x.colors.neutral.25'),
  }

  return {
    '&:disabled': {
      cursor: 'not-allowed',
      ...disabledStyles,

      '&.selected': {
        ...disabledStyles,
      },
    },
  }
}
