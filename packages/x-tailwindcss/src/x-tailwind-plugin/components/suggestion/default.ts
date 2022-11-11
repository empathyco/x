import { TailwindHelpers } from '../../../types';
import { suggestionSizes } from './sizes';

/**
 * Returns the default styles for component `suggestion`.
 *
 * @param helpers - The {@link TailwindHelpers} to generate CSS.
 * @returns The {@link CssStyleOptions} for the component.
 */
// eslint-disable-next-line  @typescript-eslint/explicit-function-return-type
export function suggestionDefault(helpers: TailwindHelpers) {
  const { theme } = helpers;
  return {
    fontFamily: theme('fontFamily.main'),
    fontWeight: theme('fontWeight.regular'),

    display: 'flex',
    justifyContent: 'center',
    alignItems: 'baseline',
    alignContent: 'center',
    flexFlow: 'row nowrap',
    boxSizing: 'border-box',
    cursor: 'pointer',

    ...suggestionSizes(helpers).md,

    color: theme('colors.neutral.90'),

    '&:hover': {
      textDecoration: 'underline'
    },

    // Matching state
    '&.suggestion-matching': {
      fontWeight: theme('fontWeight.bold')
    },
    '.suggestion-matching-part': {
      fontWeight: theme('fontWeight.regular')
    },

    // Enable Align icon
    '& *': {
      '--enableIconOffset': 'var(--ON)',
      '--iconVerticalOffset': 'calc(50% - 0.5ex - 1px)'
    }
  };
}
