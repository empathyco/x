import type { TailwindHelpers } from '../../../types'
import { tagSizes } from './sizes'

/**
 * Returns the default styles for component `tag`.
 *
 * @param helpers - The {@link TailwindHelpers} to generate CSS.
 * @returns The {@link CssStyleOptions} for the component.
 */
export function tagDefault(helpers: TailwindHelpers) {
  const { theme } = helpers

  // Default & Default Selected common styles
  const disabledStyles = {
    '&:disabled': {
      cursor: 'not-allowed',
      borderColor: theme('x.colors.neutral.25'),
      borderWidth: theme('x.spacing.1'),
      color: theme('x.colors.neutral.25'),
    },
  }

  return {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    alignContent: 'center',
    flexFlow: 'row nowrap',
    boxSizing: 'border-box',

    backgroundColor: theme('x.colors.neutral.0'),
    borderColor: theme('x.colors.neutral.25'),
    borderStyle: 'solid',
    borderWidth: theme('x.borderWidth.1'),
    color: theme('x.colors.neutral.75'),

    gap: theme('x.spacing.8'),

    fontFamily: theme('x.fontFamily.main'),
    fontWeight: theme('x.fontWeight.regular'),
    letterSpacing: theme('x.letterSpacing.lg'),
    lineHeight: theme('x.lineHeight.sm'),

    cursor: 'pointer',

    '&:hover,&:focus,&:active': {
      borderColor: theme('x.colors.neutral.50'),
      color: theme('x.colors.neutral.90'),
    },

    paddingTop: 0,
    paddingBottom: 0,
    ...tagSizes(helpers).md,
    ...disabledStyles,

    '&.selected': {
      borderColor: `var(--tag-color-75, ${theme('x.colors.neutral.90')})`,
      borderWidth: theme('x.spacing.2'),
      color: theme('x.colors.neutral.90'),

      '&:hover,&:focus,&:active': {
        borderColor: `var(--tag-color-50, ${theme('x.colors.neutral.50')})`,
      },

      ...disabledStyles,
    },
  }
}
