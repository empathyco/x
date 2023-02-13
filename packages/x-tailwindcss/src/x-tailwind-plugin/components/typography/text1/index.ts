import { rename } from '@empathyco/x-utils';
import { TailwindHelpers } from '../../../../types';
import { textDefault } from './default';
import { textSizes } from './sizes';

/**
 * Returns the component `text1` CSS.
 *
 * @param helpers - The {@link TailwindHelpers} to generate CSS.
 * @returns The {@link CssStyleOptions} for the component.
 */
export function text1(helpers: TailwindHelpers) {
  return {
    '.text1': {
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
