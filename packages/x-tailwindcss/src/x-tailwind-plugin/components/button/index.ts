import { rename } from '@empathyco/x-utils';
import { TailwindHelpers } from '../../../types';
import { buttonColors } from './colors';
import { buttonDefault } from './default';
import { buttonGhost } from './ghost';
import { buttonLayouts } from './layouts';
import { buttonOutlined } from './outlined';
import { buttonSizes } from './sizes';

/**
 * Returns the component `button` CSS.
 *
 * @param helpers - The {@link TailwindHelpers} to generate CSS.
 * @returns The {@link CssStyleOptions} for the component.
 */
// eslint-disable-next-line  @typescript-eslint/explicit-function-return-type
export function button(helpers: TailwindHelpers) {
  return {
    '.button': Object.assign(
      buttonDefault(helpers),
      rename(
        {
          ...buttonColors(helpers),
          ...buttonSizes(helpers),
          ...buttonLayouts(helpers),
          ...buttonOutlined(helpers),
          ...buttonGhost(helpers)
        },
        { prefix: '&-' }
      )
    )
  };
}
