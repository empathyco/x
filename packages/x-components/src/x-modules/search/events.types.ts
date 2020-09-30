import { SearchRequest } from '@empathy/search-adapter';
import { Facet, Result } from '@empathy/search-types';

/**
 * Dictionary of the events of Search XModule, where each key is the event name, and the value is
 * the event payload type or `void` if it has no payload.
 *
 * @public
 */
export interface SearchXEvents {
  /**
   * Results have been changed.
   * * Payload: The new {@link @empathy/search-types#Result | results}.
   */
  ResultsChanged: Result[];
  /**
   * Any property of the search request has changed.
   * * Payload: The new search request or `null` if there is not enough data in the state
   * to conform a valid request.
   */
  SearchRequestChanged: SearchRequest | null;
  /**
   * Facets have been changed.
   * * Payload: The new {@link @empathy/search-types#Facet | facets}.
   */
  FacetsChanged: Facet[];
}
