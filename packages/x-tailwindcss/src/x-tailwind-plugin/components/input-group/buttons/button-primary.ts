import { TailwindHelpers } from '../../../../types';
import { inputGroupButton } from './button';

/**
 * Returns the default styles for component `input`.
 *
 * @param helpers - The {@link TailwindHelpers} to generate CSS.
 * @returns The {@link CssStyleOptions} for the component.
 */
export function inputGroupButtonPrimary(helpers: TailwindHelpers) {
  const { theme } = helpers;
  return {
    ...inputGroupButton(helpers),
    backgroundColor: `var(--input-color-50,${theme('colors.neutral.90')})`,
    borderColor: `var(--input-color-50,${theme('colors.neutral.90')})`,
    color: theme('colors.neutral.0'),

    '&:hover,&:focus,&:active': {
      backgroundColor: `var(--input-color-75,${theme('colors.neutral.75')})`,
      borderColor: `var(--input-color-75,${theme('colors.neutral.75')})`
    },

    '&:first-child': {
      marginInlineStart: '0'
    },

    '&:last-child': {
      marginInlineEnd: '0'
    }
  };
}
