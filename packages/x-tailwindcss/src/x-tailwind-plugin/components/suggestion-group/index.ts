import { rename } from '@empathyco/x-utils';
import { TailwindHelpers } from '../../../types';
import { suggestionGroupDefault } from './default';
import { suggestionGroupColors } from './colors';
import { suggestionGroupSizes } from './sizes';
import { suggestionGroupOutlined } from './outlined';
import { suggestionGroupGhost } from './ghost';

/**
 * Returns the component `suggestion group` CSS.
 *
 * @param helpers - The {@link TailwindHelpers} to generate CSS.
 * @returns The {@link CssStyleOptions} for the component.
 */
// eslint-disable-next-line  @typescript-eslint/explicit-function-return-type
export function suggestionGroup(helpers: TailwindHelpers) {
  return {
    '.suggestion-group': {
      ...suggestionGroupDefault(helpers),
      ...rename(
        {
          ...suggestionGroupColors(helpers),
          ...suggestionGroupSizes(helpers),
          ...suggestionGroupGhost(helpers),
          ...suggestionGroupOutlined(helpers)
        },
        { prefix: '&-' }
      )
    }
  };
}
