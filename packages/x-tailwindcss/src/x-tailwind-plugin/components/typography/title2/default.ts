import type { TailwindHelpers } from '../../../../types';
import { titleSizes } from './sizes';

/**
 * Returns the default styles for component `title2`.
 *
 * @param helpers - The {@link TailwindHelpers} to generate CSS.
 * @returns The {@link CssStyleOptions} for the component.
 */
export function titleDefault(helpers: TailwindHelpers) {
  const { theme } = helpers;
  return {
    fontFamily: theme('x.fontFamily.main'),
    fontWeight: theme('x.fontWeight.bold'),

    ...titleSizes(helpers).md
  };
}
