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
    fontSize: `var(--input-group-button-primary-font-size,${theme('fontSize.sm')})`,
    backgroundColor: `var(--input-color-50,${theme('colors.neutral.90')})`,
    borderColor: `var(--input-color-50,${theme('colors.neutral.90')})`,
    color: theme('colors.neutral.0'),

    '&:hover,&:focus,&:active': {
      backgroundColor: `var(--input-color-75,${theme('colors.neutral.75')})`,
      borderColor: `var(--input-color-75,${theme('colors.neutral.75')})`
    },

    '&:first-child': {
      marginInlineStart: '0',
      borderInlineStartStyle: 'none'
    },

    '&:last-child': {
      marginInlineEnd: '0',
      borderInlineEndStyle: 'none'
    }
  };
}
