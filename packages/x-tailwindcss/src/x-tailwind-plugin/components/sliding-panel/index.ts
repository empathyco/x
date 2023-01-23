import { TailwindHelpers } from '../../../types';
import { slidingPanelDefault } from './default';
import { slidingPanelFade } from './fade';

/**
 * Returns the component `sliding panel` CSS.
 *
 * @param helpers
 * @returns The {@link CssStyleOptions} for the component.
 */
export function slidingPanel(helpers: TailwindHelpers) {
  return {
    '.sliding-panel': {
      ...slidingPanelDefault(),
      ...slidingPanelFade(helpers)
    }
  };
}
