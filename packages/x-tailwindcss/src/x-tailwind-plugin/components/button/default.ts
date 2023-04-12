import { TailwindHelpers } from '../../../types';
import { buttonSizes } from './sizes';

/**
 * Returns the default styles for component `button`.
 *
 * @param helpers - The {@link TailwindHelpers} to generate CSS.
 * @returns The {@link CssStyleOptions} for the component.
 */
export function buttonDefault(helpers: TailwindHelpers) {
  const { theme } = helpers;
  return {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    alignContent: 'center',
    flexFlow: 'row nowrap',
    boxSizing: 'border-box',

    borderStyle: 'solid',
    borderWidth: theme('borderWidth.1'),

    fontFamily: theme('fontFamily.main'),
    fontWeight: theme('fontWeight.bold'),
    letterSpacing: theme('letterSpacing.md'),
    lineHeight: theme('lineHeight.sm'),

    cursor: 'pointer',

    backgroundColor: `var(--button-color-50,${theme('colors.neutral.90')})`,
    borderColor: `var(--button-color-50,${theme('colors.neutral.90')})`,
    color: theme('colors.neutral.0'),

    '&:hover,&:active': {
      backgroundColor: `var(--button-color-75,${theme('colors.neutral.100')})`,
      borderColor: `var(--button-color-75,${theme('colors.neutral.100')})`
    },

    ...buttonSizes(helpers).md,

    '&.selected': {
      backgroundColor: `var(--button-color-75,${theme('colors.neutral.100')})`,
      borderColor: `var(--button-color-75,${theme('colors.neutral.100')})`,

      '&:hover,&:active': {
        backgroundColor: `var(--button-color-50,${theme('colors.neutral.90')})`,
        borderColor: `var(--button-color-50,${theme('colors.neutral.90')})`
      }
    }
  };
}
