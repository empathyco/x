import { rename } from '@empathyco/x-utils';
import { TailwindHelpers } from '../../../types';
import { suggestionDefault } from './default';
import { suggestionColors } from './colors';
import { suggestionGhost } from './ghost';
import { suggestionOutlined } from './outlined';
import { suggestionSizes } from './sizes';
import { CSSRuleObject } from 'tailwindcss/types/config';

/**
 * Returns the component `suggestion` CSS.
 *
 * @param helpers - The {@link TailwindHelpers} to generate CSS.
 * @returns The {@link CssStyleOptions} for the component.
 */
export function suggestion(helpers: TailwindHelpers): CSSRuleObject {
  return {
    '.x-suggestion': {
      ...suggestionDefault(helpers),
      ...rename(
        {
          ...suggestionColors(helpers),
          ...suggestionSizes(helpers),
          ...suggestionOutlined(helpers),
          ...suggestionGhost(helpers)
        },
        { prefix: '&-' }
      )
    }
  };
}
