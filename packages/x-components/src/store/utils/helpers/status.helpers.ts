/**
 * Status state type, containing a property to hold the status property.
 *
 * @public
 */
export interface StatusState {
  /** The request status. Useful for changing the displayed component depending on whether the
   * request has succeeded, has not been fulfilled or has failed. */
  status: RequestStatus;
}

/**
 * Status mutations, containing a method to change the current status.
 *
 * @public
 */
export interface StatusMutations {
  /**
   * Sets the request status.
   *
   * @param status - The new request status.
   */
  setStatus(status: RequestStatus): void;
}

/**
 * The possible status of a request:
 * - Success: The request has resolved successfully.
 * - Loading: The request is in process, waiting for a response.
 * - Error: The request has failed.
 *
 * @public
 */
export type RequestStatus = 'success' | 'loading' | 'error';

/**
 * Sets the request status. Can be used as a mutation.
 *
 * @param state - The {@link https://vuex.vuejs.org/guide/state.html | state} provided by Vuex.
 * @param status - The new request status.
 * @public
 */
export function setStatus(state: StatusState, status: RequestStatus): void {
  state.status = status;
}
