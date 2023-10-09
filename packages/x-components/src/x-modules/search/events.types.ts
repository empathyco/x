import {
  Facet,
  Result,
  Sort,
  Redirection,
  TaggingRequest,
  Promoted,
  Banner
} from '@empathyco/x-types';
import { Dictionary } from '@empathyco/x-utils';
import { InternalSearchRequest, InternalSearchResponse } from './types';

/**
 * Dictionary of the events of Search XModule, where each key is the event name, and the value is
 * the event payload type or `void` if it has no payload.
 *
 * @public
 */
export interface SearchXEvents {
  /**
   * The facets have changed.
   * Payload: The {@link @empathyco/x-types#Facet | facets} array.
   */
  FacetsChanged: Facet[];
  /**
   * Page has been changed.
   * Payload: The new page number.
   */
  PageChanged: number;
  /**
   * Results have been changed.
   * Payload: The new {@link @empathyco/x-types#Result | results}.
   */
  ResultsChanged: Result[];
  /**
   * Any property of the search request has changed.
   * Payload: The new search request or `null` if there is not enough data in the state
   * to conform a valid request.
   */
  SearchRequestChanged: InternalSearchRequest | null;
  /**
   * Any property of the search request has been updated.
   * Payload: The new search request or `null` if there is not enough data in the state to
   * conform a valid request.
   *
   * @remarks The difference from `SearchRequestChanged` and this event is this one will be executed
   * with more priority (As it is not a `...Changed` event). So we can use this event to modify
   * request params before emitting the `SearchRequestChanged` and fetch the API.
   */
  SearchRequestUpdated: InternalSearchRequest | null;
  /**
   * A search response has been provided.
   * Payload: The provided internal response object.
   */
  SearchResponseChanged: InternalSearchResponse;
  /**
   * Query tagging has been changed.
   * Payload: The new query tagging object.
   */
  SearchTaggingChanged: TaggingRequest;
  /**
   * Sort has been changed.
   * Payload: The new sort string.
   */
  SortChanged: string;
  /**
   * Spellcheck has been changed.
   * Payload: The new spellcheckedQuery string.
   */
  SpellcheckChanged: string;
  /**
   * The user has clicked one of the sorts.
   * Payload: The sort option that the user has selected.
   */
  UserClickedASort: Sort;
  /**
   * A new selected sort has been provided.
   * Payload: The sort option that has been provided.
   *
   * @remarks This event is used when the user of the library wants to provide their own selected
   * sort value.
   */
  SelectedSortProvided: Sort;
  /**
   * Partial query has been set.
   * Payload: The new query string.
   */
  UserClickedPartialQuery: string;
  /**
   * The user reached the limit of the scrollable content in a results list.
   */
  UserReachedResultsListEnd: void;
  /**
   * The user has clicked a redirection.
   * Payload: The clicked redirection.
   */
  UserClickedARedirection: Redirection;
  /**
   * The user has clicked a promoted.
   * Payload: The clicked promoted.
   */
  UserClickedAPromoted: Promoted;
  /**
   * The user has clicked a banner.
   * Payload: The clicked banner.
   */
  UserClickedABanner: Banner;
  /**
   * The user has aborted a redirection.
   */
  UserClickedAbortARedirection: void;

  SearchNewConfig: Dictionary<unknown>;
}
