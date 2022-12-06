import { deepMerge } from '@empathyco/x-deep-merge';
import { TailwindHelpers } from '../../../types';
import { backgroundOnHover } from './utils/background-on-hover';
import { noBackground } from './utils/no-background';

/**
 * Returns the `ghost` variant for component `button`.
 *
 * @param helpers - The {@link TailwindHelpers} to generate CSS.
 * @returns The {@link CssStyleOptions} for the variant.
 */
// eslint-disable-next-line  @typescript-eslint/explicit-function-return-type
export function buttonGhost(helpers: TailwindHelpers) {
  return { ghost: deepMerge(noBackground(helpers), backgroundOnHover(helpers)) };
}
