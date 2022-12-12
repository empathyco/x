import { rename } from '@empathyco/x-utils';
import { TailwindHelpers } from '../../../../types';
import { titleDefault } from './default';
import { titleSizes } from './sizes';

/**
 * Returns the component `title1` CSS.
 *
 * @param helpers - The {@link TailwindHelpers} to generate CSS.
 * @returns The {@link CssStyleOptions} for the component.
 */
// eslint-disable-next-line  @typescript-eslint/explicit-function-return-type
export function title1(helpers: TailwindHelpers) {
  return {
    '.title1': {
      ...titleDefault(helpers),
      ...rename(
        {
          ...titleSizes(helpers)
        },
        { prefix: '&-' }
      )
    }
  };
}
