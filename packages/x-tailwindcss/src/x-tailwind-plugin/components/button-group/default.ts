import { TailwindHelpers } from '../../../types';

/**
 * Returns the default styles for component `button-group`.
 *
 * @param helpers - The {@link TailwindHelpers} to generate CSS.
 * @returns The {@link CssStyleOptions} for the component.
 */
export function buttonGroupDefault(helpers: TailwindHelpers) {
  const { theme } = helpers;

  return {
    display: 'inline-flex',
    flexFlow: 'row nowrap',
    color: theme('colors.neutral.50'),

    '&:not([class*="gap"]) > .button + .button': {
      borderLeft: 'unset'
    },

    '& > :not(.button-circle):first-child': {
      borderTopLeftRadius: 'inherit',
      borderBottomLeftRadius: 'inherit'
    },

    '& > :not(.button-circle):last-child': {
      borderTopRightRadius: 'inherit',
      borderBottomRightRadius: 'inherit'
    }
  };
}
