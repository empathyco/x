import { TailwindHelpers } from '../../../types';

/**
 * Returns the component `icon` CSS.
 *
 * @param helpers - The {@link TailwindHelpers} to generate CSS.
 * @returns The {@link CssStyleOptions} for the component.
 */
// eslint-disable-next-line max-len
// eslint-disable-next-line @typescript-eslint/explicit-function-return-type,@typescript-eslint/no-unused-vars
export function variables(helpers: TailwindHelpers) {
  return {
    ':root': {
      '--ON': 'initial',
      '--OFF': ' '
    }
  };
}
