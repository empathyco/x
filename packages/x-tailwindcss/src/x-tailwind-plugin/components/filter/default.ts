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
    display: 'flex',
    alignItems: 'baseline',
    textAlign: 'start',

    color: theme('colors.neutral.90'),

    ...filterSizes(helpers).md,
    ...alignIconWithBaseline(),

    '&:hover': {
      color: `var(--filter-color-50, ${theme('colors.neutral.50')})`
    },

    '&.selected': {
      fontWeight: theme('fontWeight.bold')
    },

    '&:disabled': {
      color: theme('colors.neutral.25'),
      cursor: 'disabled'
    }
  };
}
