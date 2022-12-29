import { rename } from '@empathyco/x-utils';
import { TailwindHelpers } from '../../../../types';
import { suggestionGroupButtonDefault } from './default';
import { suggestionGroupButtonGhost } from './ghost';
import { suggestionGroupButtonRectangle } from './rectangle';
import { suggestionGroupLighterColors } from './lighter-colors';
import { suggestionGroupButtonLighter } from './lighter';

/**
 * Returns the component `suggestion group button` CSS.
 *
 * @param helpers - The {@link TailwindHelpers} to generate CSS.
 * @returns The {@link CssStyleOptions} for the component.
 */
// eslint-disable-next-line  @typescript-eslint/explicit-function-return-type
export function suggestionGroupButton(helpers: TailwindHelpers) {
  return {
    '.suggestion-group-button': {
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
