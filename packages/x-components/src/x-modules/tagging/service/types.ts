import type { Result } from '@empathyco/x-types'

/**
 * Service to handle the workflow for tracking add to cart from PDP.
 *
 * @public
 */
export interface ExternalTaggingService {
  /**
   * Stores in the local storage the information from the Result clicked by the user
   * in order to be able to track the add to cart later on the result's PDP.
   *
   * @param result - The result to store.
   */
  storeResultClicked: (result: Result) => void

  /**
   * Stores in the local storage the information from the Result added to the cart
   * by the user in order to be able to track the checkout later on when the checkout
   * process has been completed by shopper.
   *
   * @param result - The result to store.
   */
  storeAddToCart: (result: Result) => void

  /**
   * Checks if the local storage contains a result information for the given id and moves
   * the result info from the local storage to the session storage.
   *
   * @param id - The id of the result to move to the session storage.
   */
  moveToSessionStorage: (id?: string) => void

  /**
   * Checks if the session storage contains a result information for a given id or the current url.
   * If exists, it tracks the add to cart and saves the add to cart information into session
   * storage.
   *
   * @param id - The id of the result to track.
   */
  trackAddToCart: (id?: string) => void
}
