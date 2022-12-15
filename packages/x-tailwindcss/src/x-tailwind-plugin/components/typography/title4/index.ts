import { rename } from '@empathyco/x-utils';
import { TailwindHelpers } from '../../../../types';
import { titleDefault } from './default';
import { titleSizes } from './sizes';

/**
 * Returns the component `title4` CSS.
 *
 * @param helpers - The {@link TailwindHelpers} to generate CSS.
 * @returns The {@link CssStyleOptions} for the component.
 */
// eslint-disable-next-line  @typescript-eslint/explicit-function-return-type
export function title4(helpers: TailwindHelpers) {
  return {
    '.title4': {
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
