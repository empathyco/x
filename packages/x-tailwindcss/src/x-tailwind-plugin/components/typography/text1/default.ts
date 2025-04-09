import type { TailwindHelpers } from '../../../../types';
import { textSizes } from './sizes';

/**
 * Returns the default styles for component `text1`.
 *
 * @param helpers - The {@link TailwindHelpers} to generate CSS.
 * @returns The {@link CssStyleOptions} for the component.
 */
export function textDefault(helpers: TailwindHelpers) {
  const { theme } = helpers;
  return {
    fontFamily: theme('x.fontFamily.main'),
    fontWeight: theme('x.fontWeight.regular'),

    ...textSizes(helpers).md
  };
}
