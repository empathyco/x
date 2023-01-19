import { rename } from '@empathyco/x-utils';
import { TailwindHelpers } from '../../../../types';
import { titleDefault } from './default';
import { titleSizes } from './sizes';

/**
 * Returns the component `title3` CSS.
 *
 * @param helpers - The {@link TailwindHelpers} to generate CSS.
 * @returns The {@link CssStyleOptions} for the component.
 */
export function title3(helpers: TailwindHelpers) {
  return {
    '.title3': {
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
