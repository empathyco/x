import { Result } from '@empathyco/x-types';

/**
 * Service to manage the session id.
 *
 * @public
 */
export interface SessionService {
  /**
   * Gets the current session id from the storage.
   *
   * @remarks If a session id is outdated or does not exist,
   * a new one is created.
   *
   * @returns The session id.
   */
  getSessionId(): string;
  /**
   * Remove the session id.
   */
  clearSessionId(): void;
}

/**
 * Service to handle the workflow for tracking add to cart from PDP.
 *
 * @public
 */
export interface PDPAddToCartService {
  /**
   * Stores in the local storage the information from the Result clicked by the user
   * in order to be able to track later on.
   *
   * @param result - The result to store.
   */
  storeResultClicked(result: Result): void;

  /**
   * Checks if the local storage contains a result information for the given id and moves
   * the result info from the local storage to the session storage.
   *
   * @param id - The id of the result to move to the session storage.
   */
  moveToSessionStorage(id: string): void;

  /**
   * Checks if the session storage contains a result information for given id or the current url
   * and tracks the add to cart if exists.
   *
   * @param id - The id of the result to track.
   */
  trackAddToCart(id?: string): void;
}
