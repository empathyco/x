/**
 * Returns the button position variants for the component `sliding panel`.
 *
 * @returns The {@link CssStyleOptions} for the variant.
 */
export function slidingPanelButtons() {
  return {
    '.sliding-panel-button': {
      pointerEvents: 'none',
      position: 'absolute',
      transition: 'all ease-out 0.2s',
      zIndex: 1,

      '&-left': {
        left: 0,
        transform: 'translateX(0)'
      },
      '&-right': {
        right: 0,
        transform: 'translateX(0)'
      }
    },
    '&.buttons-center': {
      '.sliding-panel-button-left': {
        transform: 'translateX(-50%)'
      },
      '.sliding-panel-button-right': {
        transform: 'translateX(50%)'
      }
    },
    '&.buttons-outside': {
      '.sliding-panel-button-left': {
        transform: 'translateX(-100%)'
      },
      '.sliding-panel-button-right': {
        transform: 'translateX(100%)'
      }
    },
    '&.sliding-panel-show-buttons-on-hover': {
      '.sliding-panel-button': {
        opacity: 0,
        '&:hover': {
          opacity: 1,
          pointerEvents: 'all'
        }
      },
      '&:not(.sliding-panel-at-start):hover': {
        '.sliding-panel-button-left': {
          opacity: 1,
          pointerEvents: 'all'
        }
      },
      '&:not(.sliding-panel-at-end):hover': {
        '.sliding-panel-button-right': {
          opacity: 1,
          pointerEvents: 'all'
        }
      }
    },
    '&:not(.sliding-panel-show-buttons-on-hover):not(.sliding-panel-at-start)': {
      '.sliding-panel-button-left': {
        opacity: 1,
        pointerEvents: 'all'
      }
    },
    '&:not(.sliding-panel-show-buttons-on-hover):not(.sliding-panel-at-end)': {
      '.sliding-panel-button-right': {
        opacity: 1,
        pointerEvents: 'all'
      }
    }
  };
}
