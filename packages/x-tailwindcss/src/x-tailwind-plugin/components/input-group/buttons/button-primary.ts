import { TailwindHelpers } from '../../../../types';
import { inputGroupButton } from './button';

/**
 * Returns the `primary` variant for component `input-group-button`.
 *
 * @param helpers - The {@link TailwindHelpers} to generate CSS.
 * @returns The {@link CssStyleOptions} for the component.
 */
export function inputGroupButtonPrimary(helpers: TailwindHelpers) {
  const { theme } = helpers;
  return {
    ...inputGroupButton(helpers),
    fontSize: `var(--input-group-button-primary-font-size,${theme('x.fontSize.sm')})`,
    backgroundColor: `var(--input-color-50,${theme('x.colors.neutral.90')})`,
    borderColor: `var(--input-color-50,${theme('x.colors.neutral.90')})`,
    color: theme('x.colors.neutral.0'),

    '&:hover,&:focus,&:active': {
      backgroundColor: `var(--input-color-75,${theme('x.colors.neutral.75')})`,
      borderColor: `var(--input-color-75,${theme('x.colors.neutral.75')})`
    },

    // to remove the "padding" when the button is at the start or at the end.
    // border style is to avoid double border (input-group and button). Specially in outlined.
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
