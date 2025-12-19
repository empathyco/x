import type { TailwindHelpers } from '../../../types'
import { rename } from '@empathyco/x-utils'
import { suggestionColors } from './colors'
import { suggestionDefault } from './default'
import { suggestionGhost } from './ghost'
import { suggestionOutlined } from './outlined'
import { suggestionSizes } from './sizes'

/**
 * Returns the component `suggestion` CSS.
 *
 * @param helpers - The {@link TailwindHelpers} to generate CSS.
 * @returns The {@link CssStyleOptions} for the component.
 */
export function suggestion(helpers: TailwindHelpers) {
  return {
    '.x-suggestion': {
      ...suggestionDefault(helpers),
    },
    ...rename(
      {
        ...suggestionColors(helpers),
        ...suggestionSizes(helpers),
        ...suggestionOutlined(helpers),
        ...suggestionGhost(helpers),
      },
      { prefix: '.x-suggestion-' },
    ),
  }
}
