import { rename } from '@empathyco/x-utils';
import { TailwindHelpers } from '../../../../types';
import { textDefault } from './default';
import { textSizes } from './sizes';

/**
 * Returns the component `text2` CSS.
 *
 * @param helpers - The {@link TailwindHelpers} to generate CSS.
 * @returns The {@link CssStyleOptions} for the component.
 */
// eslint-disable-next-line  @typescript-eslint/explicit-function-return-type
export function text2(helpers: TailwindHelpers) {
  return {
    '.text2': {
      ...textDefault(helpers),
      ...rename(
        {
          ...textSizes(helpers)
        },
        { prefix: '&-' }
      )
    }
  };
}
