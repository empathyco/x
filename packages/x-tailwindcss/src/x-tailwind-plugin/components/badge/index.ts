import { rename } from '@empathyco/x-utils';
import { TailwindHelpers } from '../../../types';
import { badgeDefault } from './default';
import { badgeSizes } from './sizes';
import { badgeColors } from './colors';

/**
 * Returns the component `badge` CSS.
 *
 * @param helpers - The {@link TailwindHelpers} to generate CSS.
 * @returns The {@link CssStyleOptions} for the component.
 */
export function badge(helpers: TailwindHelpers) {
  return {
    '.badge': {
      ...badgeDefault(helpers),
      ...rename(
        {
          ...badgeSizes(helpers),
          ...badgeColors(helpers)
        },
        {
          prefix: '&-'
        }
      )
    }
  };
}
