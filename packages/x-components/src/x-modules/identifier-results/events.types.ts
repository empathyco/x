import { IdentifierResultsRequest, Result } from '@empathyco/x-types';

/**
 * Dictionary of the events of IdentifierResults XModule, where each key is the event name, and the
 * value is the event payload type or `void` if it has no payload.
 *
 * @public
 */
export interface IdentifierResultsXEvents {
  /**
   * Identifier results have been changed.
   * Payload: The new {@link @empathyco/x-types#Result | identifier results}.
   */
  IdentifierResultsChanged: Result[];
  /**
   * Any property of the identifier results request has changed.
   * Payload: The new {@link @empathyco/x-types#IdentifierResultsRequest | identifier  result
   * request} or `null` if there is not enough data in the state nto conform a valid request.
   */
  IdentifierResultsRequestChanged: IdentifierResultsRequest | null;
  /**
   * A identifier result has been clicked.
   * Payload: The {@link @empathyco/x-types#Result | result}.
   */
  UserClickedAIdentifierResult: Result;
}
