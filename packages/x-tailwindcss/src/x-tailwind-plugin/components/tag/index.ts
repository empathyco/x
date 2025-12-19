import type { TailwindHelpers } from '../../../types'
import { rename } from '@empathyco/x-utils'
import { tagColors } from './colors'
import { tagDefault } from './default'
import { tagGhost } from './ghost'
import { tagOutlined } from './outlined'
import { tagSizes } from './sizes'
import { tagSolid } from './solid'
import { tagTight } from './tight'

/**
 * Returns the component `tag` CSS.
 *
 * @param helpers - The {@link TailwindHelpers} to generate CSS.
 * @returns The {@link CssStyleOptions} for the component.
 */
export function tag(helpers: TailwindHelpers) {
  return {
    '.x-tag': {
      ...tagDefault(helpers),
    },
    ...rename(
      {
        ...tagSizes(helpers),
        ...tagColors(helpers),
        ...tagOutlined(helpers),
        ...tagSolid(helpers),
        ...tagGhost(helpers),
        ...tagTight(helpers),
      },
      { prefix: '.x-tag-' },
    ),
  }
}
