import type { TailwindHelpers } from '../../../types'
import { alignIconWithBaseline } from '../icon/utils/align-icon-with-baseline'
import { facetFilterSizes } from './sizes'

/**
 * Returns the default styles for component `facet-filter`.
 *
 * @param helpers - The {@link TailwindHelpers} to generate CSS.
 * @returns The {@link CssStyleOptions} for the component.
 */
export function facetFilterDefault(helpers: TailwindHelpers) {
  const { theme } = helpers

  return {
    display: 'grid',
    gridAutoFlow: 'column',
    alignItems: 'last baseline',
    alignContent: 'center',
    justifyContent: 'start',
    boxSizing: 'border-box',

    cursor: 'pointer',

    fontFamily: theme('x.fontFamily.main'),
    fontWeight: theme('x.fontWeight.regular'),
    textAlign: 'start',

    borderWidth: `0 0 ${theme('x.spacing.1')} 0`,
    borderColor: 'transparent',

    color: theme('x.colors.neutral.90'),

    ...facetFilterSizes(helpers).md,
    ...alignIconWithBaseline(),

    '&:hover': {
      color: `var(--filter-color-50, ${theme('x.colors.neutral.50')})`,
    },

    '&.selected': {
      fontWeight: theme('x.fontWeight.bold'),
      letterSpacing: theme('x.letterSpacing.xs'),
      color: `var(--filter-color-50, ${theme('x.colors.neutral.90')})`,
    },

    '&:disabled': {
      color: theme('x.colors.neutral.25'),
      cursor: 'not-allowed',
    },
  }
}
