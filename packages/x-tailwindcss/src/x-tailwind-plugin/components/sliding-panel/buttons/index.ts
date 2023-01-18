import { slidingPanelButtonsDefault } from './default';
import { slidingPanelButtonsPositions } from './positions';
import { slidingPanelButtonsHover } from './hover';

/**
 * Returns the buttons for the component `sliding panel`.
 *
 * @returns The {@link CssStyleOptions} for the variant.
 */
export function slidingPanelButtons() {
  return {
    '.sliding-panel-button': {
      ...slidingPanelButtonsDefault()
    },
    ...slidingPanelButtonsHover(),
    ...slidingPanelButtonsPositions()
  };
}
