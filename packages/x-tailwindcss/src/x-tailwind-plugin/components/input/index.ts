import { rename } from '@empathyco/x-utils';
import { deepMerge } from '@empathyco/x-deep-merge';
import { TailwindHelpers } from '../../../types';
import { inputDefault } from './default';
import { inputColors } from './colors';
import { inputSizes } from './sizes';
import { inputLine } from './line';

/**
 * Returns the component `input` CSS.
 *
 * @param helpers - The {@link TailwindHelpers} to generate CSS.
 * @returns The {@link CssStyleOptions} for the component.
 */
// eslint-disable-next-line  @typescript-eslint/explicit-function-return-type
export function input(helpers: TailwindHelpers) {
  return {
    '.input': deepMerge(
      inputDefault(helpers),
      rename(
        {
          ...inputColors(helpers),
          ...inputSizes(helpers),
          ...inputLine(helpers)
        },
        {
          prefix: '&-'
        }
      )
    )
  };
}
