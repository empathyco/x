import { deepMerge } from '@empathyco/x-deep-merge';
import { TailwindHelpers } from '../../../types';
import { noBackground } from './utils/no-background';
import { noHorizontalPadding } from './utils/no-horizontal-padding';

/**
 * Returns the `tight` variant for component `button`.
 *
 * @param helpers - The {@link TailwindHelpers} to generate CSS.
 * @returns The {@link CssStyleOptions} for the variant.
 */
// eslint-disable-next-line  @typescript-eslint/explicit-function-return-type
export function buttonTight(helpers: TailwindHelpers) {
  return { tight: deepMerge(noBackground(helpers), noHorizontalPadding(helpers)) };
}
