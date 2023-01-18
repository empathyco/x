/**
 * Returns the buttons default styles for the component `sliding panel`.
 *
 * @returns The {@link CssStyleOptions} for the variant.
 */
export function slidingPanelButtonsDefault() {
  return {
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
  };
}
