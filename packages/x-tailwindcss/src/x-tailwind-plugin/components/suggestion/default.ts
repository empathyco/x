import type { TailwindHelpers } from '../../../types';
import { alignIconWithBaseline } from '../icon/utils/align-icon-with-baseline';
import { suggestionSizes } from './sizes';

/**
 * Returns the default styles for component `suggestion`.
 *
 * @param helpers - The {@link TailwindHelpers} to generate CSS.
 * @returns The {@link CssStyleOptions} for the component.
 */
export function suggestionDefault(helpers: TailwindHelpers) {
  const { theme } = helpers;
  return {
    fontFamily: theme('x.fontFamily.main'),
    fontWeight: theme('x.fontWeight.regular'),

    display: 'grid',
    gridAutoFlow: 'column',
    alignItems: 'center',
    alignContent: 'center',
    justifyContent: 'flex-start',
    boxSizing: 'border-box',
    cursor: 'pointer',
    textAlign: 'start',

    ...suggestionSizes(helpers).md,

    color: theme('x.colors.neutral.90'),

    '&:hover': {
      textDecoration: 'underline'
    },

    ...alignIconWithBaseline()
  };
}
