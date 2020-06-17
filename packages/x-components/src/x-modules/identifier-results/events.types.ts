import { SearchByIdRequest } from '@empathy/search-adapter';
import { Result } from '@empathy/search-types';

/**
 * Dictionary of the events of IdentifierResults XModule, where each key is the event name, and the
 * value is the event payload type or `void` if it has no payload.
 *
 * @public
 */
export interface IdentifierResultsXEvents {
  /**
   * Identifier results have been changed.
   * * Payload: The new {@link @empathy/search-types#Result | identifier results}.
   */
  IdentifierResultsChanged: Result[];
  /**
   * Any property of the identifier results request has changed.
   * * Payload: The new {@link @empathy/search-adapter#SearchByIdRequest | identifier  result
   * request} or `null` if there is not enough data in the state nto conform a valid request.
   */
  IdentifierResultsRequestChanged: SearchByIdRequest | null;
  /**
   * A identifier result has been clicked.
   * * Payload: The {@link @empathy/search-types#Result | result}.
   */
  UserClickedAIdentifierResult: Result;
}
