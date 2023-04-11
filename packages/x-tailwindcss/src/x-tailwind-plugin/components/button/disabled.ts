import { TailwindHelpers } from '../../../types';

/**
 * Returns the `disabled` state for component `button`.
 *
 * @param helpers - The {@link TailwindHelpers} to generate CSS.
 * @returns The {@link CssStyleOptions} for the state.
 */
// eslint-disable-next-line max-len
// eslint-disable-next-line @typescript-eslint/explicit-function-return-type,@typescript-eslint/no-unused-vars
export function buttonDisabled(helpers: TailwindHelpers) {
  const { theme } = helpers;

  // Disabled common styles
  const disabledStyles = {
    borderColor: `var(--button-disabled-border-color,${theme('colors.neutral.10')})`,
    backgroundColor: `var(--button-disabled-background-color,${theme('colors.neutral.10')})`,
    color: theme('colors.neutral.25')
  };

  return {
    '&:disabled': {
      cursor: 'not-allowed',
      ...disabledStyles,

      '&.selected': {
        ...disabledStyles
      }
    }
  };
}
