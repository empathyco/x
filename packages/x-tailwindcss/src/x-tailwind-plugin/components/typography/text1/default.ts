import { TailwindHelpers } from '../../../../types';
import { textSizes } from './sizes';

/**
 * Returns the default styles for component `text1`.
 *
 * @param helpers - The {@link TailwindHelpers} to generate CSS.
 * @returns The {@link CssStyleOptions} for the component.
 */
// eslint-disable-next-line  @typescript-eslint/explicit-function-return-type
export function textDefault(helpers: TailwindHelpers) {
  const { theme } = helpers;
  return {
    fontFamily: theme('fontFamily.main'),
    fontWeight: theme('fontWeight.regular'),

    ...textSizes(helpers).md
  };
}
