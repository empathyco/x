/**
 * Returns the button hover variants for the component `sliding panel`.
 *
 * @returns The {@link CssStyleOptions} for the variant.
 */
export function slidingPanelButtonsHover() {
  return {
    '&.x-sliding-panel-at-start': {
      '.x-sliding-panel-button-left': {
        opacity: 0,
        pointerEvents: 'none'
      }
    },
    '&.x-sliding-panel-at-end': {
      '.x-sliding-panel-button-right': {
        opacity: 0,
        pointerEvents: 'none'
      }
    },
    '&.x-sliding-panel-show-buttons-on-hover': {
      '.x-sliding-panel-button-left': {
        opacity: 0
      },
      '.x-sliding-panel-button-right': {
        opacity: 0
      },
      '&:not(.x-sliding-panel-at-start):hover': {
        '.x-sliding-panel-button-left': {
          opacity: 1,
          pointerEvents: 'all'
        }
      },
      '&:not(.x-sliding-panel-at-end):hover': {
        '.x-sliding-panel-button-right': {
          opacity: 1,
          pointerEvents: 'all'
        }
      }
    }
  };
}
