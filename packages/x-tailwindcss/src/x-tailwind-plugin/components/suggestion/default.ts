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
    paddingRight: 0,
    paddingLeft: 0,
    borderRadius: 0,
    borderColor: 'transparent',
    borderWidth: 0,

    fontFamily: theme('fontFamily.primary'),

    backgroundColor: 'transparent',
    color: theme('colors.neutral.90'),
    textDecoration: 'none',

    // Default size is `md`
    ...suggestionSizes(helpers).md,

    '&:hover': {
      textDecoration: 'underline'
    }
  };
}
