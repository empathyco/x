import { TailwindHelpers } from '../../../../types';

/**
 * Util to remove background for component `button`.
 *
 * @param helpers - The {@link TailwindHelpers} to generate CSS.
 * @returns The {@link CssStyleOptions} for the util.
 */
// eslint-disable-next-line  @typescript-eslint/explicit-function-return-type
export function noBackground(helpers: TailwindHelpers) {
  const { theme } = helpers;
  return {
    borderColor: 'transparent',
    backgroundColor: 'transparent',
    color: 'var(--button-color-50)',

    '&:hover': {
      borderColor: 'transparent',
      backgroundColor: 'transparent',
      color: 'var(--button-color-75)'
    },

    '&:active': {
      borderColor: 'transparent',
      backgroundColor: 'transparent',
      color: 'var(--button-color-75)'
    },

    '&:disabled': {
      borderColor: 'transparent',
      backgroundColor: 'transparent',
      color: theme('colors.neutral.25')
    }
  };
}
