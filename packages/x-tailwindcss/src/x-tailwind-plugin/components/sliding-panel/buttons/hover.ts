/**
 * Returns the button hover variants for the component `sliding panel`.
 *
 * @returns The {@link CssStyleOptions} for the variant.
 */
export function slidingPanelButtonsHover() {
  return {
    '&.sliding-panel-at-start': {
      '.sliding-panel-button-left': {
        opacity: 0,
        pointerEvents: 'none',
      },
    },
    '&.sliding-panel-at-end': {
      '.sliding-panel-button-right': {
        opacity: 0,
        pointerEvents: 'none',
      },
    },
    '&.sliding-panel-show-buttons-on-hover': {
      '.sliding-panel-button-left': {
        opacity: 0,
      },
      '.sliding-panel-button-right': {
        opacity: 0,
      },
      '&:not(.sliding-panel-at-start):hover': {
        '.sliding-panel-button-left': {
          opacity: 1,
          pointerEvents: 'all',
        },
      },
      '&:not(.sliding-panel-at-end):hover': {
        '.sliding-panel-button-right': {
          opacity: 1,
          pointerEvents: 'all',
        },
      },
    },
  }
}
