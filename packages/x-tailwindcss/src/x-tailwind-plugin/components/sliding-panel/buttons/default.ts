/**
 * Returns the buttons default styles for the component `sliding panel`.
 *
 * @returns The {@link CssStyleOptions} for the variant.
 */
export function slidingPanelButtonsDefault() {
  return {
    position: 'absolute',
    transition: 'all ease-out 0.2s',
    zIndex: 1,
    transform: 'translateX(0)',
  }
}
