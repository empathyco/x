import type { TailwindHelpers } from '../../../types'
import { rename } from '@empathyco/x-utils'
import { badgeBright } from './bright'
import { badgeCircle } from './circle'
import { badgeColors } from './colors'
import { badgeDefault } from './default'
import { badgeLight } from './light'
import { badgeOutlined } from './outlined'
import { badgeSizes } from './sizes'

/**
 * Returns the component `badge` CSS.
 *
 * @param helpers - The {@link TailwindHelpers} to generate CSS.
 * @returns The {@link CssStyleOptions} for the component.
 */
export function badge(helpers: TailwindHelpers) {
  return {
    '.x-badge': {
      ...badgeDefault(helpers),
    },
    ...rename(
      {
        ...badgeSizes(helpers),
        ...badgeCircle(helpers),
        ...badgeColors(helpers),
        ...badgeOutlined(helpers),
        ...badgeLight(helpers),
        ...badgeBright(helpers),
      },
      {
        prefix: '.x-badge-',
      },
    ),
  }
}
