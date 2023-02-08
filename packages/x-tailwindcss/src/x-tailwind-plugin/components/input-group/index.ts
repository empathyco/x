import { deepMerge } from '@empathyco/x-deep-merge';
import { rename } from '@empathyco/x-utils';
import { TailwindHelpers } from '../../../types';
import { inputGroupButtons } from './buttons';
import { inputGroupColors } from './colors';
import { inputGroupDefault } from './default';
import { inputGroupLine } from './line';
import { inputGroupSizes } from './sizes';

/**
 * Returns the component `input-group` CSS.
 *
 * @param helpers - The {@link TailwindHelpers} to generate CSS.
 * @returns The {@link CssStyleOptions} for the component.
 */
export function inputGroup(helpers: TailwindHelpers) {
  return {
    '.input-group': deepMerge(
      inputGroupDefault(helpers),
      rename(
        {
          ...inputGroupColors(helpers),
          ...inputGroupSizes(helpers),
          ...inputGroupLine(helpers),
          ...inputGroupButtons(helpers)
        },
        {
          prefix: '&-'
        }
      )
    )
  };
}
