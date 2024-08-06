import { TailwindHelpers } from '../../../types';
import { alignIconWithBaseline } from '../icon/utils/align-icon-with-baseline';
import { facetFilterSizes } from './sizes';

/**
 * Returns the default styles for component `facet-filter`.
 *
 * @param helpers - The {@link TailwindHelpers} to generate CSS.
 * @returns The {@link CssStyleOptions} for the component.
 */
export function facetFilterDefault(helpers: TailwindHelpers) {
  const { theme } = helpers;

  return {
    display: 'grid',
    gridAutoFlow: 'column',
    alignItems: 'center',
    alignContent: 'center',
    justifyContent: 'start',
    boxSizing: 'border-box',

    cursor: 'pointer',

    fontFamily: theme('fontFamily.main'),
    fontWeight: theme('fontWeight.regular'),
    textAlign: 'start',

    borderWidth: `0 0 ${theme('spacing.1')} 0`,
    borderColor: 'transparent',

    color: theme('colors.neutral.90'),

    ...facetFilterSizes(helpers).md,
    ...alignIconWithBaseline(),

    '&:hover': {
      color: `var(--filter-color-50, ${theme('colors.neutral.50')})`
    },

    '&.selected': {
      fontWeight: theme('fontWeight.bold'),
      letterSpacing: theme('letterSpacing.xs'),
      color: `var(--filter-color-50, ${theme('colors.neutral.90')})`
    },

    '&:disabled': {
      color: theme('colors.neutral.25'),
      cursor: 'not-allowed'
    }
  };
}
