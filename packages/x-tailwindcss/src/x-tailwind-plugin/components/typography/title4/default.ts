import { TailwindHelpers } from '../../../../types';
import { titleSizes } from './sizes';

/**
 * Returns the default styles for component `title4`.
 *
 * @param helpers - The {@link TailwindHelpers} to generate CSS.
 * @returns The {@link CssStyleOptions} for the component.
 */
// eslint-disable-next-line  @typescript-eslint/explicit-function-return-type
export function titleDefault(helpers: TailwindHelpers) {
  const { theme } = helpers;
  return {
    fontFamily: theme('fontFamily.main'),
    fontWeight: theme('fontWeight.bold'),

    ...titleSizes(helpers).md
  };
}
