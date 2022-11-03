import { TailwindHelpers } from '../../../types';
import { buttonSizes } from './sizes';

/**
 * Returns the default styles for component `button`.
 *
 * @param helpers - The {@link TailwindHelpers} to generate CSS.
 * @returns The {@link CssStyleOptions} for the component.
 */
// eslint-disable-next-line  @typescript-eslint/explicit-function-return-type
export function buttonDefault(helpers: TailwindHelpers) {
  const { theme } = helpers;
  return {
    '--button-color-25': theme('colors.neutral.25'),
    '--button-color-50': theme('colors.neutral.50'),
    '--button-color-75': theme('colors.neutral.75'),
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    alignContent: 'center',
    flexFlow: 'row nowrap',
    boxSizing: 'border-box',
    borderRadius: theme('borderRadius.none'),

    borderStyle: 'solid',
    borderWidth: theme('borderWidth.1'),

    borderColor: 'var(--button-color-50)',
    backgroundColor: 'var(--button-color-50)',
    color: theme('colors.neutral.0'),

    fontFamily: theme('fontFamily.primary'),
    lineHeight: theme('lineHeight.sm'),

    cursor: 'default',

    // Default size is `md`
    ...buttonSizes(helpers).md,

    '&:hover': {
      borderColor: 'var(--button-color-75)',
      backgroundColor: 'var(--button-color-75)',
      color: theme('colors.neutral.0')
    },

    '&:active': {
      borderColor: 'var(--button-color-75)',
      backgroundColor: 'var(--button-color-75)',
      color: theme('colors.neutral.0')
    },

    '&:disabled': {
      borderColor: theme('colors.neutral.10'),
      backgroundColor: theme('colors.neutral.10'),
      color: theme('colors.neutral.25'),
      cursor: 'not-allowed'
    }
  };
}
