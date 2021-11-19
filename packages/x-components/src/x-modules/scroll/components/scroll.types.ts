/**
 * Methods to initialise and cease visibility observing.
 *
 * @public
 */
export interface ScrollVisibilityObserver {
  /**
   * Starts observing the provided element.
   *
   * @param element - The element to observe if it has entered in the view.
   */
  observe(element: HTMLElement): void;
  /**
   * Stops observing the provided element.
   *
   * @param element - The element to stop observing if it has entered in the view.
   */
  unobserve(element: HTMLElement): void;
}
