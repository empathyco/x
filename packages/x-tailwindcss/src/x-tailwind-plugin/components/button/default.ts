import type { TailwindHelpers } from '../../../types'
import { buttonSizes } from './sizes'

/**
 * Returns the default styles for component `button`.
 *
 * @param helpers - The {@link TailwindHelpers} to generate CSS.
 * @returns The {@link CssStyleOptions} for the component.
 */
export function buttonDefault(helpers: TailwindHelpers) {
  const { theme } = helpers
  return {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    alignContent: 'center',
    flexFlow: 'row nowrap',
    boxSizing: 'border-box',

    borderStyle: 'solid',
    borderWidth: theme('x.borderWidth.1'),

    fontFamily: theme('x.fontFamily.main'),
    fontWeight: theme('x.fontWeight.bold'),
    letterSpacing: theme('x.letterSpacing.md'),
    lineHeight: theme('x.lineHeight.sm'),

    cursor: 'pointer',

    backgroundColor: `var(--button-color-50,${theme('x.colors.neutral.90')})`,
    borderColor: `var(--button-color-50,${theme('x.colors.neutral.90')})`,
    color: theme('x.colors.neutral.0'),

    '&:hover,&:active': {
      backgroundColor: `var(--button-color-75,${theme('x.colors.neutral.100')})`,
      borderColor: `var(--button-color-75,${theme('x.colors.neutral.100')})`,
    },

    ...buttonSizes(helpers).md,

    '&.selected': {
      backgroundColor: `var(--button-color-75,${theme('x.colors.neutral.100')})`,
      borderColor: `var(--button-color-75,${theme('x.colors.neutral.100')})`,

      '&:hover,&:active': {
        backgroundColor: `var(--button-color-50,${theme('x.colors.neutral.90')})`,
        borderColor: `var(--button-color-50,${theme('x.colors.neutral.90')})`,
      },
    },
  }
}
