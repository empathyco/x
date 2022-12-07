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
    fontFamily: theme('fontFamily.lead'),
    fontWeight: theme('fontWeight.regular'),
    letterSpacing: theme('letterSpacing.md'),

    ...textSizes(helpers).md
  };
}
