import { rename } from '@empathyco/x-utils';
import { TailwindHelpers } from '../../../types';
import { buttonGroupDefault } from './default';
import { buttonGroupDivider } from './divider';

/**
 * Returns the component `button-group` CSS.
 *
 * @param helpers - The {@link TailwindHelpers} to generate CSS.
 * @returns The {@link CssStyleOptions} for the component.
 */
export function buttonGroup(helpers: TailwindHelpers) {
  return {
    '.button-group': {
      ...buttonGroupDefault(helpers),
      ...rename(buttonGroupDivider(helpers), { prefix: '&-' })
    }
  };
}
