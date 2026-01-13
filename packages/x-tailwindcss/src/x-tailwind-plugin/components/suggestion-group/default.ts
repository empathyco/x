import type { TailwindHelpers } from '../../../types'
import { alignIconWithBaseline } from '../icon/utils/align-icon-with-baseline'
import { suggestionGroupSizes } from './sizes'

/**
 * Returns the default styles for component `suggestion group`.
 *
 * @param helpers - The {@link TailwindHelpers} to generate CSS.
 * @returns The {@link CssStyleOptions} for the component.
 */
export function suggestionGroupDefault(helpers: TailwindHelpers) {
  const { theme } = helpers
  return {
    gap: theme('x.spacing.16'),
    ...suggestionGroupSizes(helpers).md,

    fontFamily: theme('x.fontFamily.main'),
    fontWeight: theme('x.fontWeight.regular'),

    display: 'grid',
    gridAutoFlow: 'column',
    gridTemplateColumns: 'auto [last-col]',
    gridAutoColumns: '1fr',
    justifyContent: 'flex-start',
    alignItems: 'center',
    alignContent: 'center',

    paddingInlineStart: 0,
    paddingInlineEnd: 0,

    color: theme('x.colors.neutral.90'),
    ...alignIconWithBaseline(),

    '&:hover': {
      textDecoration: 'underline',
    },

    '.suggestion': {
      color: 'currentColor',
      minHeight: 'inherit',
      fontSize: 'inherit',
      fontFamily: 'inherit',
      fontWeight: 'inherit',
      textDecoration: 'inherit',
    },
  }
}
