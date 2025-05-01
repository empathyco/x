/**
 * Returns the button position variants for the component `sliding panel`.
 *
 * @returns The {@link CssStyleOptions} for the variant.
 */
export function slidingPanelButtonsPositions() {
  return {
    '&.x-sliding-panel-buttons-center': {
      '.x-sliding-panel-button-left': {
        transform: 'translateX(-50%)',
      },
      '.x-sliding-panel-button-right': {
        transform: 'translateX(50%)',
      },
    },
    '&.x-sliding-panel-buttons-outside': {
      '.x-sliding-panel-button-left': {
        transform: 'translateX(-100%)',
      },
      '.x-sliding-panel-button-right': {
        transform: 'translateX(100%)',
      },
    },
  }
}
