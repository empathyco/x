import { slidingPanelButtonsDefault } from './default'
import { slidingPanelButtonsHover } from './hover'
import { slidingPanelButtonsPositions } from './positions'

/**
 * Returns the buttons for the component `sliding panel`.
 *
 * @returns The {@link CssStyleOptions} for the variant.
 */
export function slidingPanelButtons() {
  return {
    '.x-sliding-panel-button-left': {
      ...slidingPanelButtonsDefault(),
      left: 0,
    },
    '.x-sliding-panel-button-right': {
      ...slidingPanelButtonsDefault(),
      right: 0,
    },
    ...slidingPanelButtonsHover(),
    ...slidingPanelButtonsPositions(),
  }
}
