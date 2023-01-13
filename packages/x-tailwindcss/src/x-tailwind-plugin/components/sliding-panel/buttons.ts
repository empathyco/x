export function slidingPanelButtons() {
  return {
    '.sliding-panel__button': {
      pointerEvents: 'none',
      position: 'absolute',
      transition: 'all ease-out 0.2s',
      // z-index: 2; /* To overlay the design system gradient with z-index:1 */

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
      '.sliding-panel__button-left': {
        transform: 'translateX(-50%)'
      },
      '.sliding-panel__button-right': {
        transform: 'translateX(50%)'
      }
    },
    '&.buttons-outside': {
      '.sliding-panel__button-left': {
        transform: 'translateX(-100%)',
        pointerEvents: 'all'
      },
      '.sliding-panel__button-right': {
        transform: 'translateX(100%)',
        pointerEvents: 'all'
      }
    },
    '&.sliding-panel-show-buttons-on-hover': {
      '.sliding-panel__button': {
        opacity: 0,
        '&:hover': {
          opacity: 1,
          pointerEvents: 'all'
        }
      },
      '&:hover': {
        '.sliding-panel__button': {
          opacity: 1,
          pointerEvents: 'all'
        }
      }
    }
  };
}
