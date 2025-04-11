/**
 * Returns true if the two elements are the same, or if `b` is a child of `a`.
 *
 * @param a - The element to check if it is equal to `b` or if it contains `b`.
 * @param b - The element to check if it is equal to `a` or contained inside it.
 * @returns True if `a` is equal to `b` or if it contains `b`.
 *
 * @public
 */
export function isElementEqualOrContained(a: Element, b: Element): boolean {
  return a === b || a.contains(b)
}

/**
 * Returns the target element for a given event. The target element is obtained from `composedPath`
 * Event method because if the event is triggered inside a Shadow DOM context, `event.target` points
 * to Shadow DOM element, not the element that triggered the event. `composedPath` method also is
 * available in a non-shadow DOM context.
 *
 * @remarks In a shadow DOM context, this function only works if the Shadow DOM uses `open`
 * encapsulation mode.
 *
 * @param event - Event which takes place in the DOM.
 * @returns Target Element of the event.
 *
 * @public
 */
export function getTargetElement(event: Event): Element {
  return event.composedPath()[0] as Element
}

/**
 * Retrieves the currently active element from the specified document or shadow root.
 * This function is recursive to handle nested shadow DOMs, ensuring the actual active
 * element is returned even if it resides deep within multiple shadow DOM layers.
 *
 * @param root - The root document or shadow root from which to retrieve the active element.
 * Defaults to the global document if not specified.
 * @returns The active element if one exists, or null if no active element can be found.
 * In the context of shadow DOM, this will return the deepest active element
 * within nested shadow roots.
 *
 * @public
 */
export function getActiveElement(root: Document | ShadowRoot = document): Element | null {
  let current = root.activeElement
  while (current?.shadowRoot) {
    current = current.shadowRoot.activeElement
  }
  return current
}
