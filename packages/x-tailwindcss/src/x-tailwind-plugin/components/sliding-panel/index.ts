import { TailwindHelpers } from '../../../types';
import { slidingPanelDefault } from './default';

/**
 * Returns the component `sliding panel` CSS.
 *
 * @param helpers - The {@link TailwindHelpers} to generate CSS.
 * @returns The {@link CssStyleOptions} for the component.
 */
export function slidingPanel(helpers: TailwindHelpers) {
  return {
    '.sliding-panel': {
      ...slidingPanelDefault(helpers)
    }
  };
}
