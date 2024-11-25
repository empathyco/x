import { rename } from '@empathyco/x-utils';
import { TailwindHelpers } from '../../../types';
import { badgeDefault } from './default';
import { badgeSizes } from './sizes';
import { badgeColors } from './colors';
import { badgeLight } from './light';
import { badgeOutlined } from './outlined';
import { badgeCircle } from './circle';
import { badgeBright } from './bright';

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
      ...rename(
        {
          ...badgeSizes(helpers),
          ...badgeCircle(helpers),
          ...badgeColors(helpers),
          ...badgeOutlined(helpers),
          ...badgeLight(helpers),
          ...badgeBright(helpers)
        },
        {
          prefix: '&-'
        }
      )
    }
  };
}
