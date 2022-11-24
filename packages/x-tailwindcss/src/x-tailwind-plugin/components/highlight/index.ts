import { rename } from '@empathyco/x-utils';
import { TailwindHelpers } from '../../../types';
import { highlightDefault } from './default';
import { highlightInverted } from './inverted';

/**
 * Returns the `highlight` component CSS. The highlight component serves to emphasise certain part
 * of a text. It has two variants:
 * - Emphasise the different part, which is the default.
 * - Emphasise the matching part.
 *
 * @param helpers - The {@link TailwindHelpers} to generate CSS.
 * @returns The {@link CssStyleOptions} for the component.
 */
// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
export function highlight(helpers: TailwindHelpers) {
  return {
    '.highlight-text': {
      ...highlightDefault(helpers),
      ...rename(
        {
          ...highlightInverted(helpers)
        },
        { prefix: '&-' }
      )
    }
  };
}
