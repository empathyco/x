/**
 * Returns the button position variants for the component `sliding panel`.
 *
 * @returns The {@link CssStyleOptions} for the variant.
 */
export function slidingPanelButtonsPositions() {
  return {
    '&.sliding-panel-buttons-center': {
      '.sliding-panel-button-left': {
        transform: 'translateX(-50%)',
      },
      '.sliding-panel-button-right': {
        transform: 'translateX(50%)',
      },
    },
    '&.sliding-panel-buttons-outside': {
      '.sliding-panel-button-left': {
        transform: 'translateX(-100%)',
      },
      '.sliding-panel-button-right': {
        transform: 'translateX(100%)',
      },
    },
  }
}
