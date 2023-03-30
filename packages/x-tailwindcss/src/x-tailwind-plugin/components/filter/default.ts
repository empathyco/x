import { TailwindHelpers } from '../../../types';
import { alignIconWithBaseline } from '../icon/utils/align-icon-with-baseline';
import { filterSizes } from './sizes';

/**
 * Returns the default styles for component `filter`.
 *
 * @param helpers - The {@link TailwindHelpers} to generate CSS.
 * @returns The {@link CssStyleOptions} for the component.
 */
export function filterDefault(helpers: TailwindHelpers) {
  const { theme } = helpers;

  return {
    display: 'grid',
    gridAutoFlow: 'column',
    alignItems: 'baseline',
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

    ...filterSizes(helpers).md,
    ...alignIconWithBaseline(),

    '&:hover,&.selected': {
      color: `var(--filter-color-50, ${theme('colors.neutral.50')})`
    },

    '&.selected': {
      fontWeight: theme('fontWeight.bold')
    },

    '&:disabled': {
      color: theme('colors.neutral.25'),
      cursor: 'not-allowed'
    }
  };
}
