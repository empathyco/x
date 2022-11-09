import { TailwindHelpers } from '../../../types';
import { suggestionSizes } from './sizes';
import { suggestionColors } from './colors';

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
    fontFamily: theme('fontFamily.primary'),
    fontWeight: theme('fontWeight.regular'),

    display: 'flex',
    justifyContent: 'center',
    alignItems: 'flex-start',
    alignContent: 'center',
    flexFlow: 'row nowrap',
    boxSizing: 'border-box',

    ...suggestionColors(helpers).neutral,
    ...suggestionSizes(helpers).md,

    color: theme('colors.neutral.90'),

    '&:hover': {
      textDecoration: 'underline'
    }
  };
}
