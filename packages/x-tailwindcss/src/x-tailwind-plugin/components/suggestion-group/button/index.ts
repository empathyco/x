import { rename } from '@empathyco/x-utils';
import { TailwindHelpers } from '../../../../types';
import { suggestionGroupButtonDefault } from './default';
import { suggestionGroupButtonGhost } from './ghost';
import { suggestionGroupButtonRectangle } from './rectangle';
import { suggestionGroupLighterColors } from './lighter-colors';
import { suggestionGroupButtonLighter } from './lighter';
import { CSSRuleObject } from 'tailwindcss/types/config';

/**
 * Returns the component `suggestion group button` CSS.
 *
 * @param helpers - The {@link TailwindHelpers} to generate CSS.
 * @returns The {@link CssStyleOptions} for the component.
 */
export function suggestionGroupButton(helpers: TailwindHelpers): CSSRuleObject {
  return {
    '.x-suggestion-group-button': {
      ...suggestionGroupButtonDefault(),
      ...rename(
        {
          ...suggestionGroupButtonGhost(helpers),
          ...suggestionGroupButtonRectangle(helpers),
          ...suggestionGroupButtonLighter()
        },
        { prefix: '&-' }
      )
    },
    ...suggestionGroupLighterColors(helpers)
  };
}
