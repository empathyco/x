import { TailwindHelpers } from '../../../../types';

/**
 * Util to remove background for component `button`.
 *
 * @param helpers - The {@link TailwindHelpers} to generate CSS.
 * @returns The {@link CssStyleOptions} for the util.
 */
export function noBackground(helpers: TailwindHelpers) {
  const { theme } = helpers;
  return {
    borderColor: 'transparent',
    backgroundColor: 'transparent',
    color: `var(--button-color-50,${theme('colors.neutral.90')})`,

    '&:hover': {
      borderColor: 'transparent',
      backgroundColor: 'transparent',
      color: `var(--button-color-75,${theme('colors.neutral.100')})`
    },

    '&:active': {
      borderColor: 'transparent',
      backgroundColor: 'transparent',
      color: `var(--button-color-75,${theme('colors.neutral.100')})`
    },

    '&:disabled': {
      borderColor: 'transparent',
      backgroundColor: 'transparent',
      color: theme('colors.neutral.25')
    }
  };
}
