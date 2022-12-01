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
  return {
    '&:disabled': {
      cursor: 'not-allowed'
    }
  };
}
