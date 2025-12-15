import type { TailwindHelpers } from '../../../types'
import { rename } from '@empathyco/x-utils'
import { suggestionGroupColors } from './colors'
import { suggestionGroupDefault } from './default'
import { suggestionGroupGhost } from './ghost'
import { suggestionGroupOutlined } from './outlined'
import { suggestionGroupSizes } from './sizes'

/**
 * Returns the component `suggestion group` CSS.
 *
 * @param helpers - The {@link TailwindHelpers} to generate CSS.
 * @returns The {@link CssStyleOptions} for the component.
 */
export function suggestionGroup(helpers: TailwindHelpers) {
  return {
    '.x-suggestion-group': {
      ...suggestionGroupDefault(helpers),
      ...rename(
        {
          ...suggestionGroupColors(helpers),
          ...suggestionGroupSizes(helpers),
          ...suggestionGroupGhost(helpers),
          ...suggestionGroupOutlined(helpers),
        },
        { prefix: '&.x-suggestion-group-' },
      ),
    },
  }
}
