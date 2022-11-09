import { rename } from '@empathyco/x-utils';
import { TailwindHelpers } from '../../../types';
import { suggestionDefault } from './default';
import { suggestionColors } from './colors';
import { suggestionTag } from './tag';
import { suggestionSizes } from './sizes';

/**
 * Returns the component `suggestion` CSS.
 *
 * @param helpers - The {@link TailwindHelpers} to generate CSS.
 * @returns The {@link CssStyleOptions} for the component.
 */
// eslint-disable-next-line  @typescript-eslint/explicit-function-return-type
export function suggestion(helpers: TailwindHelpers) {
  return {
    '.suggestion': Object.assign(
      suggestionDefault(helpers),
      rename(
        {
          ...suggestionColors(helpers),
          ...suggestionSizes(helpers),
          ...suggestionTag(helpers)
        },
        { prefix: '&-' }
      )
    )
  };
}
