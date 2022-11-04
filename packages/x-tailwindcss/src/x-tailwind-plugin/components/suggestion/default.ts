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
    '--suggestion-color-25': theme('colors.neutral.25'),
    '--suggestion-color-50': theme('colors.neutral.50'),
    '--suggestion-color-75': theme('colors.neutral.75'),
    borderRadius: 0,
    borderColor: 'transparent',
    borderWidth: 0,

    fontFamily: theme('fontFamily.primary'),

    backgroundColor: 'transparent',
    color: theme('colors.neutral.90'),
    textDecoration: 'none',

    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    alignContent: 'center',
    flexFlow: 'row nowrap',
    boxSizing: 'border-box',

    // Default size is `md`
    ...suggestionSizes(helpers).md,

    '&:hover': {
      textDecoration: 'underline'
    }
  };
}
