import { TailwindHelpers } from '../../../types';
import { CSSRuleObject } from 'tailwindcss/types/config';

/**
 * Returns the default styles for component `button-group`.
 *
 * @param helpers - The {@link TailwindHelpers} to generate CSS.
 * @returns The {@link CssStyleOptions} for the component.
 */
export function buttonGroupDefault(helpers: TailwindHelpers): CSSRuleObject {
  const { theme } = helpers;

  return {
    display: 'inline-flex',
    color: theme('x.colors.neutral.50'),

    // We should only remove the left border if the button group doesn't have gap.
    '&:not([class*="gap"]) > .x-button + .x-button': {
      borderLeft: 'unset'
    },

    '& > :not(.x-button-circle):first-child': {
      borderTopLeftRadius: 'inherit',
      borderBottomLeftRadius: 'inherit'
    },

    '& > :not(.x-button-circle):last-child': {
      borderTopRightRadius: 'inherit',
      borderBottomRightRadius: 'inherit'
    }
  };
}
