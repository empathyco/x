import { SearchRequest } from '@empathyco/x-adapter';
import { Facet, Result, Sort } from '@empathyco/x-types';

/**
 * Dictionary of the events of Search XModule, where each key is the event name, and the value is
 * the event payload type or `void` if it has no payload.
 *
 * @public
 */
export interface SearchXEvents {
  /**
   * The facets have changed.
   * * Payload: The {@link @empathyco/x-types#Facet | facets} array.
   */
  FacetsChanged: Facet[];
  /**
   * Page has been changed.
   * * Payload: The new page number.
   */
  PageChanged: number;
  /**
   * Results have been changed.
   * * Payload: The new {@link @empathyco/x-types#Result | results}.
   */
  ResultsChanged: Result[];
  /**
   * Any property of the search request has changed.
   * * Payload: The new search request or `null` if there is not enough data in the state
   * to conform a valid request.
   */
  SearchRequestChanged: SearchRequest | null;
  /**
   * Sort has been changed.
   * * Payload: The new sort string.
   */
  SortChanged: string;
  /**
   * Spellcheck has been changed.
   * * Payload: The new spellcheckedQuery string.
   */
  SpellcheckChanged: string;
  /**
   * The user has clicked one of the sorts.
   * * Payload: The sort option that the user has selected.
   */
  UserClickedASort: Sort;
  /**
   * A new selected sort has been provided.
   * * Payload: The sort option that has been provided.
   *
   * @remarks This event is used when the user of the library wants to provide their own selected
   * sort value.
   */
  SelectedSortProvided: Sort;
  /**
   * Partial query has been set.
   * * Payload: The new query string.
   */
  UserClickedPartialQuery: string;
  /**
   * The user reached the limit of the scrollable content in a results list.
   */
  UserReachedResultsListEnd: void;
}
