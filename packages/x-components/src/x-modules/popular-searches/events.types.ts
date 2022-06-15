import { Suggestion, PopularSearchesRequest } from '@empathyco/x-types';

/**
 * Dictionary of the events of PopularSearches XModule, where each key is the event name, and the
 * value is the event payload type or `void` if it has no payload.
 *
 * @public
 */
export interface PopularSearchesXEvents {
  /**
   * Any property of the popular-searches request has changed
   * Payload: The new {@link @empathyco/x-types#PopularSearchesRequest | popular-search request}.
   */
  PopularSearchesRequestChanged: PopularSearchesRequest;
  /**
   * The popular searches have been displayed.
   * Payload: The displayed {@link @empathyco/x-types#Suggestion | popular searches}.
   */
  PopularSearchDisplayed: Suggestion[];
  /**
   * User selected a popular search
   * Payload: The popular search that the user selected.
   */
  UserSelectedAPopularSearch: Suggestion;
}
