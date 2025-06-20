/**
 * Type options for the property that will be animated.
 */
type AnimatedProperty = 'height' | 'width'

/**
 * Returns parametrized methods to use in a component to allow the collapsing of the provided
 * property.
 *
 * @param property - The property that will be animated.
 * @returns Composable for the module.
 * @public
 */
export function useCollapseAnimation(property: AnimatedProperty) {
  const scrollProperty = property === 'width' ? 'scrollWidth' : 'scrollHeight'

  /**
   * Changes the element's animated property from 0 to the element's content size.
   *
   * @remarks `content-visibility` CSS property boosts the rendering performance waiting to be
   * needed until rendering the content. This behaviour collides with this animation method.
   * When the `scrollProperty` is evaluated, the content has not been rendered yet and the value
   * is 0 so nothing is animated. To avoid this behaviour, we change the `content-visibility` to
   * default value, force a layer repaint and then, evaluate the `scrollProperty` value which
   * now has value. Then we restore the `content-visibility` value to its previous state.
   *
   * @param element - The DOM element that is going to be animated.
   */
  function expand(element: HTMLElement): void {
    element.style[property] = '0'
    const originalValue = element.style.contentVisibility
    element.style.contentVisibility = 'visible'
    element.getBoundingClientRect()
    element.style[property] = `${element[scrollProperty]}px`
    element.style.contentVisibility = originalValue
  }

  /**
   * Removes the animated property from the element.
   *
   * @param element - The DOM element that is going to be animated.
   */
  function cleanUpAnimationStyles(element: HTMLElement): void {
    element.style.removeProperty(property)
  }

  /**
   * Changes the element's animated property from the element's content size to 0.
   *
   * @param element - The DOM element that is going to be animated.
   */
  function collapse(element: HTMLElement): void {
    element.style[property] = `${element[scrollProperty]}px`
    // This is intended. We want to provoke a layer repaint to apply this style.
    element.getBoundingClientRect()
    element.style[property] = '0'
  }

  return {
    expand,
    cleanUpAnimationStyles,
    collapse,
  }
}
