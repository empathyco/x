import type { TailwindHelpers } from '../../../../types'
import { rename } from '@empathyco/x-utils'
import { suggestionGroupButtonDefault } from './default'
import { suggestionGroupButtonGhost } from './ghost'
import { suggestionGroupButtonLighter } from './lighter'
import { suggestionGroupLighterColors } from './lighter-colors'
import { suggestionGroupButtonRectangle } from './rectangle'

/**
 * Returns the component `suggestion group button` CSS.
 *
 * @param helpers - The {@link TailwindHelpers} to generate CSS.
 * @returns The {@link CssStyleOptions} for the component.
 */
export function suggestionGroupButton(helpers: TailwindHelpers) {
  return {
    '.x-suggestion-group-button': {
      ...suggestionGroupButtonDefault(),
      ...rename(
        {
          ...suggestionGroupButtonGhost(helpers),
          ...suggestionGroupButtonRectangle(helpers),
          ...suggestionGroupButtonLighter(),
        },
        { prefix: '&.x-suggestion-group-button-' },
      ),
    },
    ...suggestionGroupLighterColors(helpers),
  }
}
